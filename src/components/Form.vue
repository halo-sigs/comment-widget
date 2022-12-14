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
import { computed, inject, ref, watchEffect, type Ref } from "vue";
import { apiClient } from "@/utils/api-client";
import { useMagicKeys } from "@vueuse/core";

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
const colorScheme = inject<string>("colorScheme");

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
      name: props.comment?.metadata.name as string,
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
const getColorScheme = computed(() => {
  if (colorScheme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return colorScheme;
});

const emojiPickerRef = ref<HTMLElement | null>(null);
const contentInputRef = ref();
const emojiPickerVisible = ref(false);

const emojiPicker = new Picker({
  data: data,
  theme: getColorScheme.value,
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
        rows="4"
        class="rounded-base block h-full w-full resize-y appearance-none bg-white px-3 py-2 text-sm text-black antialiased outline-0 ring-1 ring-gray-300 transition-all dark:bg-slate-700 dark:text-slate-50 dark:ring-slate-600"
        placeholder="????????????"
      ></textarea>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <template v-if="currentUser">
            <VAvatar
              :src="currentUser.spec.avatar"
              :alt="currentUser.spec.displayName"
              size="sm"
              circle
            />
            <span class="text-sm font-medium dark:text-slate-50">
              {{ currentUser.spec.displayName }}
            </span>
            <VButton size="sm" @click="handleLogout">??????</VButton>
          </template>
          <template v-else>
            <VButton size="sm" @click="loginModal = true">
              <template #icon>
                <IconUserLine class="h-full w-full" />
              </template>
              ??????
            </VButton>
          </template>
        </div>
        <div class="flex flex-row items-center gap-3">
          <div class="relative">
            <MdiStickerEmoji
              class="h-5 w-5 cursor-pointer text-gray-500 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
              @click="emojiPickerVisible = !emojiPickerVisible"
            />
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <div
                v-show="emojiPickerVisible"
                class="absolute right-0 z-10 mt-3 transform px-4 sm:px-0"
              >
                <div ref="emojiPickerRef"></div>
              </div>
            </transition>
          </div>
          <VButton
            :disabled="!raw || !currentUser"
            type="secondary"
            :loading="saving"
            @click="handleSubmit"
          >
            <template #icon>
              <MdiSendCircleOutline class="h-full w-full" />
            </template>
            ????????????
          </VButton>
        </div>
      </div>
    </div>
    <LoginModal v-model:visible="loginModal" />
  </div>
</template>
