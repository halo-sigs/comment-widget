<script lang="ts" setup>
import { VEmpty, VSpace, VButton, VPagination } from "@halo-dev/components";
import CommentItem from "./CommentItem.vue";
import Loading from "./Loading.vue";
import Form from "./Form.vue";
import { onMounted, provide, ref, type Ref } from "vue";
import type { CommentVoList, User } from "@halo-dev/api-client";
import { apiClient } from "../utils/api-client";

const props = withDefaults(
  defineProps<{
    kind: string;
    name: string;
    group: string;
  }>(),
  {
    kind: undefined,
    name: undefined,
    group: undefined,
  }
);

provide<string>("kind", props.kind);
provide<string>("name", props.name);
provide<string>("group", props.group);

const currentUser = ref<User>();
const comments = ref<CommentVoList>({
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

provide<Ref<User | undefined>>("currentUser", currentUser);

const handleFetchLoginedUser = async () => {
  try {
    const { data } = await apiClient.user.getCurrentUserDetail();
    currentUser.value = data;
  } catch (error) {
    console.error("Fetch logined user failed", error);
  }
};

const handleFetchComments = async () => {
  try {
    loading.value = true;
    const { data } = await apiClient.comment.listComments1({
      page: comments.value.page,
      size: comments.value.size,
      kind: props.kind,
      name: props.name,
      group: props.group,
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

onMounted(() => {
  handleFetchLoginedUser();
  handleFetchComments();
});

const onCommentCreated = () => {
  handleFetchComments();
};
</script>
<template>
  <div class="halo-comment-widget">
    <Form @created="onCommentCreated" />
    <div class="comment-timeline mt-6">
      <div class="flex items-center">
        <div class="flex flex-auto items-center gap-1">
          <span class="text-sm font-medium text-gray-900">
            {{ comments?.total || 0 }} 条评论
          </span>
          <span v-if="false" class="font-bold">·</span>
          <span v-if="false" class="text-sm text-gray-800">20 条回复</span>
        </div>
        <div></div>
      </div>

      <div class="mt-4 flex flex-col divide-y divide-gray-100">
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
    <div
      v-if="comments.hasPrevious || comments.hasNext"
      class="my-4 bg-white sm:flex sm:items-center sm:justify-center"
    >
      <VPagination
        :page="comments.page"
        :size="comments.size"
        :total="comments.total"
        @change="handlePaginationChange"
      />
    </div>
  </div>
</template>
