import React, { useEffect, useState } from 'react'
import Header from '../../component/header/header'
import { Link } from 'react-router-dom'
import { useDebounce } from '../../hook/useDebounce'
import { findUserByEmail } from '../../action/action'

const FindAccount = () => {
  const [value,setValue] = useState('')
  const handleChange =async (e)=>{
    setValue(e.target.value)
  }

  const handleClick = async()=>{
    const data = await findUserByEmail(value)
    console.log(data);
    
  }

  
  return (
    <div>
      <Header/>

      <div className='border w-[388px] mx-auto mt-5 text-center p-6'>
          <div className='gap-2 flex items-center flex-column'>
            <svg className='text-center' aria-label="Bạn gặp sự cố khi đăng nhập?" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="96" role="img" viewBox="0 0 96 96" width="96"><title>Bạn gặp sự cố khi đăng nhập?</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <h1 className='font-bold'>Bạn gặp sự cố khi đăng nhập?</h1>
            <p>Nhập email, số điện thoại hoặc tên người dùng của bạn và chúng tôi sẽ gửi cho bạn một liên kết để truy cập lại vào tài khoản.</p>

           <div className='border w-full mt-2'> 
              <input onChange={(e)=>handleChange(e)} value={value} type="text" placeholder='Email của bạn' className='w-full h-full py-2 px-3'/>

            </div>
              <button onClick={handleClick} className='text-white font-bold w-full py-2 rounded-md mt-2' style={{backgroundColor: 'var(--blue-color)'}}>Tiếp tục</button>

              <p>Hoặc</p>

              <Link style={{color:'var(--blue-color)'}} className='font-bold' to={'/register'}>Tạo tài khoản mới</Link>
              <Link style={{color:'var(--blue-color)'}} className='font-bold' to={'/login'}>Quay lại đăng nhập</Link>
          </div>
        </div>
    </div>
  )
}

export default FindAccount