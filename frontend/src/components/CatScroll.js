import '../stylesheets/scroll.css';
import React, { useState, useEffect } from 'react';

const CatScroll = () => {
    const [images, setImages] = useState([]);
    const [loadMore, setLoadMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch image data from the API
    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const responses = await Promise.all(
                Array.from({ length: 3 }, () => fetch(process.env.REACT_APP_BACKEND_HOST+'/post/random'))
            );
            const data = await Promise.all(responses.map(res => res.json()));
            return data.map(item => `${process.env.REACT_APP_BACKEND_HOST}/post/image/${item.image_name}`);
        } catch (error) {
            console.log(images);
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load initial images
    useEffect(() => {
        fetchImages().then(newImages => {
            if (newImages) {
                setImages(newImages);
            }
        });
    }, []);

    // Load more images when 'loadMore' is true
    useEffect(() => {
        if (loadMore) {
            fetchImages().then(moreImages => {
                if (moreImages) {
                    setImages(prevImages => [...prevImages, ...moreImages]);
                }
                setLoadMore(false);
            });
        }
    }, [loadMore]);

    // Scroll event handler
    const handleScroll = () => {
        const secondImage = document.getElementById('image-1');
        if (secondImage && window.scrollY > secondImage.offsetTop) {
            setLoadMore(true);
        }
    };

    // Add scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            {isLoading ? <p>Loading images...</p> : null}
            {images.map((src, index) => (
                <img key={index} className='scroll-img' id={`image-${index}`} src={src} alt={`Image ${index}`} />
            ))}
        </div>
    );
};

export default CatScroll;
