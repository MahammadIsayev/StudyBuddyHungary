import React from 'react';
import { X } from 'react-bootstrap-icons';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 bg-white p-5 w-70 px-10 rounded-md">
                <span
                    className="absolute top-0 right-0 cursor-pointer text-2xl bg-transparent text-gray"
                    onClick={onClose}
                    style={{ padding: '0.3rem', paddingLeft: '0.4rem' }}
                >
                    <X className='bg-red-600 text-white' />
                </span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
