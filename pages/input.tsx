import React, { useContext, useState } from 'react'
import styles from "./messages.module.css"
import { useUser } from './context/AuthProvider'
import { ChatContext } from './context/ChatContextProvider'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { v4 as uuid } from "uuid"
import { db, storage } from "../src/app/firebase"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

type Props = {}

const Input = (props: Props) => {

    const [text, setText] = useState("")
    const [img, setImg] = useState<File | null>(null);


    const currentUser = useUser()
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        const senderId = currentUser?.uid;

        if (!senderId) {
            console.error('Current user is null');
            return;
        }
        if (img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                'state_changed',
                (error) => {
                    console.error('Error uploading image:', error);
                    // TODO: Handle the error appropriately
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId,
                                date: Timestamp.now(),
                                img: downloadURL,
                            }),
                        });
                    });
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId,
                    date: Timestamp.now(),
                }),
            });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.textInput}>
            <input type="text" placeholder='Type something...' value={text} className={styles.typeInput} onChange={e => setText(e.target.value)} onKeyDown={handleKeyPress} />
            <div className={styles.send}>
                <img src="/assets/attach.png" alt="" className={styles.sendImage} />
                <input type="file" style={{ display: 'none' }} id='file' onChange={e => setImg(e.target.files?.[0] || null)} />
                <label htmlFor="file">
                    <img src="/assets/img.png" alt="" className={styles.sendImage} />
                </label>
                <button onClick={handleSend} className={styles.sendButton}>Send</button>
            </div>
        </div>
    )
}

export default Input;
