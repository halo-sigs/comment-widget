<script lang="ts" setup>
import ReplyItem from "./ReplyItem.vue";
import { VTag, VAvatar } from "@halo-dev/components";
import Form from "./Form.vue";
import type { ListedComment, ListedReply, Post } from "@halo-dev/api-client";
import { computed, provide, ref, watch, type Ref } from "vue";
import { apiClient } from "@/utils/api-client";
import { useTimeAgo } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    comment?: ListedComment;
  }>(),
  {
    comment: undefined,
  }
);

const showReplies = ref(false);
const showForm = ref(false);

const replies = ref<ListedReply[]>([] as ListedReply[]);
const hoveredReply = ref<ListedReply>();

provide<Ref<ListedReply | undefined>>("hoveredReply", hoveredReply);

const timeAgo = useTimeAgo(
  new Date(props.comment.comment.metadata.creationTimestamp || new Date())
);

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

const handleFetchReplies = async () => {
  try {
    const { data } = await apiClient.reply.listReplies({
      commentName: props.comment.comment.metadata.name,
    });
    replies.value = data.items;
  } catch (error) {
    console.error("Failed to fetch comment replies", error);
  }
};

watch(
  () => showReplies.value,
  () => {
    if (showReplies.value) {
      handleFetchReplies();
    } else {
      replies.value.length = 0;
    }
  }
);

const onReplyCreated = () => {
  showForm.value = false;
  showReplies.value = true;
};
</script>

<template>
  <div
    :id="`comment-${comment?.comment.metadata.name}`"
    class="comment-item py-4"
  >
    <div class="flex flex-row gap-3">
      <div class="comment-avatar">
        <VAvatar
          :src="comment?.owner?.avatar"
          :alt="comment?.owner?.displayName"
          size="sm"
          circle
        />
      </div>
      <div class="flex-1">
        <div class="comment-informations flex items-center">
          <div class="flex flex-auto items-center gap-3">
            <div class="text-sm font-medium">
              {{ comment?.owner?.displayName }}
            </div>
            <a
              :href="`#comment-${comment?.comment.metadata.name}`"
              class="text-xs text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
            >
              {{ timeAgo }}
            </a>
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
            class="text-xs text-gray-600 hover:text-gray-900 cursor-pointer select-none"
            @click="showReplies = !showReplies"
          >
            {{ comment?.comment.status?.replyCount || 0 }} 条回复
          </span>
          <span class="text-gray-600">·</span>
          <span
            class="text-xs text-gray-600 hover:text-gray-900 cursor-pointer select-none"
            @click="showForm = !showForm"
          >
            加入回复
          </span>
        </div>

        <Form
          v-if="showForm"
          class="mt-2"
          :comment="comment"
          @created="onReplyCreated"
        />

        <div v-if="showReplies" class="comment-replies mt-2">
          <div class="flex flex-col divide-y divide-gray-100">
            <ReplyItem
              v-for="(reply, index) in replies"
              :key="index"
              :class="{ '!pt-2': index === 1 }"
              :comment="comment"
              :reply="reply"
              :replies="replies"
              @reload="handleFetchReplies"
            ></ReplyItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
