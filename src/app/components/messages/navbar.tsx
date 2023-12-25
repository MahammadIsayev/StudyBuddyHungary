import React, { useEffect, useState } from 'react';
import styles from './messages.module.css';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = {};

const Navbar = (props: Props) => {
    const [userProfile, setUserProfile] = useState<{ fullName: string | null, profilePictureURL: string | null }>({
        fullName: null,
        profilePictureURL: null,
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
               
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    
                    const firestoreProfile = userDocSnapshot.data();
                    setUserProfile({
                        fullName: firestoreProfile?.fullName || null,
                        profilePictureURL: firestoreProfile?.profilePictureURL || user.photoURL || null,
                    });
                } else {
                    
                    setUserProfile({
                        fullName: user.displayName || null,
                        profilePictureURL: user.photoURL || null,
                    });
                }
            } else {
                setUserProfile({ fullName: null, profilePictureURL: null });
            }
        });

        return () => unsubscribe();
    }, []);

    const { fullName, profilePictureURL } = userProfile;

    return (
        <div className={styles.navbar}>
            <div className={styles.user}>
                <img
                    src={profilePictureURL || "/assets/default-profile-picture.jpg"}
                    alt=""
                    className={styles.img}
                />

            </div>
            <span className={styles.logo}>Direct Messages</span>

        </div>
    );
};

export default Navbar;
