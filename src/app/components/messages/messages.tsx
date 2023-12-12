import React, { useContext, useEffect, useState } from 'react'
import styles from "./messages.module.css"
import Message from './message'
import { ChatContext } from '../../contexts/ChatContextProvider'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'

type Props = {}

const Messages = (props: Props) => {
    const { data } = useContext(ChatContext);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            try {
                if (doc.exists()) {
                    setMessages(doc.data()?.messages || []);
                } else {
                    console.log("No document found for the chat.");
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [data.chatId]);


    console.log(messages);


    return (
        <div className={styles.messagesBox}>
            {messages.map((m, index) => (
                <Message message={m} key={index} />
            ))}
        </div>
    )
}

export default Messages