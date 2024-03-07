<script>
export default {
  inject: ['messages'],
}
</script>

<template>
  <div class="chatCtn" id="scroll-box">
    <div v-for="msg in Object.values(messages)" v-bind:key="msg" class="chatCard">
      <div class="quwstion">
        <el-card class="box-card" style="background-color: aliceblue">
          <div class="text item">{{ msg.question }}</div>
        </el-card>
      </div>
      <div class="answer">
        <el-card class="box-card" style="background-color: #fff">
          <v-md-preview :text="msg.answer"></v-md-preview>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style lang='less' scoped>
.chatCtn {
  height: calc(90vh - 160px);
  inline-size: 100vw;
  display: flex;
  justify-self: center;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;

  .chatCard {
    inline-size: 80vw;
    padding: 0px
  }

  .quwstion {
    display: flex;
    justify-content: end;
    margin-top: 20px
  }

  .answer {
    display: flex;
    align-items: left;
    margin-top: 20px
  }
}
</style>