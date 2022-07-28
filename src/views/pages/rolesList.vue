<template>
  <div class="container">
      <!-- 面包屑 显示当前页面的路径，快速返回之前的任意页面-->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 白色内容区域 -->
      <div class="role_content">
        <el-button class='title' type="primary" @click="createrole()">新建角色</el-button>  
        <!-- 数据表格 -->
        <!-- 
            1、el-table的data就是要绑定的数据数组
            2、el-table-column：列 
              prop：每条数据的对应属性
              label: 列标题
              scope.row: 相当于一条数据
         -->
        <div class="roleList">
          <el-table :data="roleList" style="width: 100%">
            <el-table-column prop="roleName" label="角色名" />
            <el-table-column prop="roleDesc" label="角色描述"  />

            <!-- 编辑与删除选项 -->
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" type="primary" @click="editRole(scope.row)"
                  >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRole(scope.row)"
                  >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
     

      <!-- 新建弹窗 -->
      <div class="dialog">
         <el-dialog
          v-model="dialogVisible"
          :title="title"
          width="40%"
        >
          
          <el-form
            ref='roleForm'
            :model="formData"
            :label-position="labelPosition"
            label-width="80px"
            :rules='rules'
          >
            <el-form-item label="角色名称" prop="roleName" v-if="operationOption == 'add'">
              <el-input v-model="formData.roleName" placeholder="请输入角色名称"/>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="formData.roleDesc" placeholder="请输入角色描述"/>
            </el-form-item>
          </el-form>

          <div class="dialog-footer">
            <span>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm(roleForm)">
                确定
              </el-button>
          </span>
          </div>
        </el-dialog>
      </div>

       <!-- 删除弹窗 -->
      <div class="dialog">
         <el-dialog
          v-model="delDialogVisible"
          title="删除"
          width="40%"
        >
          <div class="dialog-text">
            <span>您确认要删除吗？</span>
          </div>
          <div class="dialog-footer">
            <span>
              <el-button @click="delDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="delsubmitForm()">
                确定
              </el-button>
          </span>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive,toRefs,ref} from 'vue'
import {getroleList,addRoleRequest,editRoleRequest,delRoleRequest} from '../../util/request.js'
import {ElMessage} from 'element-plus'
export default {
  name: 'rolesList-page',
  setup(){
    const roleData = reactive({
        roleList:[],
        // 是否弹窗
        delDialogVisible:false,
        dialogVisible:false,
        // 弹窗标题
        // 弹框表单内部输入的label的对齐方式
        labelPosition: 'right',
        title:'',
        operationOption:'',
        formData:{
          roleName:'',
          roleDesc:'',
        },
        rules: {
          roleName:{
                    required:true,message:"此项必填",trigger:"blur"
                }
        }
    });

  // 可以获取到el-form对象
  const roleForm = ref();

  function getRoleList(){
    getroleList().then((res)=>{
      roleData.roleList = res.data;
      console.log(res)
    });
  }

  function createrole(){
    roleData.operationOption = 'add';
    roleData.dialogVisible = true;
  }
  function editRole(row){
    roleData.operationOption = 'edit';
    roleData.dialogVisible = true;
    const {id, roleName, roleDesc} = row;
    roleData.formData.roleName = roleName;
    roleData.formData.roleDesc = roleDesc;
    roleData.formData.id = id;
  }

  function deleteRole(row){
    roleData.formData.id = row.id;
    roleData.delDialogVisible = true;
  }

  function delsubmitForm(){
    delRoleRequest(roleData.formData).then((res)=>{
      if(!res.data){
        // 删除成功
        roleData.delDialogVisible = false;
        getRoleList();
      }
    })
  }

  function submitForm(roleForm){
    // validate	对整个表单的内容进行验证。 
    // 接收一个回调函数，或返回 Promise。
    roleForm.validate((res)=>{
      if(res){
        // 表单验证通过
        if(roleData.operationOption == 'add'){
          addRoleRequest(roleData.formData).then((res)=>{
            if(res.data){
              roleData.dialogVisible = false;
              roleData.formData = {
                  roleName:'',
                  roleDesc:'',
                }
              getRoleList();
            }
          });
          
        }else if(roleData.operationOption == 'edit'){
          editRoleRequest(roleData.formData).then((res)=>{
            if(res.data){
              roleData.dialogVisible = false;
              getRoleList();
            }
          })
        }
        
      }else{
         // 表单验证未通过
            ElMessage({
              type:'error',
              message:'请输入正确的信息',
            })
      }
    })
  }

    getRoleList();

    return {
      ...toRefs(roleData),
      roleForm,
      getRoleList,
      createrole,
      editRole,
      deleteRole,
      submitForm,
      delsubmitForm
    }
  }
}
</script>

<style>
  .title{
    margin: 20px 0;
  }
  .dialog-footer,.dialog-text{
    text-align: center;
  }
  .dialog-text{
    margin: 10px 0;
  }
  .el-dialog__body{
    padding: 20px;
  }
</style>