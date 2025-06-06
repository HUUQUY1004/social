import { useRef, useState } from "react";
import useOnClickOutside from "../../../hook/useOnClickOutSide";
import { changeDescription } from "../../../action/action";
import { useTranslation } from "react-i18next";

function ChangeDescription({onCloseChange}) {
    const {t} = useTranslation()
    const myRef = useRef();
    const [value, setValue] = useState('')
    useOnClickOutside(myRef, () => onCloseChange(false));
    const handleClick = async() => {
        const data =  await changeDescription(value)
        if(data.status === 200){
            onCloseChange(false);
            setValue('');
        }
    }

    return (
        <div className="description__wrapper flex a-center j-center fixed top-0 right-0 bottom-0 left-0 z-1 bg-slate-100 bg-opacity-90 ">
            <div className="description-inner flex flex-col  bg-white w-[500px] rounded-md py-5 px-10" ref={myRef}>
                <h3 className="description-title text font-bold text-center text-xl ">{t("change_bio")}</h3>
                <p className="description-content text-center">{t("change_bio_description")}</p>
                <div className="description-input flex flex-col gap-4 mt-5">
                    <div className="border border-black p-2 rounded">
                        <input 
                            type="text"  
                            className="w-full h-full" 
                            placeholder={t("placeholder_input_bio")}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>
                    <button onClick={handleClick} className="change w-full bg-blue-500 text-white py-1 rounded-md" >
                        {t("update")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeDescription;