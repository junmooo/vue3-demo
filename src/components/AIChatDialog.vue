<template>
  <div :style="{ width: '100vw' }">
    <van-nav-bar
      title="AI 对话"
      left-text="退出登录"
      left-arrow
      @click-left="back"
      @click-right="onClickRight"
      :style="{ width: '100vw', marginTop: `${commonStore?.statusBarHeight ?? 0}px` }"
      right-text="历史记录"
      fixed
    />
    <div
      :style="{
        height: `calc(100vh - 46px - ${commonStore?.statusBarHeight ?? 0}px)`,
        overflow: 'scroll',
        marginTop: `${commonStore?.statusBarHeight + 46 ?? 0}px`,
      }"
    >
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
          <van-icon name="guide-o" color="#409EFC" size="2em" @click="send" />
        </template>
      </van-field>
    </div>
  </div>
</template>

<script setup>
  import ChatContainer from './custom/ChatContainer.vue';
  import { nextTick, onMounted, ref, onBeforeUnmount, computed, defineEmits } from 'vue';
  import { AIGC_URL } from '@/api/aigc';
  import { useCommonStore } from '@/stores/common';
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import { showToast } from 'vant';

  const commonStore = useCommonStore();

  const question = ref(null);
  const messages = ref({});
  const speaking = ref(false);
  const loading = ref(false);
  const emit = defineEmits(['changeActive']);

  const scrollToBottom = () => {
    nextTick(() => {
      const container = document.getElementById('scroll-box');
      if (container) container.scrollTop = container?.scrollHeight;
    });
  };
  const computedBottomHeight = computed(() => {
    if (commonStore?.$state?.isKeyboardVisible) return 1;
    return commonStore?.$state?.screenInfo?.bottomBarHeight ?? 0;
  });

  const send = () => {
    speaking.value = true;
    if (question.value?.trim()) {
      loading.value = true;

      fetchEventSource(`${AIGC_URL}/aigc/t-2-t`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token'),
        },
        body: JSON.stringify([...Object.values(messages.value), { question: question.value }]),
        async onopen(response) {
          console.log(77, response.headers.get('content-type'));

          if (response.ok) {
            return; //一切正常
          } else if (response.status == 403) {
            showToast({ icon: 'warning-o', message: '登录过期，请重新登录！' });
            emit('changeActive', 1);
          } else {
            throw new Error('服务异常');
          }
        },
        onmessage(msg) {
          //如果服务器发出错误消息，抛出异常
          //以便由下面的onerror回调处理：
          if (msg.event === 'FatalError') {
            throw new Error(msg.data);
          }
          if (msg.data === '!$over$!') {
            console.log('这一轮对话结束！');
            question.value = null;
          } else if (msg.data === 'alive') {
            console.log('heartBath', 'alive');
          } else {
            loading.value = false;
            console.log(msg.data, '获得消息');
            let { requestId, content } = JSON.parse(msg.data);
            messages.value[requestId] = {
              question: question.value,
              answer: content,
            };
            scrollToBottom();
          }
        },
        onclose() {
          //如果服务器意外关闭连接，重试：
          console.log('close！');
        },
        onerror(err) {
          if (err instanceof Error) {
            throw err; //重新抛出以终止操作
          } else {
            //不做任何事，自动重试。也可以在这里返回特定的重试间隔。
          }
        },
      });
    }
  };

  const onClickRight = () => {
    emit('changeActive', 2);
  };

  const back = () => {
    localStorage.removeItem('login-info');
    localStorage.removeItem('token');
    emit('changeActive', 1);
  };

  onMounted(() => {
    // initWebSocket(); // userId为socket链接的参数
    scrollToBottom();
  });
  onBeforeUnmount(() => {
    // websocket.value?.close();
  });
</script>
<style scoped lang="less">
  .input-ctn {
    position: fixed;
    display: flex;
  }
</style>
