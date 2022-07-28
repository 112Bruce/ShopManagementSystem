<template>
  <div class="about">
    <h1>Vue3的生命周期</h1>
    <div id="dom">{{name}}</div>

    <!-- v-model: 双向绑定 -->
    <!-- 
      input:输入触发事件
      blur:失去焦点触发事件
      focus:获取焦点触发事件
      chang:内容更改触发事件
     -->
     <!-- 
       placeholder:默认显示文本
      -->
     <input type="text" placeholder="请输入姓名" @input='inputEvent' @blur='blurEvent'><br/>
     <input type="text" placeholder="请输入电话" @blur='blurEvent' v-model="userPhone"><br/>
     <textarea placeholder="请输入您的建议" cols="30" rows="10"></textarea>

     <p>{{userName}}---{{userSuggestion}}</p>
  </div>
</template>

<script>
// 需要使用什么方法就从vue3中引入，这点跟vue2很不同
// vue2是new一个vue实例，然后就可以使用全部方法了
import {reactive, toRefs, onBeforeMount, onMounted, onBeforeUpdate, onUpdated} from 'vue'
export default {
  name:'about-view',

  // 1,setup()函数相当于vue2的beforeCreate和created

  // 2,setup 方法 代替了 vue2 的 data,method，watch数据
  // 和方法全部写到setup（）中。setup 函数是 CompositionAPI
  // （组合式API） 的入口函数。通过return来暴露我们需要使用的数据。

  // 3,setup（）执行的时候data，methods 都是未初始化的,
  // 不能够调用。所以this 替换成了 undefined
  setup(){
    const data = reactive({
      name:'夏天',
      age:18,
      userName:'',
      userPhone:'',
      userSuggestion:'',
    });


    // 输入事件
    function inputEvent(){
      console.log('inputEvent')
      
    }

    function blurEvent(){
      console.log('失去焦点');
      // 正则表达式：^:以...开头，$:以...结尾，[3,4,5,7,8,9]：在数组中任选
      // 一位，[0-9]{9}：后面为9个0~9的数字
      if(!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(data.userPhone)){
        console.log('请输入正确的手机号')
      }
    }

    // 数据渲染前(dom生成/渲染前)
    onBeforeMount(()=>{
      console.log('onBeforeMount',document.getElementById('dom'))
    });

    // 数据渲染后(dom生成/渲染后)
    onMounted(()=>{
      console.log('onMounted',document.getElementById('dom'))
      setTimeout(()=>{
        data.name = '小马哥'

        // 因为data.age没有在html标签中使用,即没有绑定一个dom
        // data.age = 12;
      },2000)
    });

    // 不要在onUpdated这个函数中去改变标签里
    // 的数据，否则会造成死循环

    // dom里的数据更新前(dom更新前)
    onBeforeUpdate(()=>{
      console.log('onBeforeUpdate')
    });

    // dom里的数据更新后(dom更新后)
    onUpdated(()=>{
      console.log('onUpdated')
    })

    // 使用过的方法与数据一定要return
    return {
      // 使用扩展运算符...toRefs，这样就可以简写
      // data.name为name了
      ...toRefs(data),
      inputEvent,
      blurEvent,
    }
  }
}
</script>
