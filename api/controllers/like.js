import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = `SELECT userid from likes WHERE postid = ?`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    // 返回数字列表而非对象
    return res.status(200).json(data.map(like=>like.userid));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q =
      "INSERT INTO likes (`userid`,`postid`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("点赞成功!");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q =
      "DELETE FROM likes WHERE `userid` = ? AND `postid` = ? ";

    db.query(q, [userInfo.id,req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("点赞取消成功!");
    });
  });
};