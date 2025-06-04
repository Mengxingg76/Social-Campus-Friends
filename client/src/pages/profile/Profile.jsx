import "./profile.scss";
import { FaBilibili, FaWeibo, FaTiktok, FaQq, FaWeixin } from "react-icons/fa6";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  // 关注切换
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"], // 必须用 queryKey 替代第一个参数
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data), // queryFn 替代第二个参数
  });

  // 关注功能
  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship"], // 必须用 queryKey 替代第一个参数
    queryFn: () =>
      makeRequest
        .get("/relationships?followedUserid=" + userId)
        .then((res) => res.data), // queryFn 替代第二个参数
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // const currentPosts = queryClient.getQueryData(["posts"]);
      // console.log(currentPosts);
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  // 点赞功能
  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  // 等待数据加载完成 data数据是异步获取
  if (isLoading) return <div>Loading</div>; // 加载中显示 loading
  if (error) return <div>Error: {error.message}</div>; // 错误处理
  if (!data) return <div>No user data found</div>; // 额外保护

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic?.startsWith("http")
                ? data.coverPic.trim()
                : `/upload/${data.coverPic}` } alt="" className="cover" />
            <img
              src={data.profilePic?.startsWith("http")
                ? data.profilePic.trim()
                : `/upload/${data.profilePic}` }
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="https://www.bilibili.com/">
                  <FaBilibili size="2em" />
                </a>
                <a href="https://weibo.com/">
                  <FaWeibo size="2em" />
                </a>
                <a href="https://www.douyin.com/">
                  <FaTiktok size="2em" />
                </a>
                <a href="https://qqQ.com/">
                  <FaQq size="2em" />
                </a>
                <a href="https://www.weixin.com/">
                  <FaWeixin size="2em" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "Loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>更新</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "已关注"
                      : "关注"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
