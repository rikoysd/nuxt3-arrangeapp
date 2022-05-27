<script setup lang="ts">
// router
const router = useRouter();

/**
 * イベントを新しく作る.
 */
const makeNewEvent = () => {
  router.push("/");
};
</script>

<template>
  <div>
    <div class="whole">
      <div class="container">
        <h4>回答が完了しました</h4>
        <div class="text-link">
          <nuxt-link to="/answer">回答ページに戻る</nuxt-link>
        </div>
        <answer-table></answer-table>
      </div>
    </div>
    <div class="button">
      <button type="button" class="btn btn-primary" @click="makeNewEvent">
        イベントを新しく作る
      </button>
    </div>
  </div>
</template>

<style scoped>
.button {
  display: flex;
  justify-content: center;
}
.container {
  width: 800px;
  padding: 40px 40px;
  background-color: aliceblue;
  margin-top: 60px;
  margin-bottom: 20px;
}

h4 {
  text-align: center;
}

.text-link {
  margin-top: 12px;
  text-align: center;
}

.whole {
  display: flex;
  justify-content: center;
}
</style>
