<script lang="ts" setup>
import { VButton, VAvatar, IconUserLine } from "@halo-dev/components";
import { Dropdown } from "floating-vue";
import LoginModal from "./LoginModal.vue";
import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/zh.json";
import MdiStickerEmoji from "~icons/mdi/sticker-emoji";
import MdiSendCircleOutline from "~icons/mdi/send-circle-outline";
import type {
  CommentRequest,
  ListedComment,
  ListedReply,
  ReplyRequest,
  User,
} from "@halo-dev/api-client";
// @ts-ignore
import { Picker } from "emoji-mart";
import { inject, onMounted, ref, watchEffect, type Ref } from "vue";
import { apiClient } from "@/utils/api-client";
import { useMagicKeys } from "@vueuse/core";

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

const currentUser = inject<Ref<User | undefined>>("currentUser");
const kind = inject<string>("kind");
const name = inject<string>("name");

const loginModal = ref(false);

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

// KeyBoard shortcuts
const { Command_Enter } = useMagicKeys();

watchEffect(() => {
  if (Command_Enter.value) {
    handleSubmit();
  }
});

onMounted(() => {
  const timer = setTimeout(() => {
    if (contentInputRef.value) {
      contentInputRef.value.focus();
    }
    clearTimeout(timer);
  }, 0);
});
</script>

<template>
  <LoginModal v-model:visible="loginModal" />
  <div class="comment-form flex gap-4">
    <div class="flex flex-1 flex-col gap-y-4">
      <div v-if="false" class="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          class="rounded-base focus:border-secondary w-full border-gray-300 shadow-sm outline-0 ring-0"
          type="text"
        />
        <input
          class="rounded-base focus:border-secondary w-full border-gray-300 shadow-sm outline-0 ring-0"
          type="text"
        />
        <input
          class="rounded-base focus:border-secondary w-full border-gray-300 shadow-sm outline-0 ring-0"
          type="text"
        />
      </div>
      <textarea
        ref="contentInputRef"
        v-model="raw"
        required
        class="rounded-base focus:border-secondary h-28 w-full border-gray-300 shadow-sm outline-0 ring-0"
        placeholder="Write a comment..."
      ></textarea>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <template v-if="currentUser">
            <VAvatar
              src="https://avatars.dicebear.com/api/adventurer-neutral/ryanwang.svg"
              size="sm"
              circle
            />
            <span class="text-sm font-medium"> Ryan Wang </span>
            <VButton size="sm">注销</VButton>
          </template>
          <template v-else>
            <VButton size="sm" @click="loginModal = true">
              <template #icon>
                <IconUserLine class="h-full w-full" />
              </template>
              登录
            </VButton>
          </template>
        </div>
        <div class="flex flex-row items-center gap-3">
          <Dropdown>
            <MdiStickerEmoji
              class="h-5 w-5 cursor-pointer text-gray-500 transition-all hover:text-gray-900"
            />
            <template #popper>
              <div ref="emojiPickerRef"></div>
            </template>
          </Dropdown>
          <VButton
            :disabled="!raw || !currentUser"
            type="secondary"
            :loading="saving"
            @click="handleSubmit"
          >
            <template #icon>
              <MdiSendCircleOutline class="h-full w-full" />
            </template>
            提交评论
          </VButton>
        </div>
      </div>
    </div>
  </div>
</template>
