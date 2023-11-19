import React from 'react'
import Sidebar from './sidebar'
import Chat from './chat'
import styles from "./messages.module.css"
import Message from './message'

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