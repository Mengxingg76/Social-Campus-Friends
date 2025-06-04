import { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });

  // 上传功能
  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  // 立即相应数据
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => makeRequest.put("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // 提交按钮
  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      <h2>更新个人信息</h2>
      <form>
        <div className="file-inputs">
          <label className="file-label">
            <input type="file" onChange={(e) => setCover(e.target.files[0])} />
            <span>{cover ? "封面已选择" : "上传封面图片"}</span>
          </label>
          <label className="file-label">
            <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
            <span>{profile ? "头像已选择" : "上传头像图片"}</span>
          </label>
        </div>
        
        <input type="text" name="name" onChange={handleChange} placeholder="姓名" />
        <input type="text" name="city" onChange={handleChange} placeholder="城市" />
        <input type="text" name="website" onChange={handleChange} placeholder="个人网站" />
        
        <button type="button" onClick={handleSubmit}>更新信息</button>
      </form>
      
      <button className="close-btn" onClick={() => setOpenUpdate(false)}>
        ×
      </button>
    </div>
  );
};

export default Update;
