<script>
export default {
  // inject: ['messages'],
  methods: {
    refresh() {
      this.$emit('refresh', this.messages);
    }
  }

}
</script>

<template>
  <el-tooltip class="box-item" effect="dark" content="刷新" placement="top">
    <el-icon class="refressCtn" :size="40" color="#409EFC" @click="refresh()">
      <Refresh />
    </el-icon>
  </el-tooltip>
</template>

<style lang='less' scoped>
.refressCtn {
  position: fixed;
  bottom: 19vh;
  right: 15vw;
}
</style>