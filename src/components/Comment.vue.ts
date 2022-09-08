import { defineComponent } from "vue"
export default defineComponent({
setup () {
import { VButton } from "@halo-dev/components";
import CommentItem from "./CommentItem.vue";

defineProps({
  msg: {
    type: String,
    default: "World",
  },
});

const comments = [
  {
    author: {
      name: "Ryan Wang",
      avatar: "https://ryanc.cc/avatar",
    },
    content:
      "红烛秋光冷画屏，轻罗小扇扑流萤。天阶夜色凉如水，坐看牵牛织女星。 -- 唐·杜牧",
  },
  {
    author: {
      name: "张泌",
    },
    content:
      "碧栏干外小中庭，雨初晴，晓莺声。飞絮落花，时节近清明。睡起卷帘无一事，匀面了，没心情。 -- 江城子·碧栏干外小中庭",
  },

  {
    author: {
      name: "毛文锡",
    },
    content:
      "鸳鸯对浴银塘暖，水面蒲稍短。垂杨低拂麴尘波，蛛丝结网露珠多，滴圆荷。遥思桃叶吴江碧，便是天河隔。锦鳞红鬣影沉沉，相思空有梦相寻，意难任。",
  },
];
return {comments}
},
})