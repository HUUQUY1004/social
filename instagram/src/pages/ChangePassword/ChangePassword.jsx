import React, { useEffect, useState } from 'react'
import Header from '../../component/header/header'
import LoadingComponent from '../../component/Loading/loadingComponent'
import { Link, useNavigate } from 'react-router-dom'

const ChangePassword = () => {
    const [error, setError] = useState({status: false, message:''})
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleChangePass = (e)=>{
        setPassword(e.target.value)
    }
    const handleChangeConfirm= (e)=>{
        setConfirmPassword(e.target.value)
    }
    const handleClick = async()=>{
        if(password.length===0){
            setError({
                status: true,
                message: "Vui lòng nhập mật khẩu."
            })
            return;
        }
       else if(confirmPassword.length===0){
            setError({
                status: true,
                message: "Vui lòng nhập mật khẩu."
            })
            return;
        }
        else if(password !== confirmPassword){
            setError({
                status: true,
                message: "Mật khẩu xác nhạn không khớp."
            })
            return;
        }
        else {
            alert('ok')
        }
    }
    useEffect(()=>{
        const parsedEmail = JSON.parse(localStorage.getItem('email'));
        if( parsedEmail ==null ||parsedEmail.expire < Date.now()){
            navigate("/account/find")
        }
        
    },[])
  return (
    <div>
        <Header/>
        <div className='border w-[388px] mx-auto mt-5 text-center p-6'>
          <div className='gap-2 flex items-center flex-column'>
            <svg className='text-center' aria-label="Bạn gặp sự cố khi đăng nhập?" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="96" role="img" viewBox="0 0 96 96" width="96"><title>Bạn gặp sự cố khi đăng nhập?</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <h1 className='font-bold'>Đặt lại mật khẩu mới</h1>
            {
                error.status ? <p className='text-red-500 font-bold'>{error.message}</p> : <p>Đặt lại mật khẩu mới.</p>
            }

           <div className=' w-full mt-2 space-y-4'> 
                <div>
                    <label className='text-start block' htmlFor="">Mật khẩu mới</label>
                    <div className='border mt-2'><input onChange={(e)=>handleChangePass(e)} value={password} type="text" placeholder='Mật khẩu mới' className='w-full h-full py-2 px-3'/></div>
                </div>
                <div>
                    <label className='text-start block' htmlFor="">Nhập lại mật khẩu mới</label>
                    <div className='border mt-2'><input value={confirmPassword}  onChange={(e)=>handleChangeConfirm(e)}  type="text" placeholder='Xác nhận mật khẩu mới' className=' w-full h-full py-2 px-3'/></div>
                </div>

            </div>
              <button onClick={handleClick} className='text-white font-bold w-full py-2 rounded-md mt-2' style={{backgroundColor: 'var(--blue-color)'}}>
                {
                  isLoading ? <LoadingComponent/> : "Đặt lại"
                }
              </button>

              <p>Hoặc</p>

              <Link style={{color:'var(--blue-color)'}} className='font-bold' to={'/register'}>Tạo tài khoản mới</Link>
              <Link style={{color:'var(--blue-color)'}} className='font-bold' to={'/login'}>Quay lại đăng nhập</Link>
          </div>
      </div>
    </div>
  )
}

export default ChangePassword