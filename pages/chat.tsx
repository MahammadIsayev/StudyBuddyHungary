import React from 'react'
import styles from "./messages.module.css"
import Messages from './messages'
import Input from './input'

type Props = {}

const Chat = (props: Props) => {
    return (
        <div className={styles.chat}>
            <div className={styles.chatInfo}>
                <span>Rauf</span>
            </div>
            <Messages />
            <Input />
        </div>
    )
}

export default Chat