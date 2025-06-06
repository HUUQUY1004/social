import { useEffect, useState } from 'react';
import './postHome.scss';
import PostHomeItem from '../PostHomeItem/PostHomeItem';
import { times } from '../func/commonFunc';
import { useUser } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

function PostHome({ postList }) {
    const {t} = useTranslation()
    const {currentUser} = useUser()

    return (
        <div className="post-home">
            {postList?.map((item, index) => {
                const time = times(item.createdAt, t);

                return (
                    <div key={index} className="post-home-item-wrapper">
                        <PostHomeItem currentUser={currentUser} item={item} time={time} />
                    </div>
                );
            })}
        </div>
    );
}

export default PostHome;
