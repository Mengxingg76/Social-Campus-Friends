import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPost = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    // 参数检查
    const hasUserId = userId && userId !== "undefined" && userId !== "null";

    const q = hasUserId
      ? `SELECT DISTINCT p.*, u.id AS userId, name, profilePic 
         FROM posts AS p 
         JOIN users AS u ON (u.id = p.userid) 
         WHERE p.userId = ? 
         ORDER BY p.createdAt DESC`
      : `SELECT DISTINCT p.*, u.id AS userId, name, profilePic 
         FROM posts AS p 
         JOIN users AS u ON (u.id = p.userid) 
         LEFT JOIN relationships AS r ON (p.userid = r.followedUserid) 
         WHERE r.followerUserid = ? OR p.userid = ?
         ORDER BY p.createdAt DESC`;

    const values = hasUserId ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json("数据库查询出错");
      }

      // // 调试日志
      // console.log("Query:", q);
      // console.log("Parameters:", values);
      // console.log("Result count:", data.length);

      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q =
      "INSERT INTO posts (`desc`,`img`,`createdAt`,`userid`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("帖子发布成功!");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q = "DELETE FROM posts WHERE `id` = ? AND `userid` = ? ";

    db.query(q, [req.params.id,userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows > 0) return res.status(200).json("帖子删除成功!");
      return res.status(403).json("你只能删除自己的帖子!")
    });
  });
};
