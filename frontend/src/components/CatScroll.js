import '../stylesheets/scroll.css'
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const CatScroll = () => {
    const [images, setImages] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const fetchImages = async () => {
        try {
            const responses = await Promise.all(
                Array.from({ length: 5 }, () => fetch(process.env.REACT_APP_BACKEND_HOST+'/post/random'))
            );
            const data = await Promise.all(responses.map(res => res.json()));
            return data.map(item => `${process.env.REACT_APP_BACKEND_HOST}/post/image/${item.image_name}`);
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

    return (
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
                <img key={index} src={src} alt={`${index}`} className="scroll-img" />
            ))}
        </InfiniteScroll>
    );
};

export default CatScroll;
