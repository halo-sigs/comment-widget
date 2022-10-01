<script lang="ts" setup>
import { VButton, VAvatar, IconUserLine } from "@halo-dev/components";
import LoginModal from "./LoginModal.vue";
import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/zh.json";
import MdiStickerEmoji from "~icons/mdi/sticker-emoji";
import MdiSendCircleOutline from "~icons/mdi/send-circle-outline";
import type {
  CommentRequest,
  CommentVo,
  ReplyRequest,
  ReplyVo,
  User,
} from "@halo-dev/api-client";
// @ts-ignore
import { Picker } from "emoji-mart";
import { inject, ref, watchEffect, type Ref } from "vue";
import { apiClient } from "@/utils/api-client";
import { useMagicKeys } from "@vueuse/core";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const props = withDefaults(
  defineProps<{
    comment?: CommentVo;
    reply?: ReplyVo;
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
const group = inject<string>("group");

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
        group: group,
        kind,
        name,
        version: "v1alpha1",
      },
    };
    await apiClient.comment.createComment1({
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
      replyRequest.quoteReply = props.reply.metadata.name;
    }
    await apiClient.comment.createReply1({
      name: props.comment.metadata.name,
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

const handleLogout = () => {
  window.open(`${import.meta.env.VITE_API_URL}/logout`);
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
</script>

<template>
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
            <VAvatar :src="currentUser.spec.avatar" size="sm" circle />
            <span class="text-sm font-medium">
              {{ currentUser.spec.displayName }}
            </span>
            <VButton size="sm" @click="handleLogout">注销</VButton>
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
          <Popover v-slot="{ open }" class="relative">
            <PopoverButton
              :class="open ? '' : 'text-opacity-90'"
              class="outline-0"
              as="div"
            >
              <MdiStickerEmoji
                class="h-5 w-5 cursor-pointer text-gray-500 transition-all hover:text-gray-900"
              />
            </PopoverButton>
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <PopoverPanel
                class="absolute z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0"
              >
                <div ref="emojiPickerRef"></div>
              </PopoverPanel>
            </transition>
          </Popover>
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
    <LoginModal v-model:visible="loginModal" />
  </div>
</template>
