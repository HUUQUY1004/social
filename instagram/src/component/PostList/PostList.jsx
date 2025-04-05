import PostItem from '../PostItem/PostItem';
import './postList.scss';
function PostList({ data, type }) {
    return (
        <div className="postList__wrapper flex wrap j-between gap-5">
            {data?.map((item) => (
                <PostItem data={item} key={item.id} type={type} />
            ))}
            <div className="virtual" key={92}></div>
        </div>
    );
}
{
}
export default PostList;
