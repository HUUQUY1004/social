import React, { useRef } from 'react'
import './custom.scss'
import useOnClickOutside from '../../hook/useOnClickOutSide'
import { deleteAlbum } from '../../action/action'
import { useNavigate } from 'react-router-dom'
const CustomAlbum = ({onClose,id}) => {
    const customRef = useRef()
    useOnClickOutside(customRef, ()=> onClose(false))

    const navigate = useNavigate()
    const handleClick = async()=>{
     const data = await deleteAlbum(id)
     if(data.status ===200){
      navigate("/profile")
     }
    }
  return (
    <div className="custom" >
        <div ref={customRef}>
            <ul>
                <li className="delete" onClick={handleClick}>
                   Xóa
                </li>
                <li>Chỉnh sửa bộ sưu tập</li>
                <li onClick={()=>onClose(false)}>Hủy</li>
            </ul>
        </div>
    </div>
  )
}

export default CustomAlbum