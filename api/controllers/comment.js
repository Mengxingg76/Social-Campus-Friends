import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment"
export const getComments = (req, res) => {
  const q = `
          SELECT DISTINCT c.*,u.id AS userId,name,profilePic FROM comments AS c JOIN users AS u ON(u.id = c.userid) 
          WHERE c.postId=? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q =
      "INSERT INTO comments (`desc`,`createdAt`,`userid`,`postid`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("评论发布成功!");
    });
  });
};

export const getCommentsCount = (req, res) => {
  const { postId } = req.query;
  db.query(
    "SELECT COUNT(*) AS count FROM comments WHERE postId = ?",
    [postId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({ count: result[0].count });
    }
  );
}