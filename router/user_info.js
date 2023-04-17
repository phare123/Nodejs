const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const {getUserInfo,update_userInfo,update_userInfo_pwd,update_avatar} = require('../router_handle/user_info')
const {reg_update_userinfo,reg_update_password_schema,reg_update_avatar} = require('../schema/user_info')

// 获取用户基本信息
router.get('/userinfo',getUserInfo)
// 更新用户信息
router.post('/update',expressJoi(reg_update_userinfo),update_userInfo)
// 修改密码
router.post('/updatepwd',expressJoi(reg_update_password_schema),update_userInfo_pwd)
// 更新用户头像
router.post('/update/avatar',expressJoi(reg_update_avatar),update_avatar)

module.exports = router