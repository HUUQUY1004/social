import React from 'react'
import { images } from '../../source'

const Header = () => {
  return (
    <div className='border-b-2 px-4'>
        <div className='mx-auto lg:w-[940px] flex justify-between py-4 '>
            <img src={images.logoLoading}  className='w-14 h-14'/>
            <div className='flex gap-2 items-center'>
                <button className='text-white font-semibold px-3 h-11 py-1 rounded-md' style={{backgroundColor:'var(--blue-color)'}}>Đăng nhập</button>
                <button className='font-semibold px-3 h-11 py-1 rounded-md'style={{color:'var(--blue-color)'}} >Đăng ký</button>
            </div>
        </div>
    </div>
  )
}

export default Header