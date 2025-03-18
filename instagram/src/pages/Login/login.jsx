import { faFaceAngry, faMessage } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../source";
import Intro from "../../component/Intro/Intro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './login.scss'
import Footer from "../../component/Footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function Login() {
    const navigate = useNavigate()
    const [value, setValue] = useState({
        email:'',
        password:''
    })
    const handlChange = (e)=>{
        setValue({...value,[e.target.name]: e.target.value})
    }
    const handInvalid = ()=>{
        if(!value.email.includes('@gmail.com')){
            return false
        }
        if(value.password.length <5 ){
            return false
        }
        return true
    }
    const handlSubmit = async (e)=>{
        e.preventDefault();
        if(handInvalid()){
            const {email, password} = value
            const {data} = await axios.post('http://localhost:5000/api/user/login',{
                email,
                password
            })
            if(data.status === false){
                alert(data.msg)
            }
            else{
                localStorage.setItem('instagram-user', JSON.stringify(data.user))
                navigate('/')
            }
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('instagram-user')){
            navigate('/')
        }
    })
    return ( 
        <div>
        <div className="login__wrapper flex j-center a-center">
            <Intro/>

            <div className="inner">
                <div className="content">
                    <div className='logo flex flex-column a-center j-center'>
                        <div className="logo-bg">
                            
                        </div>
                        <h2>Đăng kí để xem ảnh và video từ bạn bè</h2>
                    </div>
                    <form className='flex flex-column j-center a-center form' onSubmit={(e)=>handlSubmit(e)}>
                        <div className="input-wrapper">
                            <input type="text" name="email" onChange={(e)=>handlChange(e)} />
                            <span>Số điện thoại, tên người dùng hoặc email</span>
                        </div>
                        <div className="input-wrapper">
                            <input type="text" name="password" onChange={(e)=>handlChange(e)}/>
                            <span>Mật khẩu</span>
                        </div>
                        <button type="submit " className='br-8 btn-w268 btn-submit'>Đăng nhập</button>
                    </form>
                    <div className='flex line-wrapper a-center j-center'>
                        <div className="line-1"></div>
                        <p className="text-line">Hoặc</p>
                        <div className="line-2"></div>
                    </div>
                    <div className="login-w flex a-center j-center flex-column">
                        <p>
                            <i class="fa-brands fa-square-facebook"></i>
                            <span>Đăng nhập bằng Facebook</span>
                        </p>
                        <Link className="forget-link" to={''}>Quên mật khẩu ?</Link>
                    </div>
                </div>
                <div className="check-account flex a-center j-center">
                    <p>Bạn chưa có tài khoản ư ?</p>
                    <Link to={'/register'}>Đăng ký</Link>
                </div>
                <div className="download flex flex-column a-center j-center">
                    <p>Tải ứng dụng</p>
                    <div className='img_download flex '>
                        <img src={images.chPlay} alt="chplay" />
                        <img src={images.microsoft} alt="chplay" />

                    </div>
                </div>
            </div>
        </div>
        <Footer/>
   </div>
     );
}

export default Login;