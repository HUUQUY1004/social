import React, { useEffect, useRef, useState } from 'react'
import Header from '../../component/header/header'
import { Link, useNavigate } from 'react-router-dom'
import { useDebounce } from '../../hook/useDebounce'
import { findUserByEmail, verifyOTP } from '../../action/action'
import { images } from '../../source'
import LoadingComponent from '../../component/Loading/loadingComponent'

const FindAccount = () => {
  const [value,setValue] = useState('')
  const [otp,setOtp] = useState('')
  const [error, setError] = useState({status: false, message: ''})
  const [isLoading, setIsLoading] = useState(false)
  const emailInputRef = useRef()
  const optInputRef = useRef()
  const pRef = useRef()
  const navigate = useNavigate()
  const parsedEmail = JSON.parse(localStorage.getItem('email'));

  const storedOtp = localStorage.getItem('otp');
  const handleChange =async (e)=>{
    setValue(e.target.value)
  }
  const handleChangeOTP =async (e)=>{
    setOtp(e.target.value)
  }

  const handleClick = async()=>{
    console.log(parsedEmail);
    
    setIsLoading(true)
    if(otp.length >0){
      const data = await verifyOTP({email:parsedEmail.email , otp })
      setIsLoading(false)
      if(data.status === 200){
        navigate('/account/changePassword')
      }
      else {
        setError({
          status: true,
          message: ' Vui lòng nhập lại mã OTP.'
        })
        
      }
      return;
    }
    else{
      const data = await findUserByEmail(value)
      if(data.status === 200){
        pRef.current.innerText = `Chúng tôi đã gửi mã OTP qua email ${value}. Vui lòng nhập mã OTP vào bên dưới.`
        emailInputRef.current.style.display = 'none'
        optInputRef.current.style.display = 'block'
        const expireTime = Date.now() + 5 * 60 * 1000;
        localStorage.setItem('email', JSON.stringify({ email: value, expire: expireTime }));
        setIsLoading(false)
      }
      else {
        
      setError({
        status: true,
        message: 'Chúng tôi không tìm thấy tài khoản có email này !'
      })
      setIsLoading(false)
      }
    }
   
    
  }
  useEffect(() => {
    
  
    if (parsedEmail) {
      if (parsedEmail.expire > Date.now()) {
        setValue(parsedEmail.value);
        emailInputRef.current.style.display = 'none';
        optInputRef.current.style.display = 'block';
        pRef.current.innerText = `Chúng tôi đã gửi mã OTP qua email ${parsedEmail.email}. Vui lòng nhập mã OTP vào bên dưới.`;
      } else {
        localStorage.removeItem('email');
      }
    } else {
      pRef.current.innerText = 'Nhập email, số điện thoại hoặc tên người dùng của bạn và chúng tôi sẽ gửi cho bạn một liên kết để truy cập lại vào tài khoản.';
    }
  
    if (storedOtp) {
      const parsedOtp = JSON.parse(storedOtp);
      if (parsedOtp.expire > Date.now()) {
        setOtp(parsedOtp.value);
      } else {
        localStorage.removeItem('otp');
      }
    }
  }, []);
  
  
  return (
    <div>
      <Header/>

      <div className='border w-[388px] mx-auto mt-5 text-center p-6'>
          <div className='gap-2 flex items-center flex-column'>
            <svg className='text-center' aria-label="Bạn gặp sự cố khi đăng nhập?" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="96" role="img" viewBox="0 0 96 96" width="96"><title>Bạn gặp sự cố khi đăng nhập?</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle><path d="M60.931 70.001H35.065a5.036 5.036 0 0 1-5.068-5.004V46.005A5.036 5.036 0 0 1 35.065 41H60.93a5.035 5.035 0 0 1 5.066 5.004v18.992A5.035 5.035 0 0 1 60.93 70ZM37.999 39.996v-6.998a10 10 0 0 1 20 0v6.998" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <h1 className='font-bold'>Bạn gặp sự cố khi đăng nhập?</h1>
            <p ref={pRef}></p>

           <div className='border w-full mt-2'> 
              <input ref={emailInputRef}  onChange={(e)=>handleChange(e)} value={value} type="text" placeholder='Email của bạn' className='w-full h-full py-2 px-3'/>
              <input ref={optInputRef}  onChange={(e)=>handleChangeOTP(e)}  value={otp} type="text" placeholder='Nhập mã OTP' className='hidden w-full h-full py-2 px-3'/>

            </div>
            {
              error.status &&     <p className='text-sm text-red-600 font-semibold'>{error.message}</p>
            }
              <button onClick={handleClick} className='text-white font-bold w-full py-2 rounded-md mt-2' style={{backgroundColor: 'var(--blue-color)'}}>
                {
                  isLoading ? <LoadingComponent/> : "Tiếp tục"
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

export default FindAccount