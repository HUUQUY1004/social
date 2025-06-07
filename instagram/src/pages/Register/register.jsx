import React, { useRef, useState } from 'react';
import {images} from '../../source/index'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faFaceAngry} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom';
import './register.scss'
import Footer from '../../component/Footer/Footer';
import axios from 'axios'
import Intro from '../../component/Intro/Intro';
import { register } from '../../action/action';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { isValidEmail, isValidPassword } from '../../utils/validators';
function Register() {
    const {t} = useTranslation()
    const [value, setValue] = useState({
        email:'',
        nickname:'',
        username:'',
        password:''
    })
    const emailRef = useRef()
    const fullNameRef = useRef()
    const usernameRef = useRef()
    const passRef = useRef()

    const navigate = useNavigate()
    const handlChange = (e)=>{
        
        setValue({...value,[e.target.name]: e.target.value})
    }
    const handInvalid = ()=>{
        if(!isValidEmail(value.email)){
            emailRef.current.innerText= "Vui lòng điền email"
            return false
        }
        if(value.name === ''){
            fullNameRef.current.innerText= "Vui lòng thông tin người dùng"
            return false
        }
        if(value.username === '') {
            usernameRef.current.innerText= "Vui lòng tên người dùng"
            return false
        }
        if(!isValidPassword(value.password)){
            passRef.current.innerText= "Vui lòng điền đúng định dạng mật khẩu."
            return false
        }
        return true
    }
    const handSubmit = async (e)=>{
        e.preventDefault()
        if(handInvalid()){
            console.log(value);
            
            const data = await register(value)
            console.log(data);
            if(data.jwt){
                navigate("/")
            }
            else if(data.status === 500){
                toast.error("Có lỗi từ máy chủ vui lòng thử lại !",{
                    delay: 1000
                })
            }
            
        }
    }
    
    return ( 
       <div>
            <div className="register__wrapper flex j-center a-center">
                <Intro/>
                <div className="inner">
                    <div className="content">
                        <div className='logo flex flex-column a-center j-center'>
                            <div className="logo-bg">
                                
                            </div>
                            <h2>{t("register_description")}</h2>
                            <button className='flex a-center j-center br-8 btn-w268'>
                            <FontAwesomeIcon icon={faFaceAngry} />
                                <p className="text-link">{t("login_with_facebook")}</p>
                            </button>
                        </div>
                        <div className='flex line-wrapper a-center j-center'>
                            <div className="line-1"></div>
                            <p className="text-line">{t("or")}</p>
                            <div className="line-2"></div>
                        </div>
                        <form className='flex flex-column j-center a-center form' onSubmit={(e)=>handSubmit(e)}>
                            <div className="input-wrapper ">
                                <input className='br-2' placeholder='' type="email" name='email' value={value.email} onChange={(e)=>handlChange(e)} />
                                <span>Email</span>
                                <p ref={emailRef} className='err'></p>
                            </div>
                            <div className="input-wrapper">
                                <input  className='br-2' placeholder='' type="text" name='nickname' value={value.name} onChange={(e)=>handlChange(e)}  />
                                <span>{t("fullname")}</span>
                                <p className='err' ref={fullNameRef}></p>
                            </div>
                            <div className="input-wrapper">
                                <input className='br-2' placeholder='' type="text" name='username' value={value.username} onChange={(e)=>handlChange(e)}  />
                                <span>{t("username")}</span>
                                <p className='err' ref={usernameRef}></p>
                            </div>
                            <div className="input-wrapper">
                                <input className='br-2' placeholder='' type="text" name='password' value={value.password} onChange={(e)=>handlChange(e)}/>
                                <span>{t("password")}</span>
                                <p className='err' ref={passRef}></p>
                            </div>
                            <div className="policy flex flex-column">
                                <span>{t("privacy")}<Link>{t("learn_more")}</Link></span>
                                <span>{t("accept_privacy")} <Link>{t("terms_privacy_policy")}</Link> {t("and")} <Link>{t("cookie_policy")}</Link></span>
                            </div>
                            <button type="submit " className='br-8 btn-w268 btn-submit'>{t("register")}</button>
                        </form>
                    </div>
                    <div className="check-account flex a-center j-center">
                        <p>{t("have_an_account_1")}</p>
                        <Link to={'/login'}>{t("login")}</Link>
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

export default Register;