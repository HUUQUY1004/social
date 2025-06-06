import { useRef, useState } from "react";
import { changeAvatar } from "../../../action/action";
import useOnClickOutside from "../../../hook/useOnClickOutSide";
import { useTranslation } from "react-i18next";

function ChangeAvatar({onOpen}) {
    const {t} = useTranslation()
        const myRef = useRef();
        const [image, setImage] = useState(undefined)
        const [file,setFile] = useState(undefined)
        useOnClickOutside(myRef, () => onOpen(false));
        const handleClick = () => {
            // setShowPicker(true);
        }
        const handleFileUpload = (e) => {
            const input = e.target.parentNode.querySelector('input[type=file]');
            input.click();
        };
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            setFile(file);
            setImage(URL.createObjectURL(file));
            console.log(image);
            
        };
        const handleUploadAvatar = async () => {
            const data = await changeAvatar(file)
            if(data.status === 200){
                onOpen(false);
            }
        }

    return ( 
        <div className="description__wrapper flex a-center j-center fixed top-0 right-0 bottom-0 left-0 z-1 bg-slate-100 bg-opacity-90 ">
            <div className="description-inner flex flex-col  bg-white w-[500px] rounded-md py-5 px-10" ref={myRef}>
                <h3 className="description-title text font-bold text-center text-xl ">{t("change_avatar")}</h3>
                <p className="description-content text-center">{t("change_avatar_description")}</p>

                { 
                    image && 
                    (
                        <>
                            <img src={image} className="h-[300px] w-auto object-contain mt-5 "/>
    
                            {/* More option */}
                            {/* <div className="mt-5">
                                <p className="text-xs">Lựa chọn khác dựa vào ảnh của bạn</p>
                                
                            </div> */}
                        </>
                    )
                    
                }
                <div className="description-input flex flex-col gap-4 mt-5">
                    {
                        image ? <button onClick={handleUploadAvatar} className="change w-full bg-blue-500 text-white py-1 rounded-md" >
                        {t("update")}
                    </button> :
                    <button onClick={(e) => handleFileUpload(e)} className="change w-full bg-blue-500 text-white py-1 rounded-md" >
                    {t("choose_image")}
                </button>
                    }
                    <input
                        type="file"
                        accept="image/* , video/*"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                </div>
                
            </div>
        </div>
     );
}

export default ChangeAvatar;