<template>
  <div>
    <h1>hello world!</h1>
    <p v-text='name'></p>

    <!-- v-text将内容当作文本读取 -->
    <!-- <p v-text='name'></p>的简写 -->
    <p>{{name}}</p>

    <!-- v-html将内容当作标签读取 -->
    <p v-html="info"></p>

    <!-- v-bind主要用于绑定标签属性的值，将该值转换为一个变量 -->
    <p :class='{"red":hasRed}'>小猪佩奇</p>
  </div>
</template>

<script>
import {reactive,toRefs} from 'vue'
export default {
  name:"ho-me",
  // setup生命周期，相当于vue2的created和beforecreate
  setup(){
    // reactive声明一个响应式引用数据类型
    // ref声明一个响应式基本数据类型
    const data = reactive({
      name: '小红',
      age: '20',
      info: '<i>我是斜体字</i>',
      hasRed: true,
    });

    // 声明的数据（基本/引用）都要在这里return
    return {
      // 使用扩展运算符...toRefs，这样就可以简写
      // data.name为name了
      ...toRefs(data),
    }
  }
}
</script>

<style>
  .red{
    color: red;
  }
</style>
