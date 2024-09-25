// stores/counter.js
import Bridge from '@/utils/bridge';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
  state: () => {
    return { screenInfo: {}, uid: null, isKeyboardVisible: false };
  },

  actions: {
    setUid(uid) {
      this.uid = uid;
    },
    async getStatusBarHeight() {
      if (this.statusBarHeight) {
        return this.statusBarHeight;
      }
      const res = await new Bridge().sendWithResult({
        type: 'getStatusBarHeight',
      });
      this.statusBarHeight = res.statusBarHeight;
      this.notchHeight = res.notchHeight;
    },

    setScreenInfo(screenInfo) {
      this.screenInfo = screenInfo;
    },

    setKeyboardVisible(isVisible) {
      this.isKeyboardVisible = isVisible;
    }
  },
});
