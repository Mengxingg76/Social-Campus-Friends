import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = `SELECT * FROM users WHERE id = ?`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.status(200).json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");
    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id =?";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        // 有一条以上数据行受影响表示用户更新了数据
        if (data.affectedRows > 0) return res.json("更新成功!");
        return res.status(403).json("你只能更新自己的帖子!");
      }
    );
  });
};
