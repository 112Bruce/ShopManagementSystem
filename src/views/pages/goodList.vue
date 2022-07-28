<template>
  <div class="container">
      <!-- 面包屑 显示当前页面的路径，快速返回之前的任意页面-->
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 内容展示区 -->
      <div class="page_content">
        <div class="flex-float">
          <div class="input_box">
            <el-input
              v-model="searchParams.query"
              placeholder="搜索关键字"
              class="input-with-select"
            >
                <template #append>
                  <el-button @click="searchList()">
                      <el-icon><Search /></el-icon>
                  </el-button>
                </template>
            </el-input>
          </div>
        </div>
        </div>

        <!-- 数据表格 -->
        <!-- 
            1、el-table的data就是要绑定的数据数组
            2、el-table-column：列 
              prop：每条数据的对应属性
              label: 列标题
              scope.row: 相当于一条数据
         -->
        <div class="goodsList">
          <el-table :data="goodsList" style="width: 100%">
            <el-table-column prop="goods_name" label="商品名" width="180" />
            <el-table-column prop="goods_price" label="价格￥" width="180" />
            <el-table-column prop="goods_weight" label="商品重量（kg）" />
            <el-table-column prop="goods_state" label="商品状态">
              <template #default='scope'>
                <p>{{switchState(scope.row.goods_state)}}</p>
              </template>
            </el-table-column>
          </el-table>
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
import {reactive, toRefs} from 'vue'
import{getGoodList} from '../../util/request'
// import { ElMessage } from 'element-plus';
export default {
    name: 'goodsList-page',
    setup(){
      const data = reactive({
        searchParams:{
          // 查询参数,搜索功能双向绑定的参数
          query:'',
          // 当前页码
          pagenum:1,
          // 每页显示条数
          pagesize: 10
        },
        total:0,
        // 用户数据
        goodsList:[],
        // 弹框内的表单数据
      });

      function searchList(){
        getGoodList(data.searchParams).then(res => {
          if(res.data){
            console.log(res);
            data.total = res.data.total;
            data.goodsList = res.data.goods;
            console.log('用户数据',res)
          }
        })
      }

      function switchState(state){
           switch (state) {
                case 0:
                    return "未通过"
                    break;
                case 1:
                    return "审核中" 
                    break; 
                case 2:
                    return "已审核"          
                    break; 
            }
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
        searchList,
        switchState,
        handleSizeChange,
        handleCurrentChange,
      }
    }
}
</script>
