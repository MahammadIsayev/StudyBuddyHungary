import React from 'react'
import Sidebar from '../src/app/components/messages/sidebar'
import Chat from '../src/app/components/messages/chat'
import styles from "../src/app/components/messages/messages.module.css"

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