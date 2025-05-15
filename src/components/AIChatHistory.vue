<template>
  <div
    class="history-container"
    :style="{
      display: 'flex',
    }"
  >
    <van-nav-bar
      title="历史记录"
      left-text="返回"
      left-arrow
      @click-left="back"
      :style="{ width: '100vw', marginTop: `${commonStore?.statusBarHeight}px` }"
      fixed
    />
    <div
      :style="{
        height: `calc(100vh - 46px - ${commonStore?.statusBarHeight ?? 0}px)`,
        overflow: 'scroll',
        marginTop: `${commonStore?.statusBarHeight + 46 ?? 0}px`,
      }"
    >
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell-group
          inset
          v-for="item in list"
          :key="item.question"
          :style="{ width: '90vw', margin: '20px' }"
          @click="
            showDetailDialog = true;
            currItem = item;
          "
        >
          <van-cell>
            <template #title>
              <span class="cell-content">
                <span class="cell-title">Q:</span>
                {{ `&nbsp;&nbsp; ${item.question}` }}
              </span>
            </template>
          </van-cell>
          <van-cell>
            <template #title>
              <span class="cell-content">
                <span class="cell-title">A:</span>
                {{ `&nbsp;&nbsp; ${item.response}` }}
              </span>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </div>
    <van-popup v-model:show="showDetailDialog" position="bottom" :style="{ width: '100%', height: '80vh' }">
      <div style="width: 99vw; height: 100%; overflow: scroll" ref="stickyCtn">
        <van-sticky :offset-top="'19.9vh'" :container="stickyCtn">
          <div style="background-color: #fff; width: 99vw; padding: 10px">
            <div class="detail-header">
              <span>{{ dayjs(currItem.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              <span></span>
            </div>
            <van-divider />
            <div class="detail-question">
              {{ currItem.question }}
            </div>
          </div>
        </van-sticky>
        <van-divider />
        <div style="margin-top: 5px">
          <v-md-preview :text="currItem.response" class="md-ctn"></v-md-preview>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
  import { showToast } from 'vant';
  import 'vant/es/notify/style';

  import { ref, defineEmits } from 'vue';
  import { useCommonStore } from '@/stores/common';
  // import { setCookie } from '@/utils/cookie_utils';
  import { getDialogueHistory } from '@/api/aigc';
  import dayjs from 'dayjs';

  const commonStore = useCommonStore();
  const emit = defineEmits(['changeActive']);

  const list = ref([]);
  const loading = ref(false);
  const finished = ref(false);
  const pageIndex = ref(0);
  const pageSize = ref(10);
  const total = ref(0);
  const showDetailDialog = ref(false);
  const currItem = ref({});
  const stickyCtn = ref(null);
  const onLoad = async () => {
    pageIndex.value++;
    loading.value = true;
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    try {
      const res = await getDialogueHistory({ pageIndex: pageIndex.value, pageSize: pageSize.value });

      if (res.code == 0) {
        list.value = [...list.value, ...res.data.records];
        total.value = res.data.total;
        loading.value = false;
        if (list.value.length >= res.data.total) {
          finished.value = true;
        }
      } else {
        loading.value = false;
        showToast({ icon: 'warning-o', message: res.msg });
        emit('changeActive', 1);
      }
    } catch (error) {
      loading.value = false;
      showToast({ type: 'warning-o', message: error });
      emit('changeActive', 1);
    }
  };

  const back = () => {
    emit('changeActive', 0);
  };
</script>
<style scoped lang="less">
  .history-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    .cell-title {
      color: #1989fa;
      width: 50px;
    }
    .cell-content {
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      width: 80vw;
    }
    .detail-header {
      font-size: 12px;
      font-weight: bold;
      color: #333;
      height: 35px;
      line-height: 35px;
      margin: 10px;
      background-color: #fff;
    }
    .detail-question {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 10px;
    }
    .md-ctn {
      /deep/ .vuepress-markdown-body {
        font-size: 14px;
        padding: 0px;
        color: #333;
        margin: 10px;
        .extra-class {
          margin: 0px;
        }
      }
    }
    /deep/ .van-divider {
      margin: 0px;
    }
  }
</style>
