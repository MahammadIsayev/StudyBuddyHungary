// UserModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { X } from 'react-bootstrap-icons';

type UserModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    user: PostUser | null;
};

type PostUser = {
    id: string;
    fullName: string;
    city: string;
    educationLevel: string;
    university: string;
    major: string;
    profilePictureURL: string;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, closeModal, user }) => {
    if (!user) {
        return null;
    }

    const modalStyle: Modal.Styles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyle}
            contentLabel="User Details Modal"
            shouldCloseOnOverlayClick={false}
        >
            <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-lg">
                <span
                    className="absolute top-0 right-0 cursor-pointer text-2xl bg-transparent text-gray-700"
                    onClick={closeModal}
                    style={{ padding: '0.3rem', paddingLeft: '0.4rem' }}
                >
                    <X className='bg-red-600 text-white' />
                </span>
                <h2 className="text-2xl font-semibold mb-4">User Details</h2>
                <img
                    src={user.profilePictureURL ? user.profilePictureURL : "/assets/default-profile-picture.jpg"}
                    alt={`${user.fullName}`}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <p className="mb-2">
                    <span className='font-medium'>Full Name: </span> {user.fullName}
                </p>

                <p className="mb-2"><span className='font-medium'>City:  </span> {user.city}</p>
                <p className="mb-2"><span className='font-medium'>University:  </span> {user.university}</p>
                <p className="mb-2"><span className='font-medium'>Major:  </span> {user.major}</p>
                <p className="mb-2"><span className='font-medium'>Education Level: </span>  {user.educationLevel}</p>
                {/* Add other user details as needed */}
            </div>
        </Modal>
    );

};

export default UserModal;
