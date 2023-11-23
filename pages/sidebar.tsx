import React from 'react'
import styles from "./messages.module.css"
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'

type Props = {}

const Sidebar = (props: Props) => {
    return (
        <div className={styles.sidebar}>
            <Navbar />
            <Search />
            <Chats />
        </div>
    )
}

export default Sidebar