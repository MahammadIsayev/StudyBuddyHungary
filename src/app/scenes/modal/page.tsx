import React from 'react';

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
            <div className="relative z-10 bg-red p-4 w-96">
                <span
                    className="absolute top-0 right-0 cursor-pointer text-2xl bg-transparent bg-red-500 text-white"
                    onClick={onClose}
                    style={{ padding: '0.5rem' }}
                >
                    &times;
                </span>
                {children}
            </div>
        </div>
    );
};

export default Modal;
