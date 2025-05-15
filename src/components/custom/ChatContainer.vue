<template>
  <div class="chat-ctn" :style="{ height: `${computedHeight}px` }" id="scroll-box">
    <div v-for="msg in Object.values(props.messages)" v-bind:key="msg" class="chat-card">
      <div class="question">
        <el-card class="box-card" style="background-color: aliceblue">
          <div class="text item">{{ msg.question }}</div>
        </el-card>
      </div>
      <div class="answer">
        <el-card class="box-card" style="background-color: #fff">
          <v-md-preview :text="msg.answer" class="md-ctn"></v-md-preview>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, computed } from 'vue';
  import { useCommonStore } from '@/stores/common';

  const commonStore = useCommonStore();
  const computedHeight = computed(() => {
    return (
      commonStore?.$state?.screenInfo?.screenHeight -
        commonStore.$state.screenInfo?.statusBarHeight -
        (commonStore?.$state?.screenInfo?.bottomBarHeight ?? 1) -
        134 || 'calc(100vh - 130px)'
    );
  });

  const props = defineProps({
    messages: {
      type: Object,
      default: () => ({}),
    },
  });
</script>
<style lang="less" scoped>
  body {
    overflow: -moz-scrollbars-none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    scrollbar-width: none; /* Firefox */
  }

  body::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  .chat-ctn {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: scroll;
    font-size: 12px;

    .chat-card {
      width: calc(100vw - 30px);
      padding: 0px 15px;
    }

    .question {
      display: flex;
      justify-content: end;
      margin-top: 20px;
    }

    .answer {
      display: flex;
      align-items: left;
      margin-top: 20px;
      .md-ctn {
        /deep/ .vuepress-markdown-body {
          font-size: 12px;
          padding: 0px;
        }
      }
    }
  }
</style>
