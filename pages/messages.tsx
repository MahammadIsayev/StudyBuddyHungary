import React from 'react'
import styles from "./messages.module.css"
import Message from './Message'

type Props = {}

const Messages = (props: Props) => {
    return (
        <div className={styles.messagesBox}>
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
        </div>
    )
}

export default Messages