import { useState } from 'react';
import { acceptFriend, BASE_URL, rejectFriend } from '../../action/action';
import { images } from '../../source';
import './accountItem.scss';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
function AccountItem({ idRequest = 0,data, following, isFolowing, popular = true, feedback= false }) {
    const {t} = useTranslation()
    const [titleAcp , setTitleAcp] = useState(t("accept"))
    const [titleReject , setTitleReject] = useState(t("reject"))
    const acceptInvitation = async (id) => {
        const data = await acceptFriend(id);
        if(data.status === 200){
        setTitleAcp(t("accepted"))
        }
        
    }
    const rejectInvitation = async (id) => {
        const data = await rejectFriend(id);
        if(data.status === 200){
        setTitleReject(t("rejected"))
        }
        
    }
    return (
        <div className="account flex a-center j-between hover:bg-slate-200 px-4 py-1">
            <div className="left flex items-center">
                <div className="avatar">
                    <img src={data.avatar ? BASE_URL+ data.avatar : images.noAvatar} alt="avatar" />
                </div>
                <div className="information">
                    <h4 className="username">
                        {data.username} {data?.ticked ? <BsFillPatchCheckFill className="tick" /> : ''}
                    </h4>
                    <p className="name">{data.name}</p>
                    {popular && <span className="description">{t("popular")}</span>}
                </div>
            </div>
            {isFolowing && (
                <div className="right">
                    <button onClick={()=>following(data.id)} className="br-8 btn font-semibold">
                        {
                            t("make_friend")
                        }
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
