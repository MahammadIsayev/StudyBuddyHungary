import React, { useState, useEffect } from 'react';
import { SelectedPage } from '@/app/shared/types';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { User } from 'firebase/auth';
import { useUser } from '../../../../pages/context/AuthProvider';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

const Forum = ({ setSelectedPage }: Props) => {
    const [title, setTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [fullName, setFullName] = useState('');
    const [postLists, setPostsList] = useState([])

    const user: User | null = useUser();

    const postCollectionRef = collection(db, 'posts');

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUserData = async () => {
            try {
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData && userData.fullName) {
                            setFullName(userData.fullName);
                        } else {
                            console.error('User data or fullName is missing:', userData);
                        }
                    } else {
                        console.error('User document does not exist for UID:', user.uid);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const getPosts = async () => {
            const data = await getDocs(postCollectionRef)
            console.log(data)
        }

        fetchUserData();
        getPosts();
    }, [user]);

    useEffect(() => {

        const getPosts = async () => {
            const data = await getDocs(postCollectionRef)
            console.log(data)
        }

        getPosts();
    });

    const createPost = async () => {
        try {
            // Check if fullName is not null before creating the post
            if (fullName !== null) {
                await addDoc(postCollectionRef, {
                    title,
                    postText,
                    author: {
                        fullName,
                        id: auth.currentUser?.uid,
                    },
                });
            } else {
                console.error('Full name is null!');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <section id="forum">
            <div className="bg-white">
                <div className="forumContainer">
                    <h1>Create a post</h1>
                    <div className="inputGp">
                        <label htmlFor="">Title</label>
                        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="inputGp">
                        <label htmlFor="">Post</label>
                        <textarea name="" placeholder="Post" onChange={(e) => setPostText(e.target.value)} />
                    </div>
                    <button onClick={createPost}>Post</button>
                </div>
            </div>
        </section>
    );
};

export default Forum;
