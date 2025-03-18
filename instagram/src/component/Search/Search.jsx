import { Fragment, useEffect, useState } from 'react';
import TranSlate from '../Translate/Translate';
import { AiFillCloseCircle } from 'react-icons/ai';
import { BiLoader } from 'react-icons/bi';
import './search.scss';
import AccountItem from '../AccountItem/AccountItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Search() {
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [value, setValue] = useState('');
    const searchUser = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/user/search/${value}`);
        if (data.status === true) {
            setUserList(data.userList);
        }
    };
    useEffect(() => {
        searchUser();
    }, [value]);
    return (
        <TranSlate minWidth={0} maxWidth={'400px'}>
            <div className="search__wrapper">
                <div className="search-header-wrapper">
                    <h2 className="search-header">Tìm kiếm</h2>
                    <div className="input-search br-8">
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <span>{isLoading ? <BiLoader /> : <AiFillCloseCircle onClick={() => setValue('')} />}</span>
                    </div>
                </div>
                <div className="search-body">
                    <div className="recently flex a-center j-between">
                        <h4>Gần đây</h4>
                        {userList.length > 0 ? (
                            <p className="delete-all" onClick={() => setUserList([])}>
                                Xóa tất cả
                            </p>
                        ) : (
                            <Fragment />
                        )}
                    </div>
                    <div className="recently-list">
                        {userList.length > 0 ? (
                            userList.map((item, index) => (
                                <div className="user-list" key={index}>
                                    <Link to={`/${item.username}`}>
                                        <AccountItem data={item} isFolowing={false} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="recent-nothing flex a-center j-center">
                                <p>Không có nội dung tìm kiếm mới đây</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TranSlate>
    );
}

export default Search;
