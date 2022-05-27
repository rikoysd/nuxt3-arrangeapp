<script setup lang="ts">
import { useEventStore } from "~~/store/useStore";

// パスワード
const password = ref("");
// パスワードのエラー文
const passwordError = ref("");
// router
const router = useRouter();
// イベント用ストア
const eventStore = useEventStore();

/**
 * ログインする.
 */
const login = () => {
  if (password.value === "") {
    passwordError.value = "パスワードを入力してください";
  } else if (eventStore.event.password !== password.value) {
    passwordError.value = "パスワードが違います";
  } else {
    passwordError.value = "";
    router.push("/editEvent");
  }
};

/**
 * 回答ページに戻る.
 */
const backToAnswer = () => {
  router.push("/answer");
};
</script>

<template>
  <div>
    <div class="whole">
      <div class="container">
        <h4>ログイン</h4>
        <div>
          <div><label for="password">パスワード</label></div>
          <div class="error">{{ passwordError }}</div>
          <input
            id="password"
            class="form-control"
            aria-describedby="basic-addon1"
            type="password"
            v-model="password"
          />
        </div>
        <div class="btn-area">
          <div>
            <button
              type="button"
              @click="backToAnswer"
              class="btn btn-outline-primary"
            >
              回答ページに戻る
            </button>
          </div>
          <div>
            <button type="button" @click="login" class="btn btn-primary">
              ログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-area {
  margin-top: 20px;
  display: flex;
}

.btn-area div {
  margin-right: 10px;
}
.container {
  width: 800px;
  padding: 40px 40px;
  background-color: aliceblue;
  margin-top: 60px;
  margin-bottom: 20px;
}

.error {
  color: rgb(232, 49, 49);
}

h4 {
  margin-bottom: 20px;
}

.whole {
  display: flex;
  justify-content: center;
}
</style>
