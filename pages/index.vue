<script setup lang="ts">
import { format } from "date-fns";
import { useEventStore } from "~~/store/useStore";
import { Event } from "@/types/event";
import dayjs from "dayjs";

// pluginをimport
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// 候補日
const candidateDate = ref("");
// 候補時間
const candidateTime = ref("");
// 候補日一覧
const candidateDates = ref<string[]>([]);
// イベント名
const eventName = ref("");
// イベント説明文
const eventDescription = ref("");
// メールアドレス
const email = ref("");
// パスワード
const password = ref("");
// イベント名エラー文
const eventNameError = ref("");
// 候補日エラー文
const candidateDateError = ref("");
// メールアドレスエラー文
const emailError = ref("");
// パスワードエラー文
const passwordError = ref("");
// エラーチェック
const errorCheck = ref(true);
// イベントストア
const useEvent = useEventStore();
// router
const router = useRouter();
// 海外時間の選択エリア表示・非表示
const selectCountryErea = ref(false);
// 海外都市の選択フォーム
const forms = ref([{ id: 0, name: "", dates: [] }]);
// 候補日の表示・非表示
const showDate = ref(false);
// エラーチェック(配列)
const errorCheckArray = ref<boolean[]>([]);

dayjs.extend(utc);
dayjs.extend(timezone);

// tzメソッドを実行したときに適用されるタイムゾーン(ここでの初期値は東京とする)
dayjs.tz.setDefault("Asia/Tokyo");

onMounted(() => {
  // 候補日が設定されていなければ、そのエリアを非表示
  if (candidateDates.value.length !== 0) {
    showDate.value = true;
  }
});

/**
 * 海外都市を選択するエリアの表示.
 */
const selectArea = () => {
  if (selectCountryErea.value === false) {
    selectCountryErea.value = true;
  } else {
    selectCountryErea.value = false;
  }
};

/**
 * 対象国を選択する.
 */
const preclick = (index: number) => {
  let cityId = forms.value[index].id;
  let cityDates = forms.value[index].dates;
  // 配列の中身を初期化する
  cityDates.splice(0, cityDates.length);

  // シンガポール
  if (String(cityId) === "1") {
    for (let date of candidateDates.value) {
      let time = dayjs(date).tz("Asia/Singapore").format("YYYY-MM-DD HH:mm");
      cityDates.push(time);
    }
    forms.value[index].name = "シンガポール";
  }

  // 上海
  if (String(cityId) === "2") {
    for (let date of candidateDates.value) {
      let time = dayjs(date).tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm");
      cityDates.push(time);
    }
    forms.value[index].name = "上海";
  }

  // ニューヨーク
  if (String(cityId) === "3") {
    for (let date of candidateDates.value) {
      let time = dayjs(date).tz("America/New_York").format("YYYY-MM-DD HH:mm");
      cityDates.push(time);
    }
    forms.value[index].name = "ニューヨーク";
  }

  // ロンドン
  if (String(cityId) === "4") {
    for (let date of candidateDates.value) {
      let time = dayjs(date).tz("Europe/London").format("YYYY-MM-DD HH:mm");
      cityDates.push(time);
    }
    forms.value[index].name = "ロンドン";
  }
};

/**
 * 海外都市のフォームを追加する.
 */
const addCity = () => {
  forms.value.push({ id: 0, name: "", dates: [] });
};

/**
 * 海外都市のフォームを削除する.
 */
const deleteForm = (index: number) => {
  forms.value.splice(index, 1);
};

/**
 * 候補日を追加する.
 */
const addDate = () => {
  showDate.value = true;
  if (candidateDate.value === "" || candidateTime.value === "") {
    candidateDateError.value = "候補日時を入力してください";
    showDate.value = false;
    return;
  }
  // split... 指定した文字列で区切る
  let splitedArray = candidateDate.value.split("-");
  let year = Number(splitedArray[0]);
  let month = Number(splitedArray[1]);
  let day = Number(splitedArray[2]);
  let targetDay = new Date(year, month - 1, day);
  let formatString = format(targetDay, "yyyy-MM-dd");
  let targetDate = formatString + " " + candidateTime.value;

  // 候補日の重複チェック
  if (candidateDates.value.length === 0) {
    candidateDates.value.push(targetDate);
    return;
  }

  for (let date of candidateDates.value) {
    if (date === targetDate) {
      candidateDateError.value = "その日時は既に登録されています";
      return;
    }
  }
  candidateDateError.value = "";
  candidateDates.value.push(targetDate);
};

