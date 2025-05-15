<template>
  <div class="app-ctn">
    <div>
      <login-container v-if="active === 1" @changeActive="changeActive" />
      <a-i-chat-dialog v-if="active === 0" @changeActive="changeActive" />
      <a-i-chat-history v-if="active === 2" @changeActive="changeActive" />
    </div>
  </div>
</template>
<script setup>
  import { useCommonStore } from '@/stores/common';
  import AIChatDialog from '@/components/AIChatDialog.vue';
  import LoginContainer from '@/components/LoginContainer.vue';
  import AIChatHistory from '@/components/AIChatHistory.vue';
  import { ref, onMounted } from 'vue';
  import Bridge from '@/utils/bridge';

  const commonStore = useCommonStore();
  const active = ref(2);
  const sth = ref();

  const changeActive = (val) => {
    active.value = val;
  };

  onMounted(() => {
    console.log(navigator.userAgent, 32);
    sth.value = navigator.userAgent;
    commonStore.getStatusBarHeight();
    if (!localStorage.getItem('login-info')) {
      new Bridge()
        .sendWithResult({
          type: 'getUserInfo',
        })
        .then((data) => {
          localStorage.setItem('login-info', JSON.stringify(data?.user));
          localStorage.setItem('token', data?.token);
          // active.value = 0;
        });
    } else {
      console.log(47, active.value);
      // active.value = 2;
    }

    window.postMessageToJs = (e) => {
      if (e.type === 'isKeyboardVisible') {
        commonStore.setKeyboardVisible(e.visible);
      } else if (e.type === 'deviceInfo') {
        commonStore.setDeviceInfo(e.deviceInfo);
      }
    };
  });
</script>

<style scoped lang="less">
  .app-ctn {
    width: 100%;
    // 渐变背景色 四角到中心渐变
    background-image: linear-gradient(135deg, rgb(220, 203, 238) 0%, rgb(165, 181, 209) 50%, rgb(214, 210, 173) 100%);
    display: flex;
    flex-direction: column;
    height: 100vh;
    // overflow: 'scroll';

    .content {
      flex: 1;
      width: 100%;
    }
  }
</style>
