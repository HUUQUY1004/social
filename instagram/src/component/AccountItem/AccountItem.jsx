import { useState } from 'react';
import { acceptFriend, BASE_URL, rejectFriend } from '../../action/action';
import { images } from '../../source';
import './accountItem.scss';
import { BsFillPatchCheckFill } from 'react-icons/bs';
function AccountItem({ idRequest = 0,data, following, isFolowing, popular = true, feedback= false }) {
    const [titleAcp , setTitleAcp] = useState("Chấp nhận")
    const [titleReject , setTitleReject] = useState("Từ chối")
    const acceptInvitation = async (id) => {
        const data = await acceptFriend(id);
        if(data.status === 200){
        setTitleAcp("Đã chấp nhận ")
        }
        
    }
    const rejectInvitation = async (id) => {
        const data = await rejectFriend(id);
        if(data.status === 200){
        setTitleReject("Đã từ chối")
        }
        
    }
    return (
        <div className="account flex a-center j-between">
            <div className="left flex">
                <div className="avatar">
                    <img src={data.avatar ? BASE_URL+ data.avatar : images.noAvatar} alt="avatar" />
                </div>
                <div className="information">
                    <h4 className="username">
                        {data.username} {data?.ticked ? <BsFillPatchCheckFill className="tick" /> : ''}
                    </h4>
                    <p className="name">{data.name}</p>
                    {popular && <span className="description">Phổ biến</span>}
                </div>
            </div>
            {isFolowing && (
                <div className="right">
                    <button onClick={()=>following(data.id)} className="br-8 btn font-semibold">
                        Kết bạn
                    </button>
                </div>
            )}
            {
                feedback &&
                <div className="feedback flex gap-2">
                    <button onClick={()=>rejectInvitation(idRequest)} className=" py-2 px-4 bg-red-500 text-white br-8 btn font-semibold">
                        {titleReject}
                    </button>
                    <button onClick={()=>acceptInvitation(idRequest)} className="py-2 px-4 bg-blue-500 text-white br-8 btn font-semibold">
                        {titleAcp}
                    </button>
                </div>
            }
        </div>
    );
}

export default AccountItem;
