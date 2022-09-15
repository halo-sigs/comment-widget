<script lang="ts" setup>
import { VButton, VAvatar } from "@halo-dev/components";
import { Dropdown } from "floating-vue";
import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/zh.json";
import MdiStickerEmoji from "~icons/mdi/sticker-emoji";
import MdiSendCircleOutline from "~icons/mdi/send-circle-outline";
import type {
  CommentRequest,
  ListedComment,
  ListedReply,
  ReplyRequest,
} from "@halo-dev/api-client";
// @ts-ignore
import { Picker } from "emoji-mart";
import { inject, ref, watchEffect } from "vue";
import { apiClient } from "@/utils/api-client";

const props = withDefaults(
  defineProps<{
    comment?: ListedComment;
    reply?: ListedReply;
  }>(),
  {
    comment: undefined,
    reply: undefined,
  }
);

const emit = defineEmits<{
  (event: "created"): void;
}>();

const kind = inject<string>("kind");
const name = inject<string>("name");

const raw = ref("");
const allowNotification = ref(true);
const saving = ref(false);

const handleSubmit = async () => {
  if (!props.comment) {
    handleCreateComment();
    return;
  }
  handleCreateReply();
};

const handleCreateComment = async () => {
  if (!kind || !name) {
    console.error("Please provide kind and name");
    return;
  }
  try {
    saving.value = true;
    const commentRequest: CommentRequest = {
      raw: raw.value,
      content: raw.value,
      allowNotification: allowNotification.value,
      subjectRef: {
        version: "v1alpha1",
        group: "content.halo.run",
        kind,
        name,
      },
    };
    await apiClient.comment.createComment({
      commentRequest,
    });
    raw.value = "";
    emit("created");
  } catch (error) {
    console.error("Failed to create comment", error);
  } finally {
    saving.value = false;
  }
};

const handleCreateReply = async () => {
  if (!kind || !name) {
    console.error("Please provide kind and name");
    return;
  }

  try {
    saving.value = true;
    const replyRequest: ReplyRequest = {
      raw: raw.value,
      content: raw.value,
      allowNotification: allowNotification.value,
    };
    if (props.reply) {
      replyRequest.quoteReply = props.reply.reply.metadata.name;
    }
    await apiClient.comment.createReply({
      name: props.comment.comment.metadata.name,
      replyRequest,
    });
    raw.value = "";
    emit("created");
  } catch (error) {
    console.error("Failed to create comment reply", error);
  } finally {
    saving.value = false;
  }
};

// Emoji picker
const emojiPickerRef = ref<HTMLElement | null>(null);
const contentInputRef = ref();

const emojiPicker = new Picker({
  data: data,
  theme: "light",
  autoFocus: true,
  i18n: i18n,
  onEmojiSelect: onEmojiSelect,
});

function onEmojiSelect(emoji: { native: string }) {
  raw.value += emoji.native;
  contentInputRef.value.focus();
}

watchEffect(() => {
  if (emojiPickerRef.value) {
    emojiPickerRef.value?.appendChild(emojiPicker);
  }
});
</script>

<template>
  <div class="comment-form flex gap-4">
    <div class="flex-1 flex flex-col gap-y-4">
      <div v-if="false" class="grid gap-2 grid-cols-1 sm:grid-cols-3">
        <input
          class="w-full rounded-base border-gray-300 shadow-sm focus:border-secondary ring-0 outline-0"
          type="text"
        />
        <input
          class="w-full rounded-base border-gray-300 shadow-sm focus:border-secondary ring-0 outline-0"
          type="text"
        />
        <input
          class="w-full rounded-base border-gray-300 shadow-sm focus:border-secondary ring-0 outline-0"
          type="text"
        />
      </div>
      <textarea
        ref="contentInputRef"
        v-model="raw"
        required
        class="w-full h-28 rounded-base border-gray-300 shadow-sm focus:border-secondary ring-0 outline-0"
        placeholder="Write a comment..."
      ></textarea>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <VAvatar
            src="https://avatars.dicebear.com/api/adventurer-neutral/ryanwang.svg"
            size="sm"
            circle
          />
          <span class="text-sm font-medium"> Ryan Wang </span>
          <VButton size="sm">注销</VButton>
        </div>
        <div class="flex items-center flex-row gap-3">
          <Dropdown>
            <MdiStickerEmoji
              class="w-5 h-5 text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
            />
            <template #popper>
              <div ref="emojiPickerRef"></div>
            </template>
          </Dropdown>
          <VButton type="secondary" :loading="saving" @click="handleSubmit">
            <template #icon>
              <MdiSendCircleOutline class="w-full h-full" />
            </template>
            提交评论
          </VButton>
        </div>
      </div>
    </div>
  </div>
</template>
