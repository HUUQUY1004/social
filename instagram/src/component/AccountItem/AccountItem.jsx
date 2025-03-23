import { BASE_URL } from '../../action/action';
import { images } from '../../source';
import './accountItem.scss';
import { BsFillPatchCheckFill } from 'react-icons/bs';
function AccountItem({ data, following, isFolowing, popular = true }) {
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
                    <button className="br-8 btn">
                        Theo dõi
                    </button>
                </div>
            )}
        </div>
    );
}

export default AccountItem;
