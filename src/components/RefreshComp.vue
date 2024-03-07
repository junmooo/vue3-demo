<script>
export default {
  inject: ['messages'],
  methods: {
    refresh() {
      this.$emit('refresh', this.messages);
    }
  }

}
</script>

<template>
  <el-icon class="refressCtn" :size="40" color="#409EFC" @click="refresh()">
    <Refresh />
  </el-icon>
</template>

<style lang='less' scoped>
.refressCtn {
  position: fixed;
  top: 40px;
  right: 120px;
}
</style>