<script lang="ts" setup>
import ReplyItem from "./ReplyItem.vue";
import { VTag } from "@halo-dev/components";
import type { ListedComment, Post, Reply } from "@halo-dev/api-client";
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    comment?: ListedComment;
  }>(),
  {
    comment: undefined,
  }
);

const showReplies = ref(false);

const replies = ref<Reply[]>([] as Reply[]);

const isAuthor = computed(() => {
  if (!props.comment) {
    return false;
  }
  const { comment, subject, owner } = props.comment;
  if (comment.spec.owner.kind !== "User") {
    return false;
  }
  if (!subject) {
    return false;
  }
  const { spec } = subject as Post;
  return owner?.name === spec.owner;
});
</script>

<template>
  <div class="comment-item py-4">
    <div class="flex flex-row gap-3">
      <div class="comment-avatar w-9 h-9">
        <img
          class="w-full h-full rounded-full"
          :src="comment?.owner?.avatar"
          :alt="comment?.owner?.displayName"
        />
      </div>
      <div class="flex-1">
        <div class="comment-informations flex items-center">
          <div class="flex flex-auto items-center gap-3">
            <div class="text-sm font-medium">
              {{ comment?.owner?.displayName }}
            </div>
            <div
              class="text-xs text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
            >
              2 hours ago
            </div>
            <VTag v-if="isAuthor" rounded>Author</VTag>
          </div>
        </div>
        <div class="comment-content mt-2">
          <p class="text-sm text-gray-800">
            {{ comment?.comment?.spec.content }}
          </p>
        </div>
        <div class="comment-actions mt-2 flex flex-auto gap-1 items-center">
          <span
            class="text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
            @click="showReplies = !showReplies"
          >
            {{ replies.length }} 条回复
          </span>
          <span class="text-gray-600">·</span>
          <span
            class="text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            新回复
          </span>
        </div>
        <div v-if="showReplies" class="comment-replies mt-2">
          <div class="flex flex-col divide-y divide-gray-100">
            <ReplyItem
              v-for="(reply, index) in replies"
              :key="index"
              :class="{ '!pt-2': index === 1 }"
              :reply="reply"
            ></ReplyItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
