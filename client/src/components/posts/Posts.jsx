import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"], // 必须用 queryKey 替代第一个参数
    queryFn: () => makeRequest.get("/posts?userId="+userId).then((res) => res.data), // queryFn 替代第二个参数
  });


  return (
    <div className="posts">
      {error ? "Something went wrong!" : (isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.id} />))}
    </div>
  );
};

export default Posts;
