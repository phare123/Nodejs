const cors = require("cors");
const express = require("express");
const user = require("./router/user");
const userInfo = require('./router/user_info')
const app = express();
const joi = require('joi')
const config = require('./config')
const expressJwt = require('express-jwt')

// 跨域
app.use(cors());
// 解析表单数据
app.use(express.urlencoded({ extends: false }));
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJwt({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 封装响应中间件
app.use((req,res,next) => {
  res.cc = (err,status = 1) => {
    res.send({
      status,
      msg : err instanceof Error ? err.message : err
    })
  }
  next()
})

// 挂载路由模块
app.use("/api", user).use('/user',userInfo);

// 定义错误级别的中间件
app.use((err,req,res,next) => {
  // 数据验证失败
  if(err instanceof joi.ValidationError) res.cc(err)
    // token验证失败
    if(err.name === "UnauthorizedError") return res.cc('身份验证失败')
  // 未知错误
  res.cc(err)
})

const PORT = process.env.PORT || 80

app.listen(PORT, () => {
  console.log(`server success running http://127.0.0.1:${PORT}`);
});
