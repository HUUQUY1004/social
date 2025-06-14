import PopupWrapper from '../PopupWrapper/PopupWrapper';
import { AiOutlineClose } from 'react-icons/ai';
import './convertAccount.scss';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { login } from '../../action/action';
import { isValidEmail } from '../../utils/validators';
import { useTranslation } from 'react-i18next';

function ConvertAccount({ onClose }) {
    const { t } = useTranslation();
    const [value, setValue] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState({
        email: '',
        password: '',
        general: '',
    });

    const navigate = useNavigate();
    const ref = useRef();

    useOnClickOutside(ref, () => {
        onClose(false);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: '', general: '' }));
    };

    const handleValidate = () => {
        let valid = true;
        const newError = { email: '', password: '', general: '' };

        if (!isValidEmail(value.email)) {
            newError.email = t("invalid_email");
            valid = false;
        }

        if (value.password.length < 5) {
            newError.password = t("invalid_password");
            valid = false;
        }

        setError(newError);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidate()) {
            const { email, password } = value;
            const data = await login(email, password);
            console.log(data);
            
            if (data.message === 'Login success') {
                localStorage.setItem('access_token', data.jwt);
                window.location.href = '/'
            } else {
                setError((prev) => ({ ...prev, general: t("login_failed") }));
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
                    <form className="flex flex-column" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder='Email'
                            name="email"
                            value={value.email}
                            onChange={handleChange}
                        />
                        {error.email && <span className="error-text text-red-500">{error.email}</span>}

                        <input
                            type="password"
                            placeholder={t("password")}
                            name="password"
                            value={value.password}
                            onChange={handleChange}
                        />
                        {error.password && <span className="error-text text-red-500">{error.password}</span>}

                        {error.general && <span className="error-text text-red-500">{error.general}</span>}

                        <button type="submit">{t("login")}</button>
                    </form>
                </div>
            </div>
        </PopupWrapper>
    );
}

export default ConvertAccount;
