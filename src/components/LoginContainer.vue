<template>
  <div class="login-container" :style="{ height: `${computedHeight}` }">
    <div class="title">{{ isLogin ? '登录' : '注册' }}</div>
    <van-form>
      <van-cell-group inset class="input-group">
        <!-- 输入任意文本 -->
        <van-field v-model="username" label="账号" label-align="center" placeholder="请输入账号" />
        <!-- 输入密码 -->
        <van-field v-model="password" type="password" label-align="center" placeholder="请输入密码" label="密码" />
      </van-cell-group>
      <van-cell-group inset class="button-group">
        <div style="color: #8147e5d4; font-size: 14px; font-weight: 400" @click="toggleLoginOrRegister()">
          {{ isLogin ? '去注册' : '去登录' }}
        </div>
        <van-button
          type="primary"
          color="#8147E530"
          size="small"
          style="width: 200px"
          @click="isLogin ? submitForm() : registerFn()"
        >
          确定
        </van-button>
      </van-cell-group>
    </van-form>
  </div>
</template>

<script setup>
  import { register, login } from '@/api/aigc';
  import { showNotify } from 'vant';
  import 'vant/es/notify/style';
  import Bridge from '@/utils/bridge';

  import { ref, computed, defineEmits } from 'vue';
  import { useCommonStore } from '@/stores/common';
  import { setCookie } from '@/utils/cookie_utils';

  const commonStore = useCommonStore();

  const username = ref('');
  const password = ref('');
  const info = ref({});
  const isLogin = ref(true);
  const emit = defineEmits(['changeActive']);
  
  const computedHeight = computed(() => {
      if (commonStore?.$state?.screenInfo?.screenHeights) {
        return (
          commonStore?.$state?.screenInfo?.screenHeight -
          commonStore.$state.screenInfo?.statusBarHeight -
          (commonStore?.$state?.screenInfo?.bottomBarHeight ?? 1) -
          134 +
          'px'
        );
      }
      return 'calc(100vh - 130px)';
    });
  const submitForm = async () => {
    const res = await login({
      name: username.value,
      pwd: password.value,
    });

    if (res.code === 0) {
      setCookie('token', res?.data?.token);
      localStorage.setItem('login-info', JSON.stringify(res?.data?.user));
      localStorage.setItem('token', res?.data?.token);
      new Bridge().sendWithResult({
        type: 'setUserInfo',
        params: res.data,
      });
      emit('changeActive', 0);
      showNotify({ type: 'success', position: 'bottom', message: '登录成功！' });
    } else {
      showNotify({ type: 'warning', position: 'bottom', message: '登录失败，请联系管理员！' });
    }
  };
  const registerFn = async () => {
    const res = await register({
      name: username.value,
      pwd: password.value,
    });
    if (res.code === 0) {
      isLogin.value = true;
      showNotify({ type: 'success', position: 'bottom', message: '注册成功！' });
      isLogin.value = true;
    } else {
      showNotify({ type: 'warning', position: 'bottom', message: '注册失败！' });
    }
  };

  const toggleLoginOrRegister = () => {
    isLogin.value = !isLogin.value;
    username.value = '';
    password.value = '';
    new Bridge()
      .sendWithResult({
        type: 'getUserInfo',
      })
      .then((res) => {
        console.log('getUserInfo', res);
        info.value = res;
      });
  };
  
</script>
<style scoped lang="less">
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    .title {
      font-size: 24px;
      font-weight: 400;
      color: #f2ebfeda;
      margin-bottom: 20px;
    }
    .input-group {
      background-color: transparent;
    }
    .button-group {
      margin-top: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: transparent;
    }
  }
</style>
