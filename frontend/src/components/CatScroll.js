import '../stylesheets/scroll.css'
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const CatScroll = () => {
    const [images, setImages] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const fetchImages = async () => {
        try {
            const responses = await Promise.all(
                Array.from({ length: 3 }, () => fetch(process.env.REACT_APP_BACKEND_HOST+'/post/random'))
            );
            let data = await Promise.all(responses.map(res => res.json()));
            let items = data.map(item => 
                ({'image_name': `${process.env.REACT_APP_BACKEND_HOST}/post/image/${item.image_name}`, 
                'description': item.description, 'post_id': item.post_id})
            );

            const likes_responses = await Promise.all(
                Array.from(data, (x) => fetch(process.env.REACT_APP_BACKEND_HOST+'/post/likes/'+x.post_id))
            );
            const likes_data = await Promise.all(likes_responses.map(res => res.json()));
            for (let i = 0; i < items.length; i++) 
                items[i].likes_count = likes_data[i];
            return items;
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        fetchImages().then(newImages => {
            if (newImages) {
                setImages(newImages);
            }
        });
    }, []);

    const fetchMoreImages = () => {
        fetchImages().then(newImages => {
            if (newImages.length === 0) {
                setHasMore(false);
            } else {
                setImages(prevImages => [...prevImages, ...newImages]);
            }
        });
    };

    const likePost = async (post_id) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/post/like/'+post_id, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.status == 200) {
                setImages(images =>
                    images.map(item =>
                    item.post_id === post_id
                        ? { ...item, ['likes_count']: item['likes_count'] + 1 }
                        : item
                    )
                );
            }   
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="content-container">
                <InfiniteScroll
                    dataLength={images.length}
                    next={fetchMoreImages}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>You have seen all the images</b>
                        </p>
                    }
                >
                    {images.map((src, index) => (
                        <div key={index} className='img-card'>
                            <img src={src.image_name} alt={`${index}`} className="scroll-img" />
                            <div className='likes-container'>
                                <p>Likes: {src.likes_count}</p>
                                <button onClick={() => likePost(src.post_id)}>Like</button>
                            </div>
                            <p>{src.description}</p>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </>
    );
};

export default CatScroll;
