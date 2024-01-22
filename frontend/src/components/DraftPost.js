import '../stylesheets/draftpost.css'
import React, { useState } from 'react';

const DraftPost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [img_file, setIMGFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (img_file) {
            formData.append('file', img_file);
        }

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/post/create', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="file"
                onChange={(e) => setIMGFile(e.target.files[0])}
            />
            <button type="submit">Submit</button>
        </form>
        </div>
    );
};

export default DraftPost;