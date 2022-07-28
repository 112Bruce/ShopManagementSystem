<template>
  <div class="container">
      <div class="form">
          <!-- 绑定的是整个数据对象 -->
          <!-- ref:可以通过ref获取表单对象，而不用document.getElementBy -->
          <!-- item属性：prop:属性名, trigger：触发方式，rules：规则，包括正则 -->
          <el-form 
            ref="formRef"
            :model="loginData" 
            abel-width="120px"
          >
              <el-form-item 
                prop='username'
                label="账号" 
                :rules="[
                {
                  required:true,
                  message:'此项为必填项',
                  trigger:'blur'
                },     
                ]"
              >
                <el-input placeholder="请输入您的账号" v-model="loginData.username" />
              </el-form-item>
              <el-form-item 
                prop='password'
                label="密码" 
                :rules="[
                {
                  required:true,
                  message:'此项为必填项',
                  trigger:'blur'
                },     
                ]"
              >
                <el-input type="password" placeholder="请输入您的密码" v-model="loginData.password" />
              </el-form-item>
              <div class="submit">
                  <el-form-item class='sub'>
                      <el-button type="primary" @click="login">确认</el-button>
                      <el-button>取消</el-button>
                   </el-form-item>
              </div>
              {{count}}
          </el-form>
      </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import {  useRouter } from 'vue-router'
import {loginApi} from '../../util/request'

export default {
    name:'login-page',
    setup(){
        const store = useStore();
        const router = useRouter();

        let count = store.state.number.count;
        
        const data = reactive({
            loginData:{
                username:'',
                password:'',
            },
            numStatus: count,
        });

        function login(){
            // 请求后台接口
            loginApi(data.loginData).then((res)=>{
              if(res.data){
                // 将数据发送给vuex的userInfo.state.js下的state下的userInfo
                store.commit('setUserInfo', res.data);
                // 登录成功后,将用户信息保存到localStorage，防止刷新后回到登录页面
                // 第一个参数是名字，第二个是字符串数据（必须是字符串）
                localStorage.setItem('loginData',JSON.stringify(res.data))
                // 跳转路由
                router.push({
                  path: '/user',
                })
              }
            })
        }

        // vuex语法
        // state分模块后，注意调用写法
        // console.log('修改前getters：'+ store.getters["number/countStatus"]);
        // function onSubmit(){
        //     store.dfunispatch('number/setCountPromise', 100).then(()=>{
        //         alert('修改成功')
        //     }).catch((err)=>{
        //         return err;
        //     })
        //     console.log(store.state.number.count);
        //     console.log('修改后getters：'+ store.getters["number/countStatus"]);
        // }

        return {
            ...toRefs(data),
            login,
            count
        }
    }
}
</script>

<style scoped>
    .container{
        width:100%;
        height:100vh;
        background:#afeeee;
        position:relative;
    }
    .form{
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        background: #fff;
        padding:20px;
        border-radius: 5px;
    }
    .submit{
        /* display: flex;
        justify-content: center; */
        text-align: center;
    }
    .sub{
        display: inline-block;
    }
</style>