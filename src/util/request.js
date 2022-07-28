import {post,get,put,del} from './service'

// 登录请求
export const loginApi = data=>{
    return post({
        url:'/login',
        data
    })
}

// 获取用户列表
export const getUserList = data=>{
    return get({
        url:'/users',
        data
    })
}

// 添加用户
export const addUser = data=>{
    return post({
        url:'/users',
        data
    })
}

// 用户状态更改
export const changeUserStage = data=>{
    return put({
        // 请求路径有动态变量时必须用反引号，否则会出错
        url:`/users/${data.id}/state/${data.mg_state}`,
        data
    })
}

// 编辑用户
export const editUserRequest = data=>{
    return put({
        url:`/users/${data.id}`,
        data
    })
}

// 删除用户
export const delUserRequest = data=>{
    return del({
        url:`/users/${data.id}`,
    })
}


// 获取角色列表
export const getroleList = data=>{
    return get({
        url:'/roles',
        data
    })
}


// 添加角色
export const addRoleRequest = data=>{
    return post({
        url:'/roles',
        data
    })
}

// 添加角色
export const editRoleRequest = data=>{
    return put({
        url:`/roles/${data.id}`,
        data
    })
}

// 删除角色
export const delRoleRequest = data=>{
    return del({
        url:`/roles/${data.id}`,
    })
}

// 获取商品列表
export const getGoodList = data=>{
    return get({
        url:`/goods`,
        data
    })
}
