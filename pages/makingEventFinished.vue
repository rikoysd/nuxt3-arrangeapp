<script setup lang="ts">
// router
const router = useRouter();

/**
 * 回答ページに進む.
 */
const toAnswer = () => {
  router.push("/answer");
};
</script>

<template>
  <div class="whole">
    <div class="container">
      <div class="position">
        <div>
          <div class="msg">イベントの作成が完了しました</div>
          <div class="msg">
            <button type="button" @click="toAnswer" class="btn btn-primary">
              回答ページへ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  margin-top: 10px;
}
.container {
  width: 800px;
  padding: 40px 40px;
  background-color: aliceblue;
  margin: 40px 0;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg {
  text-align: center;
  font-size: 20px;
}

.position {
  display: flex;
  justify-content: center;
}

.whole {
  display: flex;
  justify-content: center;
}
</style>
