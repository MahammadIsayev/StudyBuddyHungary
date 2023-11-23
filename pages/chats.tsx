import React, { useContext, useEffect, useState } from 'react'
import styles from "./messages.module.css"
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../src/app/firebase';
import { User } from 'firebase/auth';
// import { ChatContext, ChatContextProvider } from './context/ChatContext';

interface ChatData {
    chatId: string;
    date: { seconds: number, nanoseconds: number };
    userInfo: {
        uid: string;
        photoURL: string;
        fullName: string;
    };
    lastMessage?: {
        text: string;
    };
}

const Chats = () => {
    const currentUser: User | null = auth.currentUser;
    // const { dispatch } = useContext(ChatContext)
    const [chats, setChats] = useState<Record<string, ChatData>>({});

    useEffect(() => {
        const getChats = () => {
            if (currentUser) {
                const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                    setChats(doc.data() as Record<string, ChatData> || {});
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

    console.log(chats);

    // const handleSelect = (u: any) => {
    //     dispatch({ type: "CHANGE_USER", payload: u })
    // }

    return (
        <div className={styles.chats}>
            {Object.entries(chats)?.map(([chatId, chatData]) => (
                <div key={chatId} className={styles.userChat}>
                    <img src={chatData.userInfo.photoURL} alt="" className={styles.userImage} />
                    <div className={styles.userChatInfo}>
                        <span className={styles.userName}>{chatData.userInfo.fullName}</span>
                        {/* <p className={styles.defaultText}>{chatData.lastMessage?.text}</p> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Chats;
