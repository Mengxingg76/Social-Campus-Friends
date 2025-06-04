import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 注册接口实际业务代码
export const register = (req, res) => {
  // 检查用户是否存在
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("用户已存在!");

    // 创建新的用户
    // 对密码哈希处理 123456=>"abcdef"
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (username,email,password,name) VALUES (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("用户创建成功!");
    });
  });
};

// 登录接口实际业务代码
export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("用户不存在!");

    // 检查密码是否正确 对比数据后返回布尔值
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword) return res.status(400).json("密码错误!");

    // 设置token
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true
      })
      .status(200)
      .json(others);
  });
};

export const loginout = (req, res) => {
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("用户已注销!")
};
