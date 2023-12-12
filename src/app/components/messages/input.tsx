import React, { useContext, useState } from 'react'
import styles from "./messages.module.css"
import { useUser } from '../../contexts/AuthProvider'
import { ChatContext } from '../../contexts/ChatContextProvider'
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { v4 as uuid } from "uuid"
import { db, storage } from "../../firebase"
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

        try {
            const chatDocRef = doc(db, 'chats', data.chatId);
            const chatDoc = await getDoc(chatDocRef);

            if (!chatDoc.exists()) {
                // Create the chat document if it doesn't exist
                await setDoc(chatDocRef, { messages: [] });
            }

            if (img) {
                // Upload image and update document
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
                            await updateDoc(chatDocRef, {
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
                // Update document with text message
                await updateDoc(chatDocRef, {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId,
                        date: Timestamp.now(),
                    }),
                });
            }

            // Update userChats documents for both users
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
        } catch (error) {
            console.error('Error handling send:', error);
        }
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.textInput}>
            <input type="text" placeholder='Add a message' value={text} className={styles.typeInput} disabled={!data.user.uid} onChange={e => setText(e.target.value)} onKeyDown={handleKeyPress} />
            <div className={styles.send}>
                <img src="/assets/attach.png" alt="" className={styles.sendImage} />
                <input type="file" style={{ display: 'none' }} id='file' onChange={e => setImg(e.target.files?.[0] || null)} />
                <label htmlFor="file">
                    <img src="/assets/img.png" alt="" className={styles.sendImage} />
                </label>
                <button onClick={handleSend} disabled={!data.user.uid} className={styles.sendButton}>Send</button>
            </div>
        </div>
    )
}

export default Input;
