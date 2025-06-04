import { Link } from "react-router-dom";
import { useState } from "react";
import "./register.scss";
import axios from "axios"

const Register = () => {

  const [inputs,setInputs] = useState({
    username:"",
    email:"",
    password:"",
    name:""
  })

  const [err,setErr] = useState(null)

  const handleChange = e =>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value }));
  }

  const handleClick = async e =>{
    e.preventDefault()

    try{
      await axios.post("http://localhost:8800/api/auth/register",inputs)
    } catch(err){
      setErr(err.response.data)
    }
  }
  

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>温商校园墙</h1>
          <p>
            🔑 登录即解锁专属社交圈——点赞、评论、分享，一切就绪！
          </p>
          <span>已有账号?</span>
          <Link to="/login">
          <button>去登录!</button>
          </Link>
        </div>
        <div className="right">
          <h1>注册</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            {err && err}
            <button onClick={handleClick}>注册</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
