// PostModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';

interface PostModalProps {
    isOpen: boolean;
    closeModal: () => void;
    createPost: () => void;
    title: string;
    setTitle: (value: string) => void;
    postText: string;
    category: string;
    setPostText: (value: string) => void;
    setCategory: (value: string) => void;
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '600px',
        padding: '20px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
};

const PostModal: React.FC<PostModalProps> = ({
    isOpen,
    closeModal,
    createPost,
    title,
    setTitle,
    postText,
    category,
    setPostText,
    setCategory
}) => {
    const [titleError, setTitleError] = useState('');
    const [postTextError, setPostTextError] = useState('');
    const [categoryError, setCategoryError] = useState('');

    const clearErrors = () => {
        setTitleError('');
        setPostTextError('');
        setCategoryError('');
    };

    const handleCreatePost = () => {
        clearErrors();
        
        if (!title.trim()) {
            setTitleError('Title can not be empty');
            return;
        }

        if (!postText.trim()) {
            setPostTextError('Post text can not be empty');
            return;
        }

        if (!category) {
            setCategoryError('Please, choose a category.');
            return;
        }

        createPost();

        closeModal();
    };
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Create Post Modal"
            style={customStyles}
        >
            <div className="modal-content bg-white rounded-md shadow-lg p-5">
                <span
                    className="absolute top-0 right-0 cursor-pointer text-2xl bg-transparent text-gray-700"
                    onClick={closeModal}
                    style={{ padding: '0.3rem', paddingLeft: '0.4rem' }}
                >
                    <X className='bg-red-600 text-white' />
                </span>
                <label className="block text-sm font-medium text-gray-700 mt-4" htmlFor="category">
                    Category
                </label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                >
                    <option value="" disabled>Category</option>
                    <option value="General">General</option>
                    <option value="Academic Discussion">Academic Discussion</option>
                    <option value="University-specific">University-specific</option>
                    <option value="Career Development">Career Development</option>
                    <option value="Study Meetups">Study Meetups</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4" htmlFor="title">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter a descriptive title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    maxLength={80}
                    style={{ resize: 'none', maxHeight: '150px' }}
                />

                <label className="block text-sm font-medium text-gray-700 mt-4" htmlFor="post">
                    Post
                </label>
                <textarea
                    id="post"
                    placeholder="Share your thoughts, ask questions, or provide insights..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    maxLength={5000}
                    style={{ resize: 'none', maxHeight: '150px' }}
                    rows={4}
                    cols={50}
                ></textarea>
                {titleError && <p className="text-red-500">{titleError}</p>}
                {postTextError && <p className="text-red-500">{postTextError}</p>}
                {categoryError && <p className="text-red-500">{categoryError}</p>}
                <button
                    onClick={handleCreatePost}
                    className="float-right bg-orange-500 text-white py-2 px-6 mt-8 rounded-md hover:bg-orange-600 transition duration-300"
                >
                    Share
                </button>

            </div>
        </Modal>
    );
};

export default PostModal;
