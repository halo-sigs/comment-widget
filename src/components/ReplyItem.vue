<script lang="ts" setup>
import { VTag, VAvatar } from "@halo-dev/components";
import Form from "./Form.vue";
import type { ListedComment, ListedReply } from "@halo-dev/api-client";
import { computed, inject, provide, ref, type Ref } from "vue";
import { useTimeAgo } from "@vueuse/core";
import MdiReply from "~icons/mdi/reply";

const props = defineProps<{
  comment?: ListedComment;
  reply: ListedReply;
  replies: ListedReply[];
}>();

const emit = defineEmits<{
  (event: "reload"): void;
}>();

const showForm = ref(false);

const timeAgo = useTimeAgo(
  new Date(props.reply.reply.metadata.creationTimestamp || new Date())
);

const quoteReply = computed(() => {
  const { quoteReply: replyName } = props.reply.reply.spec;

  if (!replyName) {
    return undefined;
  }

  return props.replies.find((reply) => reply.reply.metadata.name === replyName);
});

const onReplyCreated = () => {
  emit("reload");
  showForm.value = false;
};

// Show hovered reply
const hoveredReply = inject<Ref<ListedReply | undefined>>("hoveredReply");

const handleShowQuoteReply = (show: boolean) => {
  if (hoveredReply) {
    hoveredReply.value = show ? quoteReply.value : undefined;
  }
};

const isHoveredReply = computed(() => {
  return (
    hoveredReply?.value?.reply.metadata.name === props.reply.reply.metadata.name
  );
});
</script>

<template>
  <div
    :id="`reply-${reply.reply.metadata.name}`"
    class="reply-item py-3"
    :class="{ 'animate-breath': isHoveredReply }"
  >
    <div class="flex flex-row gap-3">
      <div class="reply-avatar">
        <VAvatar
          :src="reply?.owner?.avatar"
          :alt="reply?.owner?.displayName"
          size="sm"
          circle
        />
      </div>
      <div class="flex-1">
        <div class="reply-informations flex items-center">
          <div class="flex flex-auto items-center gap-3">
            <div class="text-sm font-medium">
              {{ reply.owner.displayName }}
            </div>
            <a
              :href="`#reply-${reply.reply.metadata.name}`"
              class="text-xs text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
            >
              {{ timeAgo }}
            </a>
            <VTag rounded>Author</VTag>
          </div>
        </div>
        <div class="reply-content mt-2">
          <p class="text-sm text-gray-800">
            <a
              v-if="quoteReply"
              class="hover:text-blue-500 text-gray-600 hover:underline font-medium inline-flex flex-row items-center gap-1 bg-gray-200 rounded py-0.5 px-1 text-xs mr-1"
              :href="`#reply-${quoteReply.reply.metadata.name}`"
              @mouseenter="handleShowQuoteReply(true)"
              @mouseleave="handleShowQuoteReply(false)"
            >
              <MdiReply />
              <span>{{ quoteReply.owner.displayName }}</span>
            </a>
            <br v-if="quoteReply" />
            {{ reply.reply.spec.content }}
          </p>
        </div>
        <div class="reply-actions mt-2 flex flex-auto gap-1 items-center">
          <span
            class="text-xs text-gray-600 hover:text-gray-900 cursor-pointer select-none"
            @click="showForm = !showForm"
          >
            回复
          </span>
        </div>
        <Form
          v-if="showForm"
          class="mt-2"
          :comment="comment"
          :reply="reply"
          @created="onReplyCreated"
        />
      </div>
    </div>
  </div>
</template>
