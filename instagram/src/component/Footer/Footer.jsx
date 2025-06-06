import { Link } from "react-router-dom";
import './footer.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
function Footer() {
    const {t} = useTranslation()
    const intro = [
        {
            name: 'Meta',
            link:''
        },
        {
            name: t("about"),
            link:''
        },
        {
            name: 'Blog',
            link:''
        },
        {
            name: t("job"),
            link:''
        },
        {
            name:t("help"),
            link:''
        },
        {
            name: 'API',
            link:''
        },
        {
           name: t("privacy"),
           link:''
        },
        {
            name:t("term"),
            link:''
        },
        {
            name: t("most_relevant_account"),
            link:''
        },
        {
            name: t("location"),
            link:''
        },
        {
            name: 'Instagram Lite',
            link:''
        },
        {
            name: t("info_and_no_account"),
            link:''
        },
        {
            name: t("verified_meta"),
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