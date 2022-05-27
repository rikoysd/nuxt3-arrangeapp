<script setup lang="ts">
import { useAnswerStore, useEventStore } from "~~/store/useStore";
import { Comment } from "~~/types/comment";

// イベント用ストア
const eventStore = useEventStore();
// 回答用ストア
const answerStore = useAnswerStore();
// コメントの表示・非表示
const showComment = ref(false);
// コメントリスト
const commentList = ref<Comment[]>([]);

onMounted(() => {
  for (let answerUser of answerStore.answerList) {
    if (answerUser.comment !== "") {
      commentList.value.push(
        new Comment(answerUser.answerName, answerUser.comment)
      );
    }
  }
  // コメントリストが1つでもあればコメント欄表示
  if (commentList.value.length !== 0) {
    showComment.value = true;
  }
});
</script>

<template>
  <div>
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th scope="col"></th>
          <th
            scope="col"
            v-for="(date, index) of eventStore.event.date"
            v-bind:key="index"
          >
            {{ date }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="answerUser of answerStore.answerList"
          v-bind:key="answerUser.id"
        >
          <th scope="row">
            <nuxt-link :to="`/edit/${answerUser.id}`">
              {{ answerUser.answerName }}</nuxt-link
            >
          </th>
          <td
            v-for="(answer, index) of answerUser.answerList"
            v-bind:key="index"
          >
            {{ answer }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-show="showComment" class="comment-erea">
    <div class="item">コメント</div>
    <div
      class="comment"
      v-for="(answerComment, index) of commentList"
      v-bind:key="index"
    >
      <div>{{ answerComment.name }}</div>
      <div>{{ answerComment.comment }}</div>
    </div>
  </div>
</template>

<style scoped>
.comment {
  margin-bottom: 12px;
  background-color: rgb(252, 240, 218);
  padding: 8px 15px;
}

.comment-erea {
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.815);
  padding: 10px 20px;
}

.item {
  margin-bottom: 5px;
}

table {
  margin-top: 30px;
  background-color: white;
}
</style>
