import React, { useContext, useEffect, useRef } from 'react'
import styles from "./messages.module.css"
import { AuthProvider, useUser } from './context/AuthProvider';
import { ChatContext } from './context/ChatContextProvider';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';

const Message = ({ message }: any) => {
  // console.log(message);
  const currentUser = useUser()
  const { data } = useContext(ChatContext);
  const ref = useRef<HTMLDivElement>(null);
  const isCurrentUser = message.senderId === currentUser?.uid;
  const messageDate = (message.date as Timestamp).toDate();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  })
  // console.log(data);
  // console.log(isCurrentUser);



  return (
    <div
      ref={ref}
      className={classNames(styles.message, {
        [styles.messageOwner]: isCurrentUser,
        [styles.owner]: isCurrentUser,
      })}
    > {/*in css it is "message owner" (conditional css)*/}
      <div className={styles.messageInfo}>
        {/* <img
          src={message.senderId === currentUser?.uid ? currentUser?.photoURL : data.user.photoURL}
          alt=""
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        /> */}
        <span className={styles.messageDate}>{messageDate.toLocaleString()}</span>
      </div>
      <div className={styles.messageContent}>
        {message.img && <img src={message.img} alt="" className={styles.userProfPic2} />}
        <p className={styles.paragraph}>{message.text}</p>
      </div>
    </div>
  )
}

export default Message