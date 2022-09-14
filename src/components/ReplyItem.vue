<script lang="ts" setup>
import { VTag } from "@halo-dev/components";
import type { Reply } from "@halo-dev/api-client";

defineProps<{
  reply: Reply;
}>();
</script>

<template>
  <div class="reply-item py-3">
    <div class="flex flex-row gap-3">
      <div class="reply-avatar w-9 h-9">
        <img
          class="w-full h-full rounded-full"
          :src="reply.spec.owner.annotations?.avatar"
        />
      </div>
      <div class="flex-1">
        <div class="reply-informations flex items-center">
          <div class="flex flex-auto items-center gap-3">
            <div class="text-sm font-medium">
              {{ reply.spec.owner.displayName }}
            </div>
            <div
              class="text-xs text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
            >
              2 hours ago
            </div>
            <VTag rounded>Author</VTag>
          </div>
        </div>
        <div class="reply-content mt-2">
          <p class="text-sm text-gray-800">
            <a
              v-if="reply.spec.quoteReply"
              class="hover:text-blue-500 hover:underline"
              href="#"
              >@{{ reply.spec.quoteReply }}</a
            >
            {{ reply.spec.content }}
          </p>
        </div>
        <div class="reply-actions mt-2 flex flex-auto gap-1 items-center">
          <span
            class="text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            回复
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
