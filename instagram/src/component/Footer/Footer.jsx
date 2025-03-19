import { Link } from "react-router-dom";
import './footer.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
function Footer() {
    const intro = [
        {
            name: 'Meta',
            link:''
        },
        {
            name: 'Giới thiệu',
            link:''
        },
        {
            name: 'Blog',
            link:''
        },
        {
            name: 'Viêc làm',
            link:''
        },
        {
            name:'Trợ giúp',
            link:''
        },
        {
            name: 'API',
            link:''
        },
        {
           name: 'Quyền riêng tư',
           link:''
        },
        {
            name:'Điều khoản',
            link:''
        },
        {
            name: 'Tài khoản lien quan nhất',
            link:''
        },
        {
            name: 'Vị trí',
            link:''
        },
        {
            name: 'Instagram Lite',
            link:''
        },
        {
            name: 'Thông tin người liên hệ & người không phải người dùng',
            link:''
        },
        {
            name: 'Meta đã xác minh',
            link:''
        }
    ]
    const option = [
        'Vietnamese',
        'English',
        'Thailand',
        'French',
        'Spanish',
        'Japanese'
    ]
    return ( 
        <div className="footer__wrapper ">
            <div className="intro flex wrap j-center">
                {
                    intro.map((intro, index)=>(
                        <div className="item" key={index}>
                            <Link>{intro.name}</Link>
                        </div>
                    ))
                }
            </div>
            <div className="coppy flex a-center j-center">
                <select name="language" id="">
                    {
                        option.map((option, index) =>(
                            <option key={index}>{option}</option>
                        ))
                    }
                </select>
                <p>
                    <FontAwesomeIcon icon={faCopyright}/>
                    <span>2023 Instagram from Meta</span>
                </p>
            </div>

        </div>
         );
}

export default Footer;