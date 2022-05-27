<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAnswerStore, useEventStore } from "../store/useStore";
import { Event } from "../types/event";

// イベントストア
const useEvent = useEventStore();
// 回答ストア
const useAnswer = useAnswerStore();
// 現在のイベント
const currentEvent = ref(new Event(0, "", "", [], "", ""));
// セレクトボックス
const selectAnswer = ref("");
// emit
const emit = defineEmits(["select-answer"]);
// props
interface Props {
  id: number;
  userId: number;
}
const props = defineProps<Props>();

onMounted(() => {
  currentEvent.value = useEvent.getEvent;

  // セレクトボックスの回答をセットする
  for (let answer of useAnswer.answerList) {
    if (answer.id === props.userId) {
      selectAnswer.value = answer.answerList[props.id];
    }
  }
});

/**
 * selectboxの値を選択する
 */
const preclick = () => {
  emit("select-answer", selectAnswer.value, props.id);
};
</script>

<template>
  <div>
    <select
      v-model="selectAnswer"
      v-on:change="preclick"
      class="form-select"
      aria-label="Default select example"
    >
      <option value="">選択してください</option>
      <option value="〇">〇</option>
      <option value="△">△</option>
      <option value="✕">✕</option>
    </select>
  </div>
</template>

<style scoped></style>
