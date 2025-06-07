import { Link, useNavigate } from "react-router-dom";
import { images } from "../../source";
import Intro from "../../component/Intro/Intro";
import './login.scss'
import Footer from "../../component/Footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { login } from "../../action/action";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { isValidEmail } from "../../utils/validators";
function Login() {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [value, setValue] = useState({
        email:'',
        password:''
    })
    const handleChange = (e)=>{
        setValue({...value,[e.target.name]: e.target.value})
    }

    
    const handInvalid = ()=>{
        if(!isValidEmail(value.email)){
            toast.warn("Vui lòng đúng địa chỉ email")
        }
        if(value.password.length <5 ){
            toast.warn("Mật khẩu phải lớn hơn 5 kí tự")
        }
        return true
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(handInvalid()){
            const {email, password} = value
            const data = await login(email, password)
            console.log(data);
            
            if(data?.message === 'Login success'){
                localStorage.setItem('access_token', data.jwt)
                navigate('/')
            }
            else if(data?.jwt === null) {
                toast.error(data.message);
                
            }
        
        }
    }
    return ( 
        <div>
        <div className="login__wrapper flex j-center a-center">
            <Intro/>

            <div className="inner">
                <div className="content">
                    <div className='logo flex flex-column a-center j-center'>
                        <div className="logo-bg">
                            
                        </div>
                        <h2>{t("welcome_register")}</h2>
                    </div>
                    <form className='flex flex-column j-center a-center form' onSubmit={(e)=>handleSubmit(e)}>
                        <div className="input-wrapper">
                            <input placeholder="" type="text" name="email" onChange={(e)=>handleChange(e)} />
                            <span>Email</span>
                        </div>
                        <div className="input-wrapper">
                            <input placeholder="" type="text" name="password" onChange={(e)=>handleChange(e)}/>
                            <span>{t("password")}</span>
                        </div>
                        <button type="submit " className='br-8 btn-w268 btn-submit'>{t("login")}</button>
                    </form>
                    <div className='flex line-wrapper a-center j-center'>
                        <div className="line-1"></div>
                        <p className="text-line">{t("or")}</p>
                        <div className="line-2"></div>
                    </div>
                    <div className="login-w flex a-center j-center flex-column">
                        <p>
                            <i class="fa-brands fa-square-facebook"></i>
                            <span>{t("login_with_facebook")}</span>
                        </p>
                        <Link className="forget-link" to={'/account/find'}>{t("forgot_pass")}</Link>
                    </div>
                </div>
                <div className="check-account flex a-center j-center">
                    <p>{t("have_an_account")}</p>
                    <Link to={'/register'}>{t("register")}</Link>
                </div>
                <div className="download flex flex-column a-center j-center">
                    <p>{t("download")}</p>
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