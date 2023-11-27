import { db } from "../db.js";
import jwt from "jsonwebtoken";
export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = ?"
    : "SELECT * FROM posts";
  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};
export const addPost = (req, res) => {
   
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Unauthorized");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    //console.log('yo');
    if (err) return res.status(403).json("Forbidden");
    const q =
      "INSERT INTO posts(`title`,`desc`,`img`,`cat`,`date`,`uid`) VALUES(?)";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    console.log(values);
    db.query(q, [values], (err, data) => {
      if (err) {
        console.log(err)
        return res.status(500).json(err);}
      console.log('yo');
      return res.json("Post added successfully");
    });
  });
};
export const getPost = (req, res) => {
  console.log(req.params.id);
  const q =
    "SELECT p.id, u.username,p.title,p.desc,p.img,u.img AS userImg, p.date, p.cat FROM users u JOIN posts p on u.id=p.uid WHERE p.id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    console.log(data[0]);
    return res.status(200).json(data[0]);
  });
};
export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Unauthorized");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Forbidden");
    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE id = ? AND uid = ?"; // check whether the current user is the actual user who post the post
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your posts");
      return res.json("Post deleted successfully");
    });
  });
};
export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Unauthorized");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Forbidden");
    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid`= ?";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
    ];
    console.log(values);
    db.query(q, [...values,postId,userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post updated successfully");
    });
  });
};
