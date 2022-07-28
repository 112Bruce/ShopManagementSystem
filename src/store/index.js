import { createStore } from 'vuex'
import number from './state/num.state'
import uInfo from './state/userInfo.state'

export default createStore({
 
  // 当数据比较多，分模块，方便管理
  modules: {
    // ES6简写
    number,
    uInfo,
  }
})
