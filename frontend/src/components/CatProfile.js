import '../stylesheets/catprofile.css'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CatProfile = () => {
    let { username } = useParams();
    const [posts, setPosts] = useState([]); // State to store fetched posts

    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/posts/user/'+username, {
                method: 'GET',
            });
            const resJson = await response.json();
            setPosts(resJson); // Set the fetched posts into the state
        }
        fetchPosts();
    }, [username]);

    return (
        <div className='grid-container'>
            {posts.map(post => (
                <div key={post.post_id} className='grid-item'>
                    <img
                        src={`${process.env.REACT_APP_BACKEND_HOST}/post/image/${post.image_name}`}
                        alt={post.title}
                    />
                    <p>{post.title}</p>
                </div>
            ))}
        </div>
    );
};

export default CatProfile;
