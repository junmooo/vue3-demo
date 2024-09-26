// stores/counter.js
import Bridge from '@/utils/bridge';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      screenInfo: {},
      uid: null,
      isKeyboardVisible: false,
      //   {
      //     "systemName": "iOS",
      //     "isPhysicalDevice": false,
      //     "utsname": {
      //         "release": "24.0.0",
      //         "sysname": "Darwin",
      //         "nodename": "MacBook-Pro-2.local",
      //         "machine": "iPhone17,3",
      //         "version": "Darwin Kernel Version 24.0.0: Mon Aug 12 20:52:18 PDT 2024; root:xnu-11215.1.10~2/RELEASE_ARM64_T8122"
      //     },
      //     "model": "iPhone",
      //     "localizedModel": "iPhone",
      //     "systemVersion": "18.0",
      //     "name": "iPhone 16",
      //     "identifierForVendor": "894C02DE-8BFF-4BFD-973C-94FA4183091F"
      // }
      deviceInfo: {},
    };
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
    },
    setDeviceInfo(deviceInfo) {
      this.deviceInfo = deviceInfo;
    },
  },
});