/**
 * 候補日を削除する.
 */
const deleteDate = (id: number) => {
  candidateDates.value.splice(id, 1);
  if (candidateDates.value.length === 0) {
    showDate.value = false;
  }
};

/**
 * イベント確認画面に進む.
 */
const eventConfirm = () => {
  // 配列の中身を初期化
  errorCheckArray.value.splice(0, errorCheckArray.value.length);
  // イベント名のエラー
  if (eventName.value === "") {
    eventNameError.value = "イベント名を入力してください";
    errorCheck.value = false;
  } else {
    eventNameError.value = "";
    errorCheck.value = true;
  }
  errorCheckArray.value.push(errorCheck.value);

  // 候補日のエラー
  if (candidateDates.value.length === 0) {
    candidateDateError.value = "候補日時を入力してください";
    errorCheck.value = false;
  } else {
    candidateDateError.value = "";
    errorCheck.value = true;
  }
  errorCheckArray.value.push(errorCheck.value);

  // メールアドレスチェック
  if (email.value === "") {
    errorCheck.value = true;
  } else if (email.value.indexOf("@") === -1) {
    emailError.value = "メールアドレスの形式が不正です";
    errorCheck.value = false;
  } else {
    emailError.value = "";
    errorCheck.value = true;
  }
  errorCheckArray.value.push(errorCheck.value);

  // パスワードチェック
  // 正規表示を定義
  const regex = /^(?=.*[A-Z])(?=.*[.?/-])[a-zA-Z0-9.?/-]{8,16}$/;
  if (password.value === "") {
    errorCheck.value = true;
  } else if (password.value.length < 8 || password.value.length > 16) {
    passwordError.value = "8文字以上16文字以内で設定してください";
    errorCheck.value = false;
  } else if (!regex.test(password.value)) {
    passwordError.value = "設定の条件を満たしていません";
    errorCheck.value = false;
  } else {
    passwordError.value = "";
    errorCheck.value = true;
  }
  errorCheckArray.value.push(errorCheck.value);

  // エラーが１つでもあったら処理をストップ
  for (let error of errorCheckArray.value) {
    if (error === false) {
      return;
    }
  }

  // イベント作成のactionを呼び出す
  useEvent.makeEvent(
    new Event(
      -1,
      eventName.value,
      eventDescription.value,
      candidateDates.value,
      email.value,
      password.value
    )
  );

  // 海外都市を追加するactionを呼び出す
  useEvent.addCity(forms.value);

  // 確認画面に遷移
  router.push("/eventConfirm");
};
</script>

