import { useRef, useState } from "react";
import useOnClickOutside from "../../../hook/useOnClickOutSide";
import { changeDescription } from "../../../action/action";

function ChangeDescription({onCloseChange}) {
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
                <h3 className="description-title text font-bold text-center text-xl ">Thay đổi tiểu sử</h3>
                <p className="description-content text-center">Nhập vào ô sau để thay đổi tiểu sử của mình.</p>
                <div className="description-input flex flex-col gap-4 mt-5">
                    <div className="border border-black p-2 rounded">
                        <input 
                            type="text"  
                            className="w-full h-full" 
                            placeholder="Hãy nhập tiểu sử mới"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>
                    <button onClick={handleClick} className="change w-full bg-blue-500 text-white py-1 rounded-md" >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeDescription;