const { result } = require("@hapi/joi/lib/base");
const db = require("../mysql");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.register = (req, res) => {
  // 检测合法性
  const userInfo = req.body;
  if (!userInfo.username || !userInfo.password) {
    return res.cc("用户名或密码不合法");
  }
  // 用户名查重
  const sqlStr = "select * from users where username=?";
  db.query(sqlStr, userInfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) {
      return res.cc("用户名被占用");
    }
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);
    // 用户信息插入数据库
    const sqlInsertStr = "insert into users set ?";
    db.query(
      sqlInsertStr,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows != 1)
          return res.cc("注册用户失败，请稍后重试");
        res.cc("注册成功", 200);
      }
    );
  });
};

exports.login = (req, res) => {
  // 查询有无此用户数据
  const userInfo = req.body;
  const sqlStr = "select * from users where username=?";
  db.query(sqlStr, userInfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("登录失败,请先注册");
    // 判断用户密码是否正确
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );
    if (!compareResult) return res.cc('密码错误,登录失败')
    // 生成token字符串
    const user = {...results[0],password:''}
    const token = jwt.sign(user,config.jwtSecretKey,{expiresIn:'24h'})
    // 响应给客户端
    res.send({
      status:200,
      msg:'登录成功',
      token:'Bearer ' + token
    })
  });
};