<template>
  <div class="whole">
    <div class="container">
      <div>
        <h2>イベント新規作成</h2>
        <div class="item">
          <div>
            <label for="eventName">イベント名<span>(必須)</span></label>
            <div class="error">{{ eventNameError }}</div>
          </div>
          <input
            id="eventName"
            type="text"
            class="form-control"
            aria-describedby="basic-addon1"
            v-model="eventName"
          />
          <div class="ex">例：飲み会、営業部定例会など</div>
        </div>
        <div class="item">
          <div>
            <label for="candidate">候補日<span>(必須)</span></label>
          </div>
          <div>
            <div class="error">{{ candidateDateError }}</div>
          </div>
          <div class="date-erea">
            <div>
              <div class="date-erea">
                <div class="date">
                  <div>日付</div>
                  <input type="date" v-model="candidateDate" />
                </div>
                <div>
                  <div>時間</div>
                  <input type="time" v-model="candidateTime" />
                </div>
              </div>
              <div class="date-add-btn">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="addDate"
                >
                  追加
                </button>
              </div>
            </div>
            <div class="date-display" v-show="showDate">
              <div
                class="date-box"
                v-for="(date, index) of candidateDates"
                v-bind:key="index"
              >
                <div>{{ date }}</div>
                <div>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="deleteDate(index)"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="country-btn">
          <button type="button" class="btn btn-primary" @click="selectArea">
            海外の日時を設定する
          </button>
        </div>
        <div v-show="selectCountryErea">
          <div
            v-for="(form, index) of forms"
            v-bind:key="index"
            class="select-country-erea"
          >
            <div class="ex">
              ※上記の「候補日」を選択してから対象国を選んでください
            </div>
            <select
              class="form-select"
              aria-label="Default select example"
              v-model="form.id"
              v-on:change="preclick(index)"
            >
              <option value="0">選択してください</option>
              <option value="1">シンガポール</option>
              <option value="2">上海</option>
              <option value="3">ニューヨーク</option>
              <option value="4">ロンドン</option>
            </select>
            <div class="select-country-date">
              <div>対象国の時間：</div>
              <div v-for="(date, index) of form.dates" v-bind:key="index">
                {{ date }}
              </div>
            </div>
            <div class="delete-btn">
              <button
                class="btn btn-outline-danger"
                type="button"
                @click="deleteForm(index)"
              >
                削除
              </button>
            </div>
          </div>
          <div class="add-btn">
            <button
              type="button"
              @click="addCity"
              class="btn btn-outline-primary"
            >
              都市を追加
            </button>
          </div>
        </div>
        <div class="item">
          <div>
            <label for="eventDescription">イベント説明文</label>
          </div>
          <textarea
            id="eventDescription"
            class="form-control"
            aria-label="With textarea"
            v-model="eventDescription"
          ></textarea>
        </div>
        <div class="item">
          <div>
            <label for="email">メールアドレス</label>
            <div class="error">{{ emailError }}</div>
          </div>
          <input
            id="email"
            type="text"
            class="form-control"
            aria-describedby="basic-addon1"
            v-model="email"
          />
          <div class="ex">例：abc@gmail.com</div>
          <div class="ex">
            ※入力されたアドレスに、登録内容の控えが送られます
          </div>
        </div>
        <div class="item">
          <div>
            <label for="password">パスワード</label>
            <div class="error">{{ passwordError }}</div>
          </div>
          <input
            id="password"
            type="password"
            class="form-control"
            aria-describedby="basic-addon1"
            v-model="password"
          />
          <div class="attention">
            ※英語小文字・大文字、数字、記号(.?/-)をそれぞれ1つ以上使用して設定してください
          </div>
          <div class="ex">※イベントを閲覧する際に必要なパスワードです</div>
        </div>
        <button type="button" class="btn btn-primary" @click="eventConfirm">
          確認画面へ進む
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-btn {
  margin-bottom: 12px;
}

.attention {
  color: tomato;
}

.container {
  width: 800px;
  padding: 40px 40px;
  background-color: aliceblue;
  margin: 40px 0;
}

.country-btn {
  margin: 12px 0;
}

.date {
  margin-right: 5px;
}

.date-add-btn {
  margin-top: 5px;
}

.date-box {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.date-box button {
  margin-left: 10px;
}

.delete-btn {
  margin-top: 12px;
}

.date-display {
  padding: 15px 30px;
  background-color: white;
  border-radius: 3px;
  margin-left: 15px;
}

.date-erea {
  display: flex;
}

.error {
  color: rgb(232, 49, 49);
}

.ex {
  color: gray;
}

.item {
  margin-bottom: 10px;
}

.select-country-erea {
  background-color: rgb(252, 240, 218);
  padding: 15px;
  margin-bottom: 20px;
}

.select-country-date {
  margin-top: 12px;
  background-color: rgb(254, 251, 231);
  padding: 15px;
}

span {
  border: solid 1px rgb(232, 49, 49);
  padding: 0 5px;
  color: rgb(232, 49, 49);
  font-size: 13px;
}

.whole {
  display: flex;
  justify-content: center;
}
</style>
