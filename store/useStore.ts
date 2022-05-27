import { defineStore } from "pinia";
import { Answer } from "~~/types/answer";
import { Event } from "~~/types/event";

// defineStoreの第一引数...複数のストアを作る場合に必要
// イベント用のストア
export const useEventStore = defineStore("event", {
  state: () => {
    return {
      event: new Event(0, "", "", [], "", ""),
      cityArray: [{ id: 0, name: "", dates: [] }],
    };
  },
  actions: {
    /**
     * イベントを作成する.
     * @param payload - イベント情報
     */
    makeEvent(payload: Event) {
      // stateを指定する際はthisを使う
      this.event = payload;
    },
    /**
     * 海外都市を追加する.
     * @param payload - 海外都市
     */
    addCity(payload: { id: number; name: string; dates: Array<string> }[]) {
      this.cityArray = payload;

      // 空欄のフォームは削除
      for (let i = 0; i < this.cityArray.length; i++) {
        if (this.cityArray[i].id === 0) {
          this.cityArray.splice(i, 1);
          return;
        }
      }
    },
  },
  getters: {
    /**
     * イベント情報を取得する.
     * @param state - ステート
     * @returns イベント情報
     */
    getEvent: (state) => state.event,
  },
});

// 回答用のストア
export const useAnswerStore = defineStore("answer", {
  state: () => {
    return { answerList: new Array<Answer>() };
  },
  actions: {
    /**
     * 回答内容をstateに格納する.
     * @param payload - 回答内容
     */
    submitAnswer(payload: Answer) {
      this.answerList.push(payload);
    },

    /**
     * 回答内容を上書き保存する.
     * @param payload - 回答内容
     */
    overwriteAnswer(payload: Answer) {
      for (let i = 0; i < this.answerList.length; i++) {
        if (this.answerList[i].id === payload.id) {
          this.answerList.splice(i, 1);
          this.answerList[i] = payload;
        }
      }
    },

    /**
     * 回答を削除する.
     * @param id - ID
     */
    deleteAnswer(id: number) {
      for (let i = 0; i < this.answerList.length; i++) {
        if (this.answerList[i].id === id) {
          this.answerList.splice(i, 1);
        }
      }
    },
  },
  getters: {},
});
