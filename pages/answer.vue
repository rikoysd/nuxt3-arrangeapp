<script setup lang="ts">
import { useEventStore, useAnswerStore } from "~~/store/useStore";
import { Answer } from "~~/types/answer";
import { Event } from "~~/types/event";

// イベントストア
const useEvent = useEventStore();
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
// 回答テーブルの表示・非表示
const showAnswerTable = ref(false);
// エラーチェック
const errorCheck = ref(true);
// エラーチェック(配列)
const errorCheckArray = ref<boolean[]>([]);

onMounted(() => {
  currentEvent.value = useEvent.getEvent;
  answerNumber.value = answerStore.answerList.length;

  // 海外都市が登録していなければボタンを非表示
  if (useEvent.cityArray.length !== 0) {
    showButton.value = true;
  }

  // 回答が一つ以上登録されていれば表示
  if (answerStore.answerList.length !== 0) {
    showAnswerTable.value = true;
  }
});

/**
 * イベントを編集する.
 */
const editEvent = () => {
  // パスワードを設定していたらログインページへ
  if (useEvent.event.password !== "") {
    router.push("/login");
  } else {
    router.push("/editEvent");
  }
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
 * 回答を送信する.
 */
const submitAnswer = () => {
  // 配列の中身を初期化
  errorCheckArray.value.splice(0, errorCheckArray.value.length);

  // 名前のエラー処理
  if (name.value === "") {
    nameError.value = "名前を入力してください";
    errorCheck.value = false;
  } else {
    nameError.value = "";
    errorCheck.value = true;
  }
  errorCheckArray.value.push(errorCheck.value);

  // 名前の重複チェック
  for (let answer of answerStore.answerList) {
    if (answer.answerName === name.value) {
      nameError.value = "この名前は既に使用されています";
      errorCheck.value = false;
      errorCheckArray.value.push(errorCheck.value);
      return;
    }
  }
  nameError.value = "";
  errorCheck.value = true;
  errorCheckArray.value.push(errorCheck.value);

  // 候補日のエラー処理
  if (answerArray.value.length === 0) {
    dateError.value = "候補日を回答してください";
    errorCheck.value = false;
  } else {
    dateError.value = "";
    errorCheck.value = true;
  }
  errorCheckArray.value.push(errorCheck.value);

  // エラーが１つでもあったら処理をストップ
  for (let error of errorCheckArray.value) {
    if (error === false) {
      submitError.value = "送信できませんでした";
      return;
    }
  }

  // 回答者のidを採番する
  let answerId = 0;
  let idList = new Array<number>();
  if (answerStore.answerList.length === 0) {
    answerId = 1;
  } else {
    for (let answer of answerStore.answerList) {
      idList.push(answer.id);
    }
    answerId = Math.max(...idList) + 1;
  }

  // 回答内容をstoreに格納する
  answerStore.submitAnswer(
    new Answer(answerId, name.value, answerArray.value, comment.value)
  );

  // 回答完了ページに遷移
  router.push("/answerFinished");
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
    <div class="answer-table" v-show="showAnswerTable">
      <AnswerTable></AnswerTable>
    </div>
    <div class="form">
      <div class="form-title">出欠を入力する</div>
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
              :user-id="0"
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
                    :user-id="0"
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
      <div>
        <button type="button" class="btn btn-primary" @click="submitAnswer">
          入力する
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.answer-table {
  padding: 30px 40px;
  margin-bottom: 20px;
  background-color: aliceblue;
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
