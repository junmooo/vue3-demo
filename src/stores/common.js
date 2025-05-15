// stores/counter.js
import Bridge from '@/utils/bridge';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      screenInfo: {},
      uid: null,
      isKeyboardVisible: false,
      deviceInfo: {},
      statusBarHeight: undefined,
    };
  },

  actions: {
    setUid(uid) {
      this.uid = uid;
    },
    async getStatusBarHeight() {
      console.log(37, this.statusBarHeight);

      if (this.statusBarHeight) {
        console.log(39, this.statusBarHeight);
        return this.statusBarHeight;
      }
      new Bridge()
        .sendWithResult({
          type: 'getStatusBarHeight',
        })
        .then((res) => {
          console.log('getStatusBarHeight', res);
          this.statusBarHeight = res.statusBarHeight ?? 0;
          this.notchHeight = res.notchHeight;
          this.screenInfo = res;
          console.log(49, this.statusBarHeight);

          return this.statusBarHeight;
        })
        .catch((err) => {
          console.log('getStatusBarHeight', err);
          return 0;
        })
        .finally(() => {
          console.log('getStatusBarHeight', this.statusBarHeight);
          return 0;
        });
    },

    setScreenInfo(screenInfo) {
      this.screenInfo = screenInfo;
    },

    setKeyboardVisible(isVisible) {
      this.isKeyboardVisible = isVisible;
    },
    setDeviceInfo(deviceInfo) {
      this.deviceInfo = deviceInfo;
    },
  },
});
