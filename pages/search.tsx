import React, { useState } from 'react';
import styles from './messages.module.css';
import { db } from '../src/app/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

type Props = {};

const Search = (props: Props) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollection);

            const results: any = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (searchQuery.trim() !== '' && userData.fullName.toLowerCase().includes(searchQuery.toLowerCase())) {
                    results.push(userData);
                }
            });

            setSearchResults(results);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    // const handleSelect = async () => {
    //     const combinedID = 
    //     const res = await getDocs(db, "chats", combinedID)
    // }

    return (
        <div className={styles.search}>
            <div className={styles.searchForm}>
                <input
                    className={styles.searchmessageuser}
                    type="text"
                    placeholder="Find a user"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </div>
            <div>
                {/* Display search results */}
                {searchResults.map((user) => (
                    <div key={user.uid} className={styles.userChat} >
                        <img src={user.profilePicture || "/assets/default-profile-picture.jpg"} alt="" className={styles.userImage} />
                        <div className={styles.userChatInfo}>
                            <span className={styles.userName}>{user.fullName}</span>
                            <p className={styles.defaultText}>{user.defaultText}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
