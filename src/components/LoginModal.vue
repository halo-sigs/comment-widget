<script lang="ts" setup>
import { VModal, VButton } from "@halo-dev/components";
import { ref, watch } from "vue";
import { v4 as uuid } from "uuid";
import qs from "qs";

const props = withDefaults(
  defineProps<{
    visible: boolean;
  }>(),
  {
    visible: false,
  }
);

const emit = defineEmits<{
  (event: "update:visible", visible: boolean): void;
  (event: "close"): void;
}>();

const formState = ref<{ _csrf: string; username: string; password: string }>({
  _csrf: "",
  username: "",
  password: "",
});

const loading = ref(false);

const onVisibleChange = (visible: boolean) => {
  emit("update:visible", visible);
  if (!visible) {
    emit("close");
  }
};

const handleGenerateToken = async () => {
  const token = uuid();
  formState.value._csrf = token;
  document.cookie = `XSRF-TOKEN=${token}; Path=/;`;
};

const handleLogin = async () => {
  try {
    loading.value = true;

    await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      redirect: "manual",
      body: qs.stringify(formState.value),
    });

    window.location.reload();
  } catch (e) {
    console.error("Failed to login", e);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      handleGenerateToken();
    }
  }
);
</script>

<template>
  <VModal
    title="登录"
    :visible="visible"
    :width="400"
    @update:visible="onVisibleChange"
  >
    <div class="flex flex-col gap-2">
      <input
        v-model="formState.username"
        class="rounded-base focus:border-secondary w-full border-gray-300 shadow-sm outline-0 ring-0"
        placeholder="用户名"
        type="text"
      />
      <input
        v-model="formState.password"
        class="rounded-base focus:border-secondary w-full border-gray-300 shadow-sm outline-0 ring-0"
        placeholder="密码"
        type="password"
      />
    </div>
    <template #footer>
      <VButton :loading="loading" type="default" @click="handleLogin">
        登录
      </VButton>
    </template>
  </VModal>
</template>
