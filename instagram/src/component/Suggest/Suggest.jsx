import axios from 'axios';
import AccountItem from '../AccountItem/AccountItem';
import './suggest.scss';
import { following } from '../func/commonFunc';
import { addFriend } from '../../action/action';
function Suggest({ suggestUser, currentUser }) {
    const handlefollowing = async(userId) => {
        console.log("id" , userId);
        
        await addFriend(userId)
    };
    return (
        <div className="suggest flex j-center">
            <div className="inner ">
                <h4 className="suggest-name">Gợi ý cho bạn</h4>
                <div className="suggest-account">
                    {suggestUser?.map((user, index) => (
                        <AccountItem key={index} data={user} following={handlefollowing} isFolowing={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Suggest;
