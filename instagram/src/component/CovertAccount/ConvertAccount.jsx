import PopupWrapper from '../PopupWrapper/PopupWrapper';
import { AiOutlineClose } from 'react-icons/ai';
import './convertAccount.scss';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { isValidEmail } from '../../pages/Login/login';
import { login } from '../../action/action';
function ConvertAccount({ onClose }) {
    const [value, setValue] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
    };
     const handInvalid = ()=>{
            if(!isValidEmail(value.email)){
                return false
            }
            if(value.password.length <5 ){
                return false
            }
            return true
        }
    const ref = useRef();
    useOnClickOutside(ref, () => {
        onClose(false);
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
                if(handInvalid()){
                    const {email, password} = value
                    const data = await login(email, password)
                    console.log(data);
                    
                    if(data.message === 'Login success'){
                        localStorage.setItem('access_token', data.jwt)
                        navigate('/')
                    }
                    else {
                        console.log(data);
                        
                    }
                
                }
    };
    return (
        <PopupWrapper isClose={false}>
            <div className="convert-inner flex flex-column" ref={ref}>
                <div className="header">
                    <AiOutlineClose onClick={() => onClose(false)} />
                </div>
                <div className="convert-body flex j-center a-center flex-column">
                    <div className="avatar"></div>
                    <form action="" className="flex flex-column" onSubmit={(e) => handleSubmit(e)}>
                        <input
                            type="text"
                            placeholder="Số điện thoại người dùng hoặc gmail"
                            name="email"
                            onChange={(e) => handleChange(e)}
                        />
                        <input type="text" placeholder="Mật khẩu" name="password" onChange={(e) => handleChange(e)} />
                        <button type="submit">Đăng nhập</button>
                    </form>
                </div>
            </div>
        </PopupWrapper>
    );
}

export default ConvertAccount;
