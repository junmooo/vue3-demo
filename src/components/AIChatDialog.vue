<template>
  <div v-loading="loading">
    <chat-container :messages="messages" />
    <van-field
      class="input-ctn"
      :style="{ bottom: `calc(${computedBottomHeight}px)` }"
      v-model="question"
      center
      clearable
      type="textarea"
      placeholder="请输入您的问题"
    >
      <template #button>
        <van-icon name="guide-o" color="#409EFC" size="2em" @click="websocketSend"/>
      </template>
    </van-field>
  </div>
</template>

<script setup>
  import ChatContainer from './custom/ChatContainer.vue';
  import { nextTick, onMounted, ref, onBeforeUnmount, computed } from 'vue';
  import { AIGC_WS_URL } from '@/api/aigc';
  import { useCommonStore } from '@/stores/common';

  const commonStore = useCommonStore();

  const timeout = 45 * 1000; // 45秒一次心跳
  const timeoutObj = ref(null); // 心跳心跳倒计时
  const serverTimeoutObj = ref(null); // 心跳倒计时
  const timeoutNum = ref(null); // 断开 重连倒计时
  const lockReconnect = ref(false); // 防止
  const websocket = ref(null);
  const question = ref(null);
  const messages = ref({});
  const speaking = ref(false);
  const loading = ref(false);
  const scrollToBottom = () => {
    nextTick(() => {
      const container = document.getElementById('scroll-box');
      if (container) container.scrollTop = container?.scrollHeight;
    });
  };
  const computedBottomHeight = computed(() => {
    if (commonStore?.$state?.isKeyboardVisible) return 1;
    return (commonStore?.$state?.screenInfo?.bottomBarHeight ?? 0);
  });
  const initWebSocket = () => {
    const uid = JSON.parse(localStorage.getItem('login-info') ?? '{"id":123456}')?.id;
    // const VUE_APP_USER_ID = 'junmooo-123456';
    // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
    let wsUrl = `${AIGC_WS_URL}/${uid}`;
    websocket.value = new WebSocket(wsUrl);
    websocket.value.onopen = websocketOnOpen;
    websocket.value.onerror = websocketOnError;
    websocket.value.onmessage = setOnmessageMessage;
    websocket.value.onclose = websocketClose;
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    // window.onbeforeunload = that.onbeforeunload
  };

  const start = () => {
    //清除延时器
    timeoutObj.value && clearTimeout(timeoutObj.value);
    serverTimeoutObj.value && clearTimeout(serverTimeoutObj.value);
    timeoutObj.value = setTimeout(() => {
      if (websocket.value && websocket.value.readyState == 1) {
        websocket.value.send(JSON.stringify([{ heartBath: 'hi' }])); //发送消息，服务端返回信息，即表示连接良好，可以在socket的onmessage事件重置心跳机制函数
      } else {
        reconnect();
      }
      //定义一个延时器等待服务器响应，若超时，则关闭连接，重新请求server建立socket连接
      serverTimeoutObj.value = setTimeout(() => {
        websocket.value?.close();
      }, timeout);
    }, timeout);
  };
  const reset = () => {
    // 重置心跳
    // 清除时间
    if (timeoutObj.value && serverTimeoutObj.value) {
      clearTimeout(timeoutObj.value);
      clearTimeout(serverTimeoutObj.value);
    }
    // 重启心跳
    start();
  };

  // 重新连接
  const reconnect = () => {
    if (lockReconnect.value) return;
    lockReconnect.value = true;
    //没连接上会一直重连，设置延迟避免请求过多
    timeoutNum.value && clearTimeout(timeoutNum.value);
    timeoutNum.value = setTimeout(() => {
      initWebSocket();
      lockReconnect.value = false;
    }, 5000);
  };

  const setOnmessageMessage = async (event) => {
    if (event.data === '!$over$!') {
      console.log('这一轮对话结束！');
      question.value = null;
    } else if (event.data === 'alive') {
      console.log('heartBath', 'alive');
    } else {
      loading.value = false;
      console.log(event.data, '获得消息');
      let { requestId, content } = JSON.parse(event.data);
      messages.value[requestId] = {
        question: question.value,
        answer: content,
      };
      scrollToBottom();
    }

    reset();
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
  };

  const websocketOnOpen = () => {
    //开启心跳
    start();
    console.log('WebSocket连接成功!!!' + new Date() + '----' + websocket.value?.readyState);
  };
  const websocketOnError = (e) => {
    reset();
    loading.value = false;
    console.log('WebSocket连接发生错误' + e);
  };
  const websocketClose = () => {
    websocket.value?.close();
    timeoutObj.value && clearTimeout(timeoutObj.value);
    serverTimeoutObj.value && clearTimeout(serverTimeoutObj.value);
    console.log('WebSocket连接关闭');
  };
  const websocketSend = () => {
    speaking.value = true;
    if (question.value?.trim()) {
      loading.value = true;
      websocket.value?.send(JSON.stringify([...Object.values(messages.value), { question: question.value }]));
    }
  };

  onMounted(() => {
    initWebSocket(); // userId为socket链接的参数
    scrollToBottom();
  });
  onBeforeUnmount(() => {
    websocket.value?.close();
  });
</script>
<style scoped lang="less">
  .input-ctn {
    position: fixed;
    display: flex;
  }
</style>
