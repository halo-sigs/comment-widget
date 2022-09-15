import {
  ApiHaloRunV1alpha1ContentApi,
  ApiHaloRunV1alpha1PluginApi,
  ApiHaloRunV1alpha1PostApi,
  ApiHaloRunV1alpha1SinglePageApi,
  ApiHaloRunV1alpha1ThemeApi,
  ApiHaloRunV1alpha1UserApi,
  ApiHaloRunV1alpha1CommentApi,
  ApiHaloRunV1alpha1ReplyApi,
  ContentHaloRunV1alpha1CategoryApi,
  ContentHaloRunV1alpha1CommentApi,
  ContentHaloRunV1alpha1PostApi,
  ContentHaloRunV1alpha1ReplyApi,
  ContentHaloRunV1alpha1SnapshotApi,
  ContentHaloRunV1alpha1TagApi,
  ContentHaloRunV1alpha1SinglePageApi,
  PluginHaloRunV1alpha1PluginApi,
  PluginHaloRunV1alpha1ReverseProxyApi,
  StorageHaloRunV1alpha1AttachmentApi,
  StorageHaloRunV1alpha1GroupApi,
  StorageHaloRunV1alpha1PolicyApi,
  StorageHaloRunV1alpha1PolicyTemplateApi,
  ThemeHaloRunV1alpha1ThemeApi,
  V1alpha1ConfigMapApi,
  V1alpha1MenuApi,
  V1alpha1MenuItemApi,
  V1alpha1PersonalAccessTokenApi,
  V1alpha1RoleApi,
  V1alpha1RoleBindingApi,
  V1alpha1SettingApi,
  V1alpha1UserApi,
} from "@halo-dev/api-client";
import axios from "axios";

const apiUrl = "http://localhost:8090";
const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

const apiClient = {
  extension: {
    configMap: new V1alpha1ConfigMapApi(undefined, apiUrl, axiosInstance),
    personalAccessToken: new V1alpha1PersonalAccessTokenApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    roleBinding: new V1alpha1RoleBindingApi(undefined, apiUrl, axiosInstance),
    role: new V1alpha1RoleApi(undefined, apiUrl, axiosInstance),
    setting: new V1alpha1SettingApi(undefined, apiUrl, axiosInstance),
    reverseProxy: new PluginHaloRunV1alpha1ReverseProxyApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    plugin: new PluginHaloRunV1alpha1PluginApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    user: new V1alpha1UserApi(undefined, apiUrl, axiosInstance),
    theme: new ThemeHaloRunV1alpha1ThemeApi(undefined, apiUrl, axiosInstance),
    menu: new V1alpha1MenuApi(undefined, apiUrl, axiosInstance),
    menuItem: new V1alpha1MenuItemApi(undefined, apiUrl, axiosInstance),
    post: new ContentHaloRunV1alpha1PostApi(undefined, apiUrl, axiosInstance),
    singlePage: new ContentHaloRunV1alpha1SinglePageApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    category: new ContentHaloRunV1alpha1CategoryApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    tag: new ContentHaloRunV1alpha1TagApi(undefined, apiUrl, axiosInstance),
    snapshot: new ContentHaloRunV1alpha1SnapshotApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    comment: new ContentHaloRunV1alpha1CommentApi(
      undefined,
      apiUrl,
      axiosInstance
    ),
    reply: new ContentHaloRunV1alpha1ReplyApi(undefined, apiUrl, axiosInstance),
    storage: {
      group: new StorageHaloRunV1alpha1GroupApi(
        undefined,
        apiUrl,
        axiosInstance
      ),
      attachment: new StorageHaloRunV1alpha1AttachmentApi(
        undefined,
        apiUrl,
        axiosInstance
      ),
      policy: new StorageHaloRunV1alpha1PolicyApi(
        undefined,
        apiUrl,
        axiosInstance
      ),
      policyTemplate: new StorageHaloRunV1alpha1PolicyTemplateApi(
        undefined,
        apiUrl,
        axiosInstance
      ),
    },
  },
  // custom endpoints
  user: new ApiHaloRunV1alpha1UserApi(undefined, apiUrl, axiosInstance),
  plugin: new ApiHaloRunV1alpha1PluginApi(undefined, apiUrl, axiosInstance),
  theme: new ApiHaloRunV1alpha1ThemeApi(undefined, apiUrl, axiosInstance),
  post: new ApiHaloRunV1alpha1PostApi(undefined, apiUrl, axiosInstance),
  singlePage: new ApiHaloRunV1alpha1SinglePageApi(
    undefined,
    apiUrl,
    axiosInstance
  ),
  content: new ApiHaloRunV1alpha1ContentApi(undefined, apiUrl, axiosInstance),
  comment: new ApiHaloRunV1alpha1CommentApi(undefined, apiUrl, axiosInstance),
  reply: new ApiHaloRunV1alpha1ReplyApi(undefined, apiUrl, axiosInstance),
};

export { apiClient };
