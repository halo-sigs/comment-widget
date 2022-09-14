<script lang="ts" setup>
import ReplyItem from "./ReplyItem.vue";
import { VTag } from "@halo-dev/components";
import type { Comment, Reply } from "@halo-dev/api-client";
import { onMounted, ref } from "vue";
import { faker } from "@faker-js/faker";

defineProps<{
  comment: Comment;
}>();

const showReplies = ref(true);

const replies = ref<Reply[]>([] as Reply[]);

onMounted(() => {
  const result: Reply[] = [];

  for (let i = 0; i <= 5; i++) {
    const content = faker.lorem.paragraph(3);
    result.push({
      metadata: {
        name: faker.datatype.uuid(),
        creationTimestamp: faker.date.recent().toISOString(),
      },
      spec: {
        raw: content,
        content: content,
        owner: {
          kind: "Email",
          name: faker.internet.email(),
          displayName: faker.name.fullName(),
          annotations: {
            website: faker.internet.url(),
            avatar: faker.internet.avatar(),
          },
        },
        quoteReply: faker.name.fullName(),
        commentName: faker.datatype.uuid(),
        top: false,
        priority: 0,
        userAgent: faker.internet.userAgent(),
        ipAddress: faker.internet.ip(),
        allowNotification: false,
        approved: true,
        hidden: false,
      },
      kind: "Reply",
      apiVersion: "content.halo.run/v1alpha1",
    });
  }

  replies.value = result;
});
</script>

<template>
  <div class="comment-item py-4">
    <div class="flex flex-row gap-3">
      <div class="comment-avatar w-9 h-9">
        <img
          class="w-full h-full rounded-full"
          :src="comment.spec.owner.annotations?.avatar"
        />
      </div>
      <div class="flex-1">
        <div class="comment-informations flex items-center">
          <div class="flex flex-auto items-center gap-3">
            <div class="text-sm font-medium">
              {{ comment.spec.owner.displayName }}
            </div>
            <div
              class="text-xs text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
            >
              2 hours ago
            </div>
            <VTag rounded>Author</VTag>
          </div>
        </div>
        <div class="comment-content mt-2">
          <p class="text-sm text-gray-800">
            {{ comment.spec.content }}
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
