<script lang="ts" setup>
import { VButton } from "@halo-dev/components";
import { Dropdown } from "floating-vue";
import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/zh.json";
import MdiStickerEmoji from "~icons/mdi/sticker-emoji";
import MdiSendCircleOutline from "~icons/mdi/send-circle-outline";
import type { ReplyRequest } from "@halo-dev/api-client/index";
// @ts-ignore
import { Picker } from "emoji-mart";
import { ref, watch, watchEffect } from "vue";
import cloneDeep from "lodash.cloneDeep";

const initialFormState: ReplyRequest = {
  raw: "",
  content: "",
  allowNotification: true,
  owner: undefined,
  quoteReply: undefined,
};

const formState = ref<ReplyRequest>(cloneDeep(initialFormState));
const saving = ref(false);

watch(
  () => formState.value.raw,
  (newValue) => {
    formState.value.content = newValue;
  }
);

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
  formState.value.raw += emoji.native;
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
        v-model="formState.raw"
        class="w-full h-28 rounded-base border-gray-300 shadow-sm focus:border-secondary ring-0 outline-0"
        placeholder="Write a comment..."
      ></textarea>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            class="rounded-full w-8 h-8"
            :src="`https://avatars.dicebear.com/api/adventurer-neutral/ryanwang.svg`"
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
          <VButton type="secondary">
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
