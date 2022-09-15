<script lang="ts" setup>
import { VEmpty, VSpace, VButton, VPagination } from "@halo-dev/components";
import CommentItem from "./CommentItem.vue";
import Loading from "./Loading.vue";
import Form from "./Form.vue";
import { onMounted, provide, ref } from "vue";
import type { ListedCommentList } from "@halo-dev/api-client";
import { apiClient } from "../utils/api-client";

const props = withDefaults(
  defineProps<{
    kind: string;
    name: string;
  }>(),
  {
    kind: undefined,
    name: undefined,
  }
);

provide<string>("kind", props.kind);
provide<string>("name", props.name);

const comments = ref<ListedCommentList>({
  page: 1,
  size: 20,
  total: 0,
  items: [],
  first: true,
  last: false,
  hasNext: false,
  hasPrevious: false,
});
const loading = ref(false);

const handleFetchComments = async () => {
  try {
    loading.value = true;
    const { data } = await apiClient.comment.listComments({
      page: comments.value.page,
      size: comments.value.size,
      subjectKind: props.kind,
      subjectName: props.name,
      sort: "CREATE_TIME",
    });
    comments.value = data;
  } catch (error) {
    console.error("Failed to fetch comments", error);
  } finally {
    loading.value = false;
  }
};

const handlePaginationChange = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  comments.value.page = page;
  comments.value.size = size;
  handleFetchComments();
};

onMounted(handleFetchComments);

const onCommentCreated = () => {
  handleFetchComments();
};
</script>
<template>
  <div class="halo-comment-widget">
    <Form @created="onCommentCreated" />
    <div class="comment-timeline mt-6">
      <div class="flex items-center">
        <div class="flex flex-auto gap-1 items-center">
          <span class="text-sm font-medium text-gray-900">
            {{ comments?.total || 0 }} 条评论
          </span>
          <span class="font-bold">·</span>
          <span class="text-sm text-gray-800">20 条回复</span>
        </div>
        <div></div>
      </div>

      <div class="flex flex-col mt-4 divide-y divide-gray-100">
        <Loading v-if="loading" />
        <VEmpty
          v-else-if="!comments.items.length && !loading"
          title="暂无评论"
          message="你可以尝试点击刷新或者添加新评论"
        >
          <template #actions>
            <VSpace>
              <VButton type="default" @click="handleFetchComments">
                刷新
              </VButton>
            </VSpace>
          </template>
        </VEmpty>
        <CommentItem
          v-for="(comment, index) in comments.items"
          v-else
          :key="index"
          :comment="comment"
        ></CommentItem>
      </div>
    </div>
    <div class="bg-white my-4 sm:flex sm:items-center sm:justify-center">
      <VPagination
        :page="comments.page"
        :size="comments.size"
        :total="comments.total"
        @change="handlePaginationChange"
      />
    </div>
  </div>
</template>
