const db = require('../mysql')
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req,res) => {
    const userInfo = req.body
    // 获取用户基本信息
    const selectSql = `select id, username, nickname, email, user_pic from users`    
    db.query(selectSql,[],(err,results) => {
        if(err) return res.cc(err)
        if(results.length < 1) return res.cc('获取用户信息失败')
        return res.send({status:200,data:results})
    })
}

exports.update_userInfo = (req,res) => {
    const userInfo = req.query
    const userInfobody = req.body
    // 更新用户基本信息
    const updateSql = `update users set ? where id=?`
    db.query(updateSql,[userInfobody,userInfo.id],(err,results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('更新用户信息失败')
        return res.cc('信息修改成功',200)
    })
}

exports.update_userInfo_pwd = (req,res) => {
    const userInfo = req.query
    const userInfobody = req.body
    // 先根据id 查询用户存在与否
    const selectSql = `select * from users where id=?`
    db.query(selectSql,[userInfo.id],(err,results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('用户不存在')
        // 判断输入的旧密码是否正确
        const compareResult = bcrypt.compareSync(userInfobody.oldPwd,results[0].password)
        if(!compareResult) return res.cc('原密码错误')
        // 对新密码加密并更新到数据库
        const updateSql = `update users set password=? where id=?`
        const newPwd = bcrypt.hashSync(userInfobody.newPwd,10)
        db.query(updateSql,[newPwd,userInfo.id],(err,results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('密码更新失败')
            return res.cc('密码更新成功',200)
        })
    })
}

exports.update_avatar = (req,res) => {
    const userInfo = req.query
    const userInfobody = req.body
    // 先根据id 查询用户存在与否
    const selectSql = `select * from users where id=?`
    db.query(selectSql,userInfo.id,(err,results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('更新失败,用户不存在')
        // 根据id更新头像
        const updateSql = `update users set user_pic=? where id=?`
        db.query(updateSql,[userInfobody.avatar,userInfo.id],(err,results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('更新头像失败，请稍后重试')
            return res.cc('更新头像成功',200)
        })
    })
}