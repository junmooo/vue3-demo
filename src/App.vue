<template>
  <div
    class="app-ctn"
    :style="{
      paddingTop: `${commonStore.$state.screenInfo.statusBarHeight}px`,
      height: `${commonStore.$state.screenInfo.screenHeight - commonStore.$state.screenInfo.statusBarHeight}px`,
    }"
  >
    <div style="position: absolute">
      <!-- <div class="content" :style="{ paddingTop: `${commonStore.getStatusBarHeight()}px`, color: '#f00' }"> -->
        <!-- 软键盘弹起时隐藏底部导航栏 -->
        <!-- <template v-if="!commonStore.$state.isKeyboardVisible">
          <van-tabbar v-model="active" :style="{ paddingBottom: `${commonStore.$state.screenInfo.bottomBarHeight}px` }">
            <van-tabbar-item icon="chat-o">AI对话</van-tabbar-item>
            <van-tabbar-item icon="photo-o">文生图</van-tabbar-item>
            <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
          </van-tabbar>
        </template> -->
      <!-- </div> -->
      <a-i-chat-dialog v-if="active === 0" />
    </div>
  </div>
</template>
<script setup>
  import { useCommonStore } from '@/stores/common';
  import AIChatDialog from '@/components/AIChatDialog.vue';
  import { ref, onMounted } from 'vue';
  import Bridge from '@/utils/bridge';

  const commonStore = useCommonStore();
  const active = ref(0);


  onMounted(() => {
    new Bridge()
      .sendWithResult({
        type: 'getStatusBarHeight',
      })
      .then((resp) => {
        commonStore.setScreenInfo(resp);
      });

    window.postMessageToJs = (e) => {
      commonStore.setKeyboardVisible(e.visible)
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

    .content {
      flex: 1;
      width: 100%;
    }
  }
</style>
