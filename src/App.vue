<template>
    <div id="app" v-loading="loading">
        <!-- <h1>WebSocket Chat</h1> -->
        <refresh-comp @refresh="refresh" />
        <div style="position: fixed; inset-block-end: 50px">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 6 }"
                v-model="question"
                clearable
                placeholder="请输入你的问题"
                size="large"
                style="inline-size: 60vw; margin-inline-end: 20px"
            />
            <el-button type="primary" @click="websocketsend" size="large"> 确认 </el-button>
        </div>
        <chat-container :messages="messages" />
    </div>
</template>

<script>
    import RefreshComp from './components/RefreshComp.vue';
    import ChatContainer from './components/ChatContainer.vue';
    export default {
        data() {
            return {
                // socket参数
                socket: null,
                timeout: 20 * 1000, // 45秒一次心跳
                timeoutObj: null, // 心跳心跳倒计时
                serverTimeoutObj: null, // 心跳倒计时
                timeoutnum: null, // 断开 重连倒计时
                lockReconnect: false, // 防止
                websocket: null,
                question: null,
                messages: {},
                speaking: false,
                loading: false,
            };
        },
        // provide() {
        //   return {
        //     messages: this.messages
        //   }
        // },
        components: {
            RefreshComp,
            ChatContainer,
        },
        mounted() {
            this.initWebSocket(); // userId为socket链接的参数
            this.scrollToBottom();
        },
        unmounted() {
            this.websocket.close();
        },
        methods: {
            scrollToBottom() {
                this.$nextTick(() => {
                    const container = document.getElementById('scroll-box');
                    container.scrollTop = container.scrollHeight;
                });
            },
            refresh() {
                console.log('refresh', 72, this.messages);
                this.messages = {};
            },
            initWebSocket() {
                // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
                let wsUrl = `${process.env.VUE_APP_WEBSOCKET_URL}${process.env.VUE_APP_USER_ID}`;
                this.websocket = new WebSocket(wsUrl);
                this.websocket.onopen = this.websocketonopen;
                this.websocket.onerror = this.websocketonerror;
                this.websocket.onmessage = this.setOnmessageMessage;
                this.websocket.onclose = this.websocketclose;
                // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                // window.onbeforeunload = that.onbeforeunload
            },
            start() {
                //清除延时器
                this.timeoutObj && clearTimeout(this.timeoutObj);
                this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
                this.timeoutObj = setTimeout(() => {
                    if (this.websocket && this.websocket.readyState == 1) {
                        this.websocket.send(JSON.stringify([{ heartBath: 'hi' }])); //发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
                    } else {
                        this.reconnect();
                    }
                    //定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
                    this.serverTimeoutObj = setTimeout(() => {
                        this.websocket.close();
                    }, this.timeout);
                }, this.timeout);
            },
            reset() {
                // 重置心跳
                // 清除时间
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                // 重启心跳
                this.start();
            },

            // 重新连接
            reconnect() {
                if (this.lockReconnect) return;
                this.lockReconnect = true;
                //没连接上会一直重连，设置延迟避免请求过多
                this.timeoutnum && clearTimeout(this.timeoutnum);
                this.timeoutnum = setTimeout(() => {
                    this.initWebSocket();
                    this.lockReconnect = false;
                }, 5000);
            },
            async setOnmessageMessage(event) {
                if (event.data === '!$over$!') {
                    console.log('这一轮对话结束！');
                    // this.closeWebSocket();
                    this.question = null;
                } else if (event.data === 'alive') {
                    console.log('heartBath', 'alive');
                } else {
                    this.loading = false;
                    console.log(event.data, '获得消息');
                    let { requestId, content } = JSON.parse(event.data);
                    this.messages[requestId] = {
                        question: this.question,
                        answer: content,
                    };
                    this.scrollToBottom();
                }

                this.reset();
                // 自定义全局监听事件
                window.dispatchEvent(
                    new CustomEvent('onmessageWS', {
                        detail: {
                            data: event.data,
                        },
                    }),
                );
                //发现消息进入    开始处理前端触发逻辑
                if (event.data === 'success' || event.data === 'heartBath') return;
            },
            websocketonopen() {
                //开启心跳
                this.start();
                console.log(
                    'WebSocket连接成功!!!' + new Date() + '----' + this.websocket.readyState,
                );
            },
            websocketonerror(e) {
                this.reset();
                this.loading = false;
                console.log('WebSocket连接发生错误' + e);
            },
            websocketclose() {
                this.websocket.close();
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                console.log('WebSocket连接关闭');
            },
            websocketsend() {
                this.speaking = true;
                if (this.question?.trim()) {
                    this.loading = true;
                    this.websocket.send(
                        JSON.stringify([
                            ...Object.values(this.messages),
                            { question: this.question },
                        ]),
                    );
                }
            },
            // closeWebSocket() {
            //   // 关闭websocket
            //   this.websocket.close();
            // },
            // getSocketData(res) {
            //   if (res.detail.data === "alive") {
            //     console.log(123, res);
            //     return;
            //   }
            //   // ...业务处理
            //   console.log(126, res);
            // },
        },
    };
</script>

<style lang="less">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .box-card {
            min-inline-size: 50px;
            max-inline-size: 60vw;
            text-align: start;
            /* margin-block-end: 20px; */
            font-size: 16px;
            font-weight: 600;
        }

        .box-card .vuepress-markdown-body {
            padding: 0 !important;
        }
    }
</style>
