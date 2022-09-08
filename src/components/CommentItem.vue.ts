import { defineComponent } from "vue"
export default defineComponent({
setup () {
import ReplyItem from "./ReplyItem.vue";
import { VTag } from "@halo-dev/components";

defineProps<{
  comment: object;
}>();

const replies = [
  {
    author: {
      name: "李白",
      avatar: "",
    },
    content: "好诗好诗！",
  },
  {
    author: {
      name: "辛弃疾",
      avatar: "",
    },
    content: "确实好！",
    ref: {
      name: "李白",
    },
  },
  {
    author: {
      name: "李白",
      avatar: "",
    },
    content: "来一首？",
    ref: {
      name: "辛弃疾",
    },
  },
];
return {replies}
},
})