<script setup lang="ts">
import { useEventStore } from "~~/store/useStore";
import { Event } from "~~/types/event";

// イベントストア
const useEvent = useEventStore();
// 現在のイベント
const currentEvent = ref(new Event(0, "", "", [], "", ""));
// router
const router = useRouter();
// 海外の日程表示・非表示
const showCityDates = ref(false);

onMounted(() => {
  currentEvent.value = useEvent.getEvent;
  if (useEvent.cityArray.length !== 0) {
    showCityDates.value = true;
  }
});

/**
 * イベントを作成する.
 */
const makeEvent = () => {
  router.push("/makingEventFinished");
};

/**
 * 前のページに戻る.
 */
const backToEvent = () => {
  router.push("/");
};
</script>

<template>
  <div class="whole">
    <div class="container">
      <div class="msg">
        内容を確認して、「作成する」のボタンを押してください。
      </div>
      <div class="table">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <th scope="row">イベント名</th>
              <td>{{ currentEvent.eventName }}</td>
            </tr>
            <tr>
              <th scope="row">候補日程</th>
              <td>
                <div
                  v-for="(date, index) of currentEvent.date"
                  v-bind:key="index"
                >
                  {{ date }}
                </div>
              </td>
            </tr>
            <tr
              v-show="showCityDates"
              v-for="city of useEvent.cityArray"
              v-bind:key="city.id"
            >
              <th scope="row">候補日程({{ city.name }})</th>
              <td>
                <div v-for="(date, index) of city.dates" v-bind:key="index">
                  {{ date }}
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">イベント説明文</th>
              <td>{{ currentEvent.description }}</td>
            </tr>
            <tr>
              <th scope="row">メールアドレス</th>
              <td>{{ currentEvent.email }}</td>
            </tr>
            <tr>
              <th>パスワード</th>
              <td>{{ currentEvent.password }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="btn-area">
        <div class="button">
          <button class="btn btn-primary" @click="backToEvent">
            前のページに戻る
          </button>
        </div>
        <div class="button">
          <button type="button" class="btn btn-primary" @click="makeEvent">
            イベントを作成する
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  margin-right: 10px;
}
.container {
  width: 800px;
  padding: 40px 40px;
  background-color: aliceblue;
  margin: 40px 0;
}

.msg {
  margin-bottom: 20px;
  text-align: center;
}

.table {
  background-color: white;
}

/* th,
td {
  border: solid 1px;
  padding: 20px 8px;
}

table {
  border-collapse: collapse;
  margin-bottom: 30px;
} */

.whole {
  display: flex;
  justify-content: center;
}
</style>
