<script lang="ts" setup>
import CommentItem from "./CommentItem.vue";
import Form from "./Form.vue";
import { onMounted, ref } from "vue";
import type { ListedCommentList } from "@halo-dev/api-client";
import { apiClient } from "../utils/api-client";

const comments = ref<ListedCommentList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
});
const loading = ref(false);

const handleFetchComments = async () => {
  try {
    loading.value = true;
    const { data } = await apiClient.comment.listComments({
      page: comments.value.page,
      size: comments.value.size,
      subjectKind: "Post",
      subjectName: "cc0ba2cc-9075-4865-94ed-fae81761dcf2",
    });
    comments.value = data;
  } catch (error) {
    console.error("Failed to fetch comments", error);
  } finally {
    loading.value = false;
  }
};

onMounted(handleFetchComments);
</script>
<template>
  <div class="halo-comment-widget">
    <Form />
    <div class="comment-timeline mt-6">
      <div class="flex items-center">
        <div class="flex flex-auto gap-1 items-center">
          <span class="text-sm font-medium text-gray-900">
            {{ comments?.items.length }} 条评论
          </span>
          <span class="font-bold">·</span>
          <span class="text-sm text-gray-800">20 条回复</span>
        </div>
        <div></div>
      </div>

      <div class="flex flex-col mt-4 divide-y divide-gray-100">
        <CommentItem
          v-for="(comment, index) in comments.items"
          :key="index"
          :comment="comment"
        ></CommentItem>
      </div>
    </div>
  </div>
</template>
