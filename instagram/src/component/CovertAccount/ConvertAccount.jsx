import PopupWrapper from '../PopupWrapper/PopupWrapper';
import { AiOutlineClose } from 'react-icons/ai';
import './convertAccount.scss';
import { useRef, useState } from 'react';
import { login } from '../func/commonFunc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useOnClickOutside from '../../hook/useOnClickOutSide';
function ConvertAccount({ onClose }) {
    const [value, setValue] = useState({
        email: '',
        password: '',
    });
    const [userConvert, setUserConvert] = useState(undefined);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
    };
    const checkInvalid = () => {
        if (value.email.includes('@gmail.com') && value.password.length > 6) {
            return true;
        }
        return false;
    };
    const ref = useRef();
    useOnClickOutside(ref, () => {
        onClose(false);
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checkInvalid()) {
            const { email, password } = value;
            const { data } = await axios.post('http://localhost:5000/api/user/login', {
                email,
                password,
            });
            localStorage.setItem('instagram-user', JSON.stringify(data.user));
            window.location.reload(false);
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
