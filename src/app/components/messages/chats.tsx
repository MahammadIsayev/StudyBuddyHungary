import React, { useContext, useEffect, useState } from 'react';
import styles from './messages.module.css';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { ChatContext } from '../../contexts/ChatContextProvider';
import { useUser } from '../../contexts/AuthProvider';

interface ChatData {
    chatId: string;
    date: { seconds: number; nanoseconds: number };
    userInfo: {
        uid: string;
        photoURL: string;
        fullName: string;
    };
    lastMessage?: {
        text: string;
        date?: { seconds: number; nanoseconds: number };
    };
}

const Chats: React.FC = () => {
    const currentUser = useUser();
    // console.log("Current User:", currentUser);
    const [chats, setChats] = useState<Record<string, ChatData>>({});
    const { dispatch } = useContext(ChatContext);



    useEffect(() => {
        // console.log("Effect is running");
        const getChats = () => {
            if (currentUser) {
                const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                    try {
                        const data = doc.data();
                        if (data && Object.keys(data).length > 0) {
                            // console.log("Chats document data:", data);
                            setChats(data);
                        } else {
                            console.log("No chats found for the current user yet.");
                        }
                    } catch (error) {
                        console.error("Error fetching chats:", error);
                    }
                });

                return () => {
                    unsub();
                };
            }
        };

        if (currentUser) {
            getChats();
        }
    }, [currentUser?.uid]);


    const handleSelect = (userInfo: ChatData['userInfo']) => {
        dispatch({ type: 'CHANGE_USER', payload: userInfo });
    };


    return (
        <div className={styles.chats}>
            {Object.entries(chats)?.length > 0 ? (
                Object.entries(chats)
                    .sort(([, chatDataA], [, chatDataB]) =>
                        (chatDataB.lastMessage?.date?.seconds || chatDataB.date?.seconds) -
                        (chatDataA.lastMessage?.date?.seconds || chatDataA.date?.seconds)
                    )
                    .map(([chatId, chatData]) => (
                        <div
                            key={chatId}
                            className={styles.userChat}
                            onClick={() => handleSelect(chatData.userInfo)}
                        >
                            <img src={chatData.userInfo.photoURL} alt="" className={styles.userImage} />
                            <div className={styles.userChatInfo}>
                                <span className={styles.userName}>{chatData.userInfo.fullName}</span>
                                <p className={styles.defaultText}>{chatData.lastMessage?.text}</p>
                            </div>
                        </div>
                    ))
            ) : (
                <p className={styles.noChatsText}>No chats yet. Start chatting with someone!</p>
            )}
        </div>
    );
};

export default Chats;
