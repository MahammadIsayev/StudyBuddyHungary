import React, { useEffect, useState } from 'react';
import styles from './messages.module.css';
import { auth, db } from '../../firebase';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

type Props = {};


const Search = (props: Props) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentUserDetails, setCurrentUserDetails] = useState<any | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null)
    const currentUser: User | null = auth.currentUser;

    useEffect(() => {
        const fetchCurrentUserDetails = async () => {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userDetails = userDoc.data();
                    setCurrentUserDetails(userDoc.data());
                    // console.log('Current User Details:', userDetails);
                }
            }
        };

        fetchCurrentUserDetails();
    }, [currentUser]);

    const handleSearch = async () => {
        try {
            const usersCollection = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollection);

            const results: any = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (searchQuery.trim() !== '' && userData.fullName.toLowerCase().includes(searchQuery.toLowerCase())) {
                    results.push({ ...userData, uid: doc.id });
                }
            });

            setSearchResults(results);
            setSearchQuery('');
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

    const handleSelect = async (selectedUser: any) => {
        if (currentUser && selectedUser) {
            const selectedUserUid = selectedUser?.uid;

            if (!selectedUserUid) {
                console.error('UID not found in selectedUser:', selectedUser);
                return;
            }


            const combinedID =
                currentUser.uid > selectedUserUid
                    ? currentUser.uid + selectedUserUid
                    : selectedUserUid + currentUser.uid;


            try {
                const chatDocRef = doc(db, 'chats', combinedID);
                const chatDoc = await getDoc(chatDocRef);


                if (!chatDoc.exists()) {
                
                    await setDoc(chatDocRef, { messages: [] });

                    await updateDoc(doc(db, 'userChats', currentUser.uid), {
                        [combinedID]: {
                            chatId: combinedID,
                            userInfo: {
                                uid: selectedUserUid,
                                fullName: selectedUser?.fullName,
                                photoURL: selectedUser?.profilePictureURL,
                            },
                            date: serverTimestamp(),
                        },
                    });

                    await updateDoc(doc(db, 'userChats', selectedUserUid), {
                        [combinedID]: {
                            chatId: combinedID,
                            userInfo: {
                                uid: currentUser.uid,
                                fullName: currentUserDetails?.fullName,
                                photoURL: currentUserDetails?.profilePictureURL,
                            },
                            date: serverTimestamp(),
                        },
                    });


                    setSearchResults((prevResults) =>
                        prevResults.filter((user) => user.uid !== selectedUser.uid)
                    );

                    setSearchQuery('');
                    setSelectedUser(selectedUser);

                    console.log('Chat created successfully!');
                } else {
                    console.log('Chat already exists:', chatDoc.data());
                }
            } catch (error) {
                console.error('Error handling selection:', error);
            }
        }

    };

    return (
        <div className={styles.search}>
            <div className={styles.searchForm}>
                <input
                    className={styles.searchmessageuser}
                    type="text"
                    placeholder="Find a user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <div className={styles.searchIcon} onClick={handleSearch}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`${styles.icon} w-6 h-6`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>
            </div>
            <div>
                {/* Display search results */}
                {searchResults.map((user) => (
                    <div key={user.uid} className={styles.userChat} onClick={() => handleSelect(user)}>
                        <img src={user.profilePictureURL || "/assets/default-profile-picture.jpg"} alt="" className={styles.userImage} />
                        <div className={styles.userChatInfo}>
                            <span className={styles.userName}>{user.fullName}</span>
                            <p className={styles.defaultText}>{user.defaultText}</p>
                        </div>
                    </div>
                ))}
            </div>
            {searchResults.length > 0 && <hr />}
        </div>
    );
};

export default Search;
