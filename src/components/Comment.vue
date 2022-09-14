<script lang="ts" setup>
import { VButton } from "@halo-dev/components";
import CommentItem from "./CommentItem.vue";
import MdiStickerEmoji from "~icons/mdi/sticker-emoji";
import MdiSendCircleOutline from "~icons/mdi/send-circle-outline";
import data from "@emoji-mart/data";
import i18n from "@emoji-mart/data/i18n/zh.json";
import { Picker } from "emoji-mart";
import { onMounted, ref, watchEffect } from "vue";
import type { Comment } from "@halo-dev/api-client";
import { faker } from "@faker-js/faker";
import { Dropdown } from "floating-vue";
import { apiClient } from "../utils/api-client";

defineProps({
  msg: {
    type: String,
    default: "World",
  },
});

const emojiPickerRef = ref<HTMLElement | null>(null);

const emojiPicker = new Picker({
  data: data,
  theme: "light",
  autoFocus: true,
  i18n: i18n,
  onEmojiSelect: onEmojiSelect,
});

function onEmojiSelect(object) {
  console.log(object);
  content.value += object.native;
  contentRef.value.focus();
}

watchEffect(() => {
  if (emojiPickerRef.value) {
    emojiPickerRef.value?.appendChild(emojiPicker);
  }
});

const content = ref<string>("");
const contentRef = ref();

const comments = ref<Comment[]>();
onMounted(() => {
  const result: Comment[] = [];
  for (let i = 0; i <= 50; i++) {
    const content = faker.lorem.paragraph(5);
    result.push({
      metadata: {
        name: faker.datatype.uuid(),
        creationTimestamp: faker.date.recent().toISOString(),
      },
      spec: {
        raw: content,
        content: content,
        subjectRef: {
          kind: "Post",
          name: faker.lorem.words(),
        },
        owner: {
          kind: "Email",
          name: faker.internet.email(),
          displayName: faker.name.fullName(),
          annotations: {
            website: faker.internet.url(),
            avatar: faker.internet.avatar(),
          },
        },
        top: false,
        priority: 0,
        userAgent: faker.internet.userAgent(),
        ipAddress: faker.internet.ip(),
        allowNotification: false,
        approved: true,
        hidden: false,
      },
      kind: "Comment",
      apiVersion: "content.halo.run/v1alpha1",
    });
  }
  comments.value = result;

  apiClient.post.listPosts().then((response) => {
    console.log(response);
  });
});
</script>
<template>
  <div class="halo-comment-widget">
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
          ref="contentRef"
          v-model="content"
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
    <div class="comment-timeline mt-6">
      <div class="flex items-center">
        <div class="flex flex-auto gap-1 items-center">
          <span class="text-sm font-medium text-gray-900">
            {{ comments?.length }} 条评论
          </span>
          <span class="font-bold">·</span>
          <span class="text-sm text-gray-800">20 条回复</span>
        </div>
        <div></div>
      </div>

      <div class="flex flex-col mt-4 divide-y divide-gray-100">
        <CommentItem
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
        ></CommentItem>
      </div>
    </div>
  </div>
</template>
