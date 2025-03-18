import PostItem from '../PostItem/PostItem';
import './postList.scss';
function PostList({ data, type }) {
    return (
        <div className="postList__wrapper flex wrap j-between">
            {data.map((item) => (
                <PostItem data={item} key={item._id} type={type} />
            ))}
            <div className="virtual" key={92}></div>
        </div>
    );
}
{
}
export default PostList;
