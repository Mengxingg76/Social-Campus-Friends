import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useId, useState } from "react";
import moment from "moment";
import "moment/locale/zh-cn";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id], // 必须用 queryKey 替代第一个参数
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => res.data), // queryFn 替代第二个参数
  });

  // 立即相应数据
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      // const currentPosts = queryClient.getQueryData(["posts"]);
      // console.log(currentPosts);
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  // 获取评论数量
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["commentsCount", post.id],
    queryFn: () =>
      makeRequest
        .get("/comments/count?postId=" + post.id)
        .then((res) => res.data),
  });

  // 点赞功能
  const handleLike = () => {
    mutation.mutate(data?.includes(currentUser.id));
  };

  // 删除帖子
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const handledDelete = () => {
    deleteMutation.mutate(post.id);
  };
  console.log(commentsData);
  
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.profilePic?.startsWith("http")
                  ? post.profilePic.trim()
                  : `./upload/${post.profilePic}`
              }
              alt=""
            />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              {/* 通过moment包 返回日期 */}
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handledDelete}>删除</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {/* 图片适应网络格式 */}
          <img
            src={
              post.img?.startsWith("http")
                ? post.img.trim()
                : `./upload/${post.img}`
            }
            alt=""
          />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} 喜欢
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsLoading
              ? "loading"
              : `${commentsData?.count} 条评论`}
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            分享
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
