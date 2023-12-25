import React from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';

type InstructionsModalProps = {
    isOpen: boolean;
    onRequestClose: () => void;
};

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onRequestClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Instructions Modal"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="fixed inset-0 flex items-center justify-center z-50">

                <div className="fixed inset-0 bg-black opacity-40"></div>


                <div className="relative z-10 bg-white p-5 w-120 rounded-md shadow-lg">
                    <button
                        onClick={onRequestClose}
                        className="absolute top-0 right-0 cursor-pointer text-2xl bg-transparent bg-red-500 text-white"
                        style={{ padding: '0.3rem', paddingLeft: '0.4rem' }}
                    >
                        <X className='bg-red-600 text-white' />
                    </button>


                    <div className="content-container">
                        <h2 className="text-2xl font-semibold mb-4">Get Started Guide</h2>


                        <div className="steps-container">
                            <p className="mb-4">
                                <strong>Step 1: My Profile</strong>
                                <ul className="list-disc pl-5 mt-2">
                                    <li>After signing in, navigate to "My Profile" to personalize your information.</li>
                                    <li>Update your profile picture, and fill in relevant details.</li>
                                    <li>Click "Save" to update your profile.</li>
                                </ul>
                            </p>
                            <p className="mb-4">
                                <strong>Step 2: Find Study Partners</strong>
                                <ul className="list-disc pl-5 mt-2">
                                    <li>Explore the "Community" section to connect with study partners.</li>
                                    <li>Use filters like location, university, and interests to narrow down your search.</li>
                                </ul>
                            </p>
                            <p className="mb-4">
                                <strong>Step 3: Forum for Posts</strong>
                                <ul className="list-disc pl-5 mt-2">
                                    <li>Visit the "Forum" to discover posts from fellow users.</li>
                                    <li>Create your posts to share insights, ask questions, or discuss topics.</li>
                                    <li>Engage with the community by adding comments to posts.</li>
                                </ul>
                            </p>
                            <p className="mb-4">
                                <strong>Step 4: Direct Messages</strong>
                                <ul className="list-disc pl-5 mt-2">
                                    <li>Head to the "Messages" to connect with users directly.</li>
                                    <li>Search for specific users and send direct messages.</li>
                                    <li>Receive real-time notifications for new messages.</li>
                                </ul>
                            </p>
                        </div>
                        <div className="tips-container">
                            <p className="mb-4">
                                <strong>Important tips:</strong>
                                <ul className="list-disc pl-5 mt-2">
                                    <li>Ensure your profile is complete for a better community experience.</li>
                                    <li>Respect others' privacy and follow community guidelines.</li>
                                    <li>Explore and have fun connecting with your fellow students!</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default InstructionsModal;
