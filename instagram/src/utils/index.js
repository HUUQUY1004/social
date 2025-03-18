import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const GetUser = ()=>{
    const [currentUser, setCurrentUser] = useState(undefined)
    const navigate = useNavigate()
    const checkUser = async ()=>{
        if(!localStorage.getItem('instagram-user')){
            navigate('/login')
        }
        else{
           await setCurrentUser(JSON.parse(localStorage.getItem('instagram-user')))
        }
    }
    useEffect(() => {
        checkUser()
    }, []);
    console.log(currentUser);
}