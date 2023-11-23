import React from 'react'
import Sidebar from './Sidebar'
import Chat from './Chat'
import styles from "./messages.module.css"
import Message from './Message'

const MessagesUI = () => {
    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}

export default MessagesUI;