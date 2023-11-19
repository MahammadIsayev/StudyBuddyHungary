import React, { useEffect, useState } from 'react';
import styles from './messages.module.css';
import { auth, db } from '../src/app/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = {};

const Navbar = (props: Props) => {
    const [userProfile, setUserProfile] = useState<{ fullName: string | null, profilePicture: string | null }>({
        fullName: null,
        profilePicture: null,
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Check if the user has a Firestore document
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    // Use Firestore profile data if available
                    const firestoreProfile = userDocSnapshot.data();
                    setUserProfile({
                        fullName: firestoreProfile?.fullName || null,
                        profilePicture: firestoreProfile?.profilePicture || user.photoURL || null,
                    });
                } else {
                    // Fallback to Firebase Authentication displayName
                    setUserProfile({
                        fullName: user.displayName || null,
                        profilePicture: user.photoURL || null,
                    });
                }
            } else {
                setUserProfile({ fullName: null, profilePicture: null });
            }
        });

        return () => unsubscribe();
    }, []);

    const { fullName, profilePicture } = userProfile;

    return (
        <div className={styles.navbar}>
            <span className={styles.logo}>Direct Messages</span>
            <div className={styles.user}>
                <img
                    src={profilePicture || "/assets/default-profile-picture.jpg"}
                    alt=""
                    className={styles.img}
                />
                <span>{fullName || 'Anonymous'}</span>
            </div>
        </div>
    );
};

export default Navbar;
