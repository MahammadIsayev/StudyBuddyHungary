import React from 'react'
import styles from "./messages.module.css"
import Navbar from './navbar'
import Search from './search'
import Chats from './chats'

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