import React, { useEffect, useState } from 'react'
import { getActivityHistory } from '../../action/action'
import { times } from '../../component/func/commonFunc'
import { useTranslation } from 'react-i18next'

const ActivityHistory = () => {
      const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await getActivityHistory(page);
      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setActivities(prev => [...prev, ...newData])
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (bottom) {
        fetchActivities(); // Khi cuộn gần cuối, load thêm
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore]);

  useEffect(() => {
    fetchActivities();
  }, []);
    const {t}  = useTranslation() 
    
  return (
    <div className='my-6'>
        {
            activities?.length === 0 ? (
                <div className='h-[100vh] flex justify-center items-center'>Chưa ghi nhận được hoạt động nào</div>
            ):(
                activities.map((item)=>
                <div className='px-4 lg:mx-10 w-full mt-2 cursor-pointer hover:bg-slate-100'>
                    <p className='py-2'>{item.content}</p>
                    <p>{times(item.timestamp,t)}</p>
                </div>
                )
            )
        }
    </div>
  )
}

export default ActivityHistory