<template>
  <div class="container">
      <!-- 面包屑 显示当前页面的路径，快速返回之前的任意页面-->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>账号列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 内容展示区 -->
      <div class="page_content">
        <div class="flex-float">
          <div class="input_box">
            <el-input
              v-model="searchParams.query"
              placeholder="请输入关键字"
              class="input-with-select"
            >
                <template #append>
                  <el-button @click="searchList()">
                      <el-icon><Search /></el-icon>
                  </el-button>
                </template>
            </el-input>
          </div>
          <el-button type="primary" @click="createUser()">新建用户</el-button>  
        </div>

        <!-- 数据表格 -->
        <!-- 
            1、el-table的data就是要绑定的数据数组
            2、el-table-column：列 
              prop：每条数据的对应属性
              label: 列标题
              scope.row: 相当于一条数据
         -->
        <div class="userList">
          <el-table :data="userList" style="width: 100%">
            <el-table-column prop="username" label="姓名" width="180" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column prop="mobile" label="电话" />
            <el-table-column prop="role_name" label="角色" />
            <el-table-column prop="role_name" label="状态">
              <template #default='scope'>
                <el-switch v-model="scope.row.mg_state" @change="switchChange(scope.row)"/>
              </template>
            </el-table-column>

            <!-- 编辑与删除选项 -->
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)"
                  >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteUser(scope.row)"
                  >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 新建弹窗 -->
      <div class="dialog">
         <el-dialog
          v-model="dialogVisible"
          :title="title"
          width="40%"
          :before-close="handleClose"
        >
          
          <el-form
            ref='userForm'
            :model="formData"
            :label-position="labelPosition"
            label-width="80px"
            :rules='rules'
          >
            <el-form-item label="用户名称" prop="username" v-if="operationOption == 'add'">
              <el-input v-model="formData.username" placeholder="请输入用户名称"/>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="operationOption == 'add'">
              <el-input v-model="formData.password" placeholder="请输入用户密码"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入用户邮箱"/>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="formData.mobile" placeholder="请输入用户手机号"/>
            </el-form-item>
          </el-form>

          <div class="dialog-footer">
            <span>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm(userForm)">
                确定
              </el-button>
          </span>
          </div>
        </el-dialog>
      </div>


      <!-- 分页器 -->
      <div class="pagination">
        <div>
          <el-pagination
              v-model:currentPage="searchParams.pagenum"
              v-model:page-size="searchParams.pagesize"
              :page-sizes="[2, 5, 10, 20]"
              small=true
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
  </div>
</template>

<script>
import {reactive, toRefs, ref} from 'vue'
import{getUserList,addUser,changeUserStage,editUserRequest,delUserRequest} from '../../util/request'
import { ElMessage } from 'element-plus';
export default {
    name: 'usersList-page',
    setup(){
      const data = reactive({
        keyWord:'',
        searchParams:{
          // 查询参数,搜索功能双向绑定的参数
          query:'',
          // 当前页码
          pagenum:1,
          // 每页显示条数
          pagesize: 10
        },
        title: '',
        // 账号总数量
        total:0,
        // 用户数据
        userList:[],
        // 弹框内的表单数据
        formData:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        // 操作选项（新建："add"/编辑: "edit"）
        operationOption:'',
        // 是否显示弹框
        dialogVisible: false,
        // 弹框表单内部输入的label的对齐方式
        labelPosition: 'right',
        // 表单内的正则验证,必须在el-form-item中写上prop=要验证的数据，
        // 比如'username'

        // 编辑表单的用户数据
        userData:[],
        rules:{
          username:[
            {required:true,message:'此项为必填',
              // 触发方式，失去焦点
              trigger:'blur'
            }
          ],

          password:[
            {required:true,message:'此项为必填',
              // 触发方式，失去焦点
              trigger:'blur'
            }
          ],

          email:[
            {required:false,
              // 要验证的正则
              pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message:'请填写正确的邮箱',
              // 触发方式，失去焦点
              trigger:'blur',
            }
          ],

          mobile:[
            {required:false,
              // 要验证的正则
              pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
              message:'请填写正确的手机号',
              // 触发方式，失去焦点
              trigger:'blur',
            }
          ]
        },
      });

      // 获取到ref=userForm的对象，该对象就是下面赋值的userForm
      const userForm = ref();

      function searchList(){
        getUserList(data.searchParams).then(res => {
          if(res.data){
            data.total = res.data.total;
            data.userList = res.data.users;
            console.log('用户数据',res)
          }
        })
      }
      function createUser(){
        data.title = '新建表单';
        data.operationOption = 'add';
        data.dialogVisible = true;
      }

      function editUser(row){
        data.title = '编辑表单';
        data.operationOption = 'edit';
        data.dialogVisible = true;

        const {email, mobile, id} = row;
        data.formData.email = email;
        data.formData.mobile = mobile;
        data.formData.id = id;

      }

      function deleteUser(row){
        delUserRequest(row);
        searchList();

      }

      // 提交弹框表单处理
      function submitForm(userObj){
        // validate	对整个表单的内容进行验证。 
        // 接收一个回调函数，或返回 Promise。
        userObj.validate((res)=>{
          if(!res){
            // 表单验证未通过
            ElMessage({
              type:'error',
              message:'请输入正确的信息',
            })
          }else{
            // 表单验证通过
            // 操作选项（新建："add"/编辑: "edit"）
            // operationOption:'',

            // 添加用户
            if(data.operationOption == 'add'){
                addUser(data.formData).then(()=>{
              // 关闭弹框
              data.dialogVisible = false;
              // 将表单数据清空
              data.formData = {
                username:'',
                password:'',
                email:'',
                mobile:''
              }
              searchList();
              console.log(res);
            }).catch((err)=>{
              // 新增失败
              console.log(err);
            })
            }else if(data.operationOption == 'edit'){
              editUserRequest(data.formData).then(()=>{
                  // 关闭弹框
                  data.dialogVisible = false;
                  // 重新获取数据
                  searchList();
              })
            }  
          }
        }) 
      }

      // 状态更改，put请求
      function switchChange(userData){
         console.log(userData);
         changeUserStage(userData).then((res)=>{
            if(res.data){
              searchList();
            }
         });
      }

      function handleSizeChange(pagesize){
        data.searchParams.pagesize = pagesize;
        searchList();
      }

      function handleCurrentChange(pagenum){
        data.searchParams.pagenum = pagenum;
        searchList();
      }

      // 初始化就要获取用户信息
      searchList();
      return {
        ...toRefs(data),
        userForm,
        searchList,
        createUser,
        editUser,
        deleteUser,
        switchChange,
        submitForm,
        handleSizeChange,
        handleCurrentChange,
      }
    }
}
</script>

<style scoped>
  .input_box{
    width: 200px;
  }
  /* .el-input{
    margin-right:200px;
  } */
  .dialog-footer{
    text-align: center;
  }
  .pagination{
    display: flex;
    justify-content: center;
  }
</style>