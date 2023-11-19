import React from 'react'
import styles from "./messages.module.css"

const Message = () => {
  return (
    <div className={styles.message}>
      <div className={styles.messageInfo}>
        <img src="/assets/default-profile-picture.jpg" alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        <span>Just now</span>
      </div>
      <div className={styles.messageContent}>
        <img src="/assets/default-profile-picture.jpg" alt="" className={styles.userProfPic2} />
        <p className={styles.paragraph}>Hello!</p>
      </div>
    </div>
  )
}

export default Message