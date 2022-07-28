export default{
      state: {
        userInfo: localStorage.getItem('loginData')&&JSON.parse(localStorage.getItem('loginData')),
      },
      // 更新状态的方法-更新state的唯一方法，store.commit(mutations中声明的方法)
      mutations: {
        setUserInfo(state,uInfo){
          state.userInfo = uInfo;
        }
      },
}