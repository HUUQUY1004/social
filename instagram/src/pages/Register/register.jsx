import React, { useState } from 'react';
import {images} from '../../source/index'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faFaceAngry} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom';
import './register.scss'
import Footer from '../../component/Footer/Footer';
import axios from 'axios'
import Intro from '../../component/Intro/Intro';
function Register() {
    const [value, setValue] = useState({
        email:'',
        name:'',
        username:'',
        password:''
    })
    const navigate = useNavigate()
    const handlChange = (e)=>{
        setValue({...value,[e.target.name]: e.target.value})
    }
    const handInvalid = ()=>{
        if(!value.email.includes('@gmail.com')){
            return false
        }
        if(value.name === ''){
            return false
        }
        if(value.username === '') {
            return false
        }
        if(value.password.length <5 ){
            return false
        }
        return true
    }
    const handSubmit = async (e)=>{
        e.preventDefault()
        if(handInvalid()){
            const {email, name,username, password} = value
            const {data} = await axios.post('http://localhost:5000/api/user/register', {
                email,
                name,
                username,
                password
            })
            if(data.status === 400){
                alert(data.msg)
            }
            if(data.status ===200){
                localStorage.setItem('instagram-user',JSON.stringify(data.user))
                navigate('/login')
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
                            <h2>Đăng kí để xem ảnh và video từ bạn bè</h2>
                            <button className='flex a-center j-center br-8 btn-w268'>
                            <FontAwesomeIcon icon={faFaceAngry} />
                                <p className="text-link">Đăng nhập bằng Facebook</p>
                            </button>
                        </div>
                        <div className='flex line-wrapper a-center j-center'>
                            <div className="line-1"></div>
                            <p className="text-line">Hoặc</p>
                            <div className="line-2"></div>
                        </div>
                        <form className='flex flex-column j-center a-center form' onSubmit={(e)=>handSubmit(e)}>
                            <div className="input-wrapper ">
                                <input className='br-2' type="email" name='email' value={value.email} onChange={(e)=>handlChange(e)} />
                                <span>Email</span>
                            </div>
                            <div className="input-wrapper">
                                <input className='br-2' type="text" name='name' value={value.name} onChange={(e)=>handlChange(e)}  />
                                <span>Tên dầy đủ</span>
                            </div>
                            <div className="input-wrapper">
                                <input className='br-2' type="text" name='username' value={value.username} onChange={(e)=>handlChange(e)}  />
                                <span>Tên người dùng</span>
                            </div>
                            <div className="input-wrapper">
                                <input className='br-2' type="text" name='password' value={value.password} onChange={(e)=>handlChange(e)}/>
                                <span>Mật khẩu</span>
                            </div>
                            <div className="policy flex flex-column">
                                <span>Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Instagram.<Link>Tìm hiểu thêm</Link></span>
                                <span>Bằng cách đăng ký, bạn đồng ý với <Link>Điều khoản</Link> <Link>Chính sách riêng tư</Link> và <Link>Chính sách cookie của chúng tôi</Link></span>
                            </div>
                            <button type="submit " className='br-8 btn-w268 btn-submit'>Đăng kí</button>
                        </form>
                    </div>
                    <div className="check-account flex a-center j-center">
                        <p>Bạn đã có tài khoản ?</p>
                        <Link to={'/login'}>Đăng nhập</Link>
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

export default Register;