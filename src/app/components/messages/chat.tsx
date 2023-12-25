import React, { useContext } from 'react';
import styles from './messages.module.css';
import Messages from './messages';
import Input from './input';
import { ChatContext } from '../../contexts/ChatContextProvider';

const Chat: React.FC = () => {
    const { data } = useContext(ChatContext);

    const fullName = data.user?.fullName || '';
    const profilePictureURL = data.user?.photoURL || '';

    return (
        <div className={styles.chat}>
            <div className={styles.chatInfo}>
                <div className={styles.user}>
                    {profilePictureURL && (
                        <img
                            src={profilePictureURL}
                            alt=""
                            className={styles.img}
                        />
                    )}
                </div>
                <span className={styles.navbarFullName}>{fullName}</span>
            </div>
            <Messages />
            <Input />
        </div>
    );
};

export default Chat;
