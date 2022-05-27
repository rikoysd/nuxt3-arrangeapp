<script setup lang="ts">
import { useEventStore, useAnswerStore } from "~~/store/useStore";
import { Answer } from "~~/types/answer";
import { Event } from "~~/types/event";

// イベントストア
const useEvent = useEventStore();
// 回答ストア
const useAnswer = useAnswerStore();
// 現在のイベント
const currentEvent = ref(new Event(0, "", "", [], "", ""));
// 名前
const name = ref("");
// コメント
const comment = ref("");
// 名前のエラー文
const nameError = ref("");
// 候補日のエラー文
const dateError = ref("");
// 送信エラー文
const submitError = ref("");
// router
const router = useRouter();
// 回答の配列
const answerArray = ref<string[]>([]);
// 回答用のストア
const answerStore = useAnswerStore();
// 現在の回答人数
const answerNumber = ref(0);
// 日程回答フォームの表示・非表示
const showDateForm = ref(false);
// ボタンの表示・非表示
const showButton = ref(false);
// route
const route = useRoute();
// userId
const userId = ref(0);

onMounted(() => {
  currentEvent.value = useEvent.getEvent;
  answerNumber.value = answerStore.answerList.length;

  // 海外都市が登録していなければボタンを非表示
  if (useEvent.cityArray.length !== 0) {
    showButton.value = true;
  }

  userId.value = Number(route.params.id);

  for (let answer of useAnswer.answerList) {
    if (answer.id === userId.value) {
      name.value = answer.answerName;
      comment.value = answer.comment;
      answerArray.value = answer.answerList;
    }
  }
});

/**
 * イベントを編集する.
 */
const editEvent = () => {
  router.push("/editEvent");
};

/**
 * 日時の回答を配列に格納する.
 */
const onSelectItem = (answer: string, num: number) => {
  // インデックス番号と同じ番号に回答を格納
  answerArray.value[num] = answer;
  console.log(answerArray.value);
};

/**
 * 日本以外の都市で回答する.
 */
const selectDateForm = () => {
  if (showDateForm.value === false) {
    showDateForm.value = true;
  } else {
    showDateForm.value = false;
  }
};

/**
 * 回答ページに戻る.
 */
const backToAnswer = () => {
  router.push("/answer");
};

/**
 * 回答を送信する.
 */
const submitAnswer = () => {
  // 名前のエラー処理
  if (name.value === "") {
    nameError.value = "名前を入力してください";
  } else {
    nameError.value = "";
  }

  // 候補日のエラー処理
  if (answerArray.value.length === 0) {
    dateError.value = "候補日を回答してください";
  } else {
    dateError.value = "";
  }

  // エラーが１つでもあったら処理をストップ
  if (name.value === "" || answerArray.value.length === 0) {
    submitError.value = "送信できませんでした";
    return;
  }
  // 回答内容をstoreに上書きする
  answerStore.overwriteAnswer(
    new Answer(userId.value, name.value, answerArray.value, comment.value)
  );

  // 回答完了ページに遷移
  router.push("/answerFinished");
};

/**
 * 回答を削除する.
 */
const deleteAnswer = () => {
  // 回答削除のactionを呼び出す
  answerStore.deleteAnswer(userId.value);

  // 回答ページに遷移
  router.push("/answer");
};
</script>

<template>
  <div class="container">
    <div class="title">
      <div class="event-name">{{ currentEvent.eventName }}</div>
      <div>
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="editEvent"
        >
          編集
        </button>
      </div>
    </div>
    <div class="description">{{ currentEvent.description }}</div>
    <div>回答者数：{{ answerNumber }}人</div>
    <!-- 回答一覧のテーブル入れる -->
    <div class="answer-table">
      <AnswerTable></AnswerTable>
    </div>
    <div class="form">
      <div class="form-title">
        <i class="bi bi-exclamation-circle"></i>回答を修正する
      </div>
      <div class="item">
        <div>
          <label for="name">名前<span>(必須)</span></label>
        </div>
        <div class="error">{{ nameError }}</div>
        <div>
          <input
            id="name"
            type="text"
            class="form-control"
            aria-describedby="basic-addon1"
            v-model="name"
          />
        </div>
      </div>
      <div class="item">
        <div>候補日<span>(必須)</span></div>
        <div class="error">{{ dateError }}</div>
        <div
          class="date"
          v-for="(date, index) of currentEvent.date"
          v-bind:key="index"
        >
          <div class="date-position">
            {{ date }}
          </div>
          <div>
            <Selectbox
              :id="index"
              :user-id="userId"
              @select-answer="onSelectItem"
            ></Selectbox>
          </div>
        </div>
        <div class="select-answer-btn">
          <button
            type="button"
            v-show="showButton"
            @click="selectDateForm"
            class="btn btn-primary"
          >
            日本以外の都市で回答する
          </button>
        </div>
        <div v-for="city of useEvent.cityArray" v-bind:key="city.id">
          <div v-show="showDateForm">
            <div>{{ city.name }}</div>
            <div class="select-city">
              <div
                class="date"
                v-for="(date, index) of city.dates"
                v-bind:key="index"
              >
                <div class="date-position">
                  {{ date }}
                </div>
                <div>
                  <Selectbox
                    :id="index"
                    :user-id="userId"
                    @select-answer="onSelectItem"
                  ></Selectbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div><label for="comment">コメント</label></div>
        <div>
          <textarea
            id="comment"
            class="form-control"
            aria-label="With textarea"
            cols="30"
            rows="10"
            v-model="comment"
          ></textarea>
        </div>
      </div>
      <div class="submit-error">{{ submitError }}</div>
      <div class="btn-erea">
        <div>
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="backToAnswer"
          >
            戻る
          </button>
        </div>
        <div>
          <button type="button" class="btn btn-primary" @click="submitAnswer">
            上書き保存する
          </button>
        </div>
      </div>
      <div class="delete">
        <div>※一度削除すると復旧できません</div>
        <button type="button" @click="deleteAnswer" class="btn btn-danger">
          回答を削除する
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css");

.answer-table {
  padding: 30px 40px;
  margin-bottom: 20px;
  background-color: aliceblue;
}

.btn-erea {
  display: flex;
  align-items: center;
}

.btn-erea button {
  margin-right: 10px;
}
.container {
  width: 800px;
}

.date {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.date-position {
  margin-right: 10px;
}

.delete {
  margin-top: 15px;
  padding: 15px 25px;
  background-color: rgb(245, 211, 211);
}

.delete-btn {
  margin-top: 12px;
}

.description {
  margin-top: 5px;
  margin-bottom: 20px;
  color: gray;
  font-size: 13px;
}

.error {
  color: rgb(232, 49, 49);
}

.event-name {
  font-size: 30px;
  margin-right: 10px;
}

.form {
  background-color: aliceblue;
  padding: 40px;
  margin-bottom: 60px;
}

.form-title {
  margin-bottom: 20px;
  font-size: 17px;
  padding: 6px 5px;
  background-color: rgb(255, 249, 205);
  color: gray;
}

.form-title i {
  margin-right: 5px;
}

.item {
  margin-bottom: 20px;
}

.select-answer-btn {
  margin: 20px 0;
}

.select-city {
  background-color: rgb(252, 240, 218);
  padding: 15px;
  margin-bottom: 20px;
}

span {
  border: solid 1px rgb(232, 49, 49);
  padding: 0 5px;
  color: rgb(232, 49, 49);
  font-size: 13px;
}

.submit-error {
  margin-bottom: 8px;
  color: rgb(232, 49, 49);
}

.title {
  display: flex;
  align-items: center;
  margin-top: 60px;
}
</style>
