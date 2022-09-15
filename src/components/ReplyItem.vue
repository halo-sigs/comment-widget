<script lang="ts" setup>
import { VTag, VAvatar } from "@halo-dev/components";
import Form from "./Form.vue";
import type { ListedComment, ListedReply } from "@halo-dev/api-client";
import { ref } from "vue";
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
  comment?: ListedComment;
  reply: ListedReply;
}>();

const emit = defineEmits<{
  (event: "reload"): void;
}>();

const showForm = ref(false);

const timeAgo = useTimeAgo(
  new Date(props.reply.reply.metadata.creationTimestamp || new Date())
);

const onReplyCreated = () => {
  emit("reload");
  showForm.value = false;
};
</script>

<template>
  <div class="reply-item py-3">
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
            <div
              class="text-xs text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
            >
              {{ timeAgo }}
            </div>
            <VTag rounded>Author</VTag>
          </div>
        </div>
        <div class="reply-content mt-2">
          <p class="text-sm text-gray-800">
            <a
              v-if="reply.reply.spec.quoteReply"
              class="hover:text-blue-500 hover:underline"
              href="#"
              >@{{ reply.reply.spec.quoteReply }}</a
            >
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
