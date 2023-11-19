import React from 'react'
import styles from "./messages.module.css"

const Chats = () => {
    return (
        <div className={styles.chats}>
            <div className={styles.userChat}>
                <img src="/assets/default-profile-picture.jpg" alt="" className={styles.userImage} />
                <div className={styles.userChatInfo}>
                    <span className={styles.userName}>Kamil</span>
                    <p className={styles.defaultText}>Hello!</p>
                </div>
            </div>
            <div className={styles.userChat}>
                <img src="/assets/default-profile-picture.jpg" alt="" className={styles.userImage} />
                <div className={styles.userChatInfo}>
                    <span className={styles.userName}>Akbar</span>
                    <p className={styles.defaultText}>Hello!</p>
                </div>
            </div>
            <div className={styles.userChat}>
                <img src="/assets/default-profile-picture.jpg" alt="" className={styles.userImage} />
                <div className={styles.userChatInfo}>
                    <span className={styles.userName}>Ali</span>
                    <p className={styles.defaultText}>Hello!</p>
                </div>
            </div>
            <div className={styles.userChat}>
                <img src="/assets/default-profile-picture.jpg" alt="" className={styles.userImage} />
                <div className={styles.userChatInfo}>
                    <span className={styles.userName}>Candan</span>
                    <p className={styles.defaultText}>Hello!</p>
                </div>
            </div>
        </div >
    )
}

export default Chats