import '../stylesheets/draftpost.css'
import React, { useState } from 'react';

const PostedModal = ({message, onClose}) => {
    return (
      <div className="modal-backdrop">
        <div className="modal">
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  

const DraftPost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [img_file, setIMGFile] = useState(null);
    const [modalMessage, setModalMessage] = useState(null);

    const closeModal = () => {
        setModalMessage(null);
    };

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
            if (response.status === 200)
                setModalMessage("Success");
            else if (response.status === 401)
                setModalMessage("Unauthorized");
            else if (response.status === 418)
                setModalMessage("Not A Cat!");
            else
                setModalMessage("Error");
        } catch (error) {
            setModalMessage("Error")
            console.error('Error:', error);
        }
    };

    return (
    <>
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
        {modalMessage && <PostedModal message={modalMessage} onClose={closeModal} />}
    </>
    );
};

export default DraftPost;