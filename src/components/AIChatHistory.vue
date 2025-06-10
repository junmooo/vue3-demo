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
          <van-cell v-if="(item.role == user)">
            <template #title>
              <span class="cell-content">
                <span class="cell-title">Q:</span>
                {{ `&nbsp;&nbsp; ${item.content}` }}
              </span>
            </template>
          </van-cell>
          <van-cell v-if="(item.role == assistant)">
            <template #title>
              <span class="cell-content">
                <span class="cell-title">A:</span>
                {{ `&nbsp;&nbsp; ${item.content}` }}
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

  import { ref, defineEmits, onMounted } from 'vue';
  import { useCommonStore } from '@/stores/common';
  // import { setCookie } from '@/utils/cookie_utils';
  import { getCharts } from '@/api/anything-llm';
  import dayjs from 'dayjs';

  const commonStore = useCommonStore();
  const emit = defineEmits(['changeActive']);

  const list = ref([]);
  const loading = ref(false);
  const finished = ref(false);
  const showDetailDialog = ref(false);
  const currItem = ref({});
  const stickyCtn = ref(null);
  const onLoad = async () => {

    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  };

  const back = () => {
    emit('changeActive', 0);
  };

  onMounted(async () => {
    loading.value = true;
    try {
      const res = await getCharts();
      loading.value = false;
      list.value = res.history;
    } catch (error) {
      // loading.value = false;
      showToast({ type: 'warning-o', message: error });
      emit('changeActive', 1);
    }
  });
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
