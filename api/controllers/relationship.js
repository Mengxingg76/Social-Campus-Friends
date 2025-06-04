import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = `SELECT followerUserid from relationships WHERE followedUserid = ?`;

  db.query(q, [req.query.followedUserid], (err, data) => {
    if (err) return res.status(500).json(err);
    // 返回数字列表而非对象
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserid));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q = "INSERT INTO relationships (`followerUserid`,`followedUserid`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("关注成功!");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("请登录！");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("登录信息过期！");

    const q = "DELETE FROM relationships WHERE `followerUserid` = ? AND `followedUserid` = ? ";

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("取关成功!");
    });
  });
};
