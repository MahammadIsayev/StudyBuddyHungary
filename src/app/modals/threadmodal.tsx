// PostModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';

interface PostModalProps {
    isOpen: boolean;
    closeModal: () => void;
    createPost: () => void;
    title: string;
    setTitle: (value: string) => void;
    postText: string;
    setPostText: (value: string) => void;
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
    setPostText,
}) => {
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

                <button
                    onClick={createPost}
                    className="float-right bg-orange-500 text-white py-2 px-6 mt-8 rounded-md hover:bg-orange-600 transition duration-300"
                >
                    Share
                </button>
            </div>
        </Modal>
    );
};

export default PostModal;
