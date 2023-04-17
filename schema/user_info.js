const joi = require("joi");

// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().empty([null, ""]).default("")
const email = joi.string().email().empty([null, ""]).default("")

exports.reg_update_userinfo = {
    query:{
        id
    },
    body:{
        nickname,
        email
    }
}

// 密码的验证规则
// 解读：
// 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
// 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
// 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
const password = joi.string().alphanum().min(5).max(18).required();
const newpassword = joi.not(joi.ref('oldPwd')).concat(password)
exports.reg_update_password_schema = {
    body:{
        oldPwd:password,
        newPwd:newpassword
    }
}

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().required()
exports.reg_update_avatar = {
    body:{
        avatar
    }
}