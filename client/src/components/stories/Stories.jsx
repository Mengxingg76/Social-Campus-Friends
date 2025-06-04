import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "在线交友",
      img: "https://photo.16pic.com/00/01/19/16pic_119415_b.jpg",
    },
    {
      id: 2,
      name: "开学季",
      img: "https://ts1.tc.mm.bing.net/th/id/R-C.a8756b5105dfd52852fa7dc3d9d8879d?rik=NwTy1W%2bKfUc34A&riu=http%3a%2f%2fimg.aiimg.com%2fuploads%2fallimg%2f201112%2f263915-2011120F410.jpg&ehk=jcBluYjVUHnr7%2fHLS2GeKI2IKvcW2eyee0MPWshjgLY%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: 3,
      name: "端午来袭",
      img: "https://bpic.588ku.com/back_origin_min_pic/21/07/09/4802c1a4bd38b57254670c51722f422c.jpg!/fw/750/quality/99/unsharp/true/compress/true",
    },
    {
      id: 4,
      name: "加入我们",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
