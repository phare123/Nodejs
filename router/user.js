const express = require("express");
const router = express.Router();
const { reg_login_schema } = require("../schema/user");
const expressJoi = require("@escook/express-joi");

// 导入路由处理模块
const { register, login } = require("../router_handle/user");

router.post("/register", expressJoi(reg_login_schema), register);
router.post("/login", expressJoi(reg_login_schema), login);

module.exports = router;
