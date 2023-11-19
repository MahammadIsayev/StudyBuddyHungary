import React from 'react'
import styles from "./messages.module.css"

type Props = {}

const Input = (props: Props) => {
    return (
        <div className={styles.textInput}>
            <input type="text" placeholder='Type something...' className={styles.typeInput} />
            <div className={styles.send}>
                <img src="/assets/attach.png" alt="" className={styles.sendImage} />
                <input type="file" style={{ display: 'none' }} id='file' />
                <label htmlFor="file">
                    <img src="/assets/img.png" alt="" className={styles.sendImage} />
                </label>
                <button className={styles.sendButton}>Send</button>
            </div>
        </div>
    )
}

export default Input;
