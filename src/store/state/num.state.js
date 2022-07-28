export default {
  // 在store里面的文件，命名空间属性(namespaced: true)写错导致的。
  // namespaced中没有大写字母
  namespaced:true,

  // 全局状态数据
  state: {
    count:1,
  },
  // 根据状态数据的计算值
  getters: {
    countStatus(state){
      return state.count>1;
    }
  },
  // 更新状态的方法-更新state的唯一方法，store.commit(mutations中声明的方法)
  mutations: {
    setCount(state,num){
      state.count = num;
    }
  },
  // 可以异步操作，可以返回promise，更改数据还是传递到mutations中去更改
  // 如果更改数据之后要进行一些异步操作，那我们就可以用这个属性里的方法
  actions: {
    setCountPromise(context,num){
      return new Promise((resolve,reject)=>{
        if(num>100){
          reject('值不能大于100')
        }else{
          context.commit('setCount',num);
          resolve();
        }
      })
    }
  },
}