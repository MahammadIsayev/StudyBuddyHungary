import React, { useState, useEffect, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { SelectedPage } from '@/app/shared/types';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { User } from 'firebase/auth';
import { useUser } from '../../../../pages/context/AuthProvider';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

type Post = {
    authorId: string;
    id: string;
    fullName: string;
    postText: string;
    title: string;
};

type Comment = {
    authorId: string;
    fullName: string;
    commentText: string;
    id: string;
    timestamp: Timestamp;
};

const Forum = ({ setSelectedPage }: Props) => {
    const [title, setTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [fullName, setFullName] = useState('');
    const [postLists, setPostsList] = useState<Post[]>([]);
    const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
    const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({});
    const [userColors, setUserColors] = useState<{ [userId: string]: string }>({});


    const user: User | null = useUser();

    const postCollectionRef = collection(db, 'posts');
    const commentCollectionRef = collection(db, 'comments');

    useEffect(() => {

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

        fetchUserData();
    }, [user]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await getDocs(postCollectionRef);
                const posts: Post[] = data.docs.map((doc) => ({
                    title: doc.data().title,
                    id: doc.id,
                    postText: doc.data().postText,
                    fullName: doc.data().author.fullName,
                    authorId: doc.data().author.id
                }));
                setPostsList(posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        getPosts();
    }, [postCollectionRef]);

    useEffect(() => {
        const getComments = async () => {
            try {
                const commentsData: { [postId: string]: Comment[] } = {};

                await Promise.all(postLists.map(async (post) => {
                    const postComments: Comment[] = [];

                    const commentQuerySnapshot = await getDocs(query(commentCollectionRef, where('postId', '==', post.id)));

                    commentQuerySnapshot.forEach((commentDoc) => {
                        postComments.push({
                            id: commentDoc.id,
                            authorId: commentDoc.data().authorId,
                            fullName: commentDoc.data().fullName,
                            commentText: commentDoc.data().commentText,
                            timestamp: commentDoc.data().timestamp,
                        });
                    });

                    commentsData[post.id] = postComments;
                }));

                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        getComments();

        getComments();
    }, [commentCollectionRef]);

    const createPost = async () => {
        try {
            //  if user is authenticated
            if (auth.currentUser) {
                const authorId = auth.currentUser.uid;

                //  if fullName is not null before creating the post
                if (fullName !== null) {
                    await addDoc(postCollectionRef, {
                        title,
                        postText,
                        author: {
                            fullName,
                            id: authorId,
                        },
                    });
                    setTitle('');
                    setPostText('');
                } else {
                    console.error('Full name is null!');
                }
            } else {
                console.error('User is not authenticated.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const createComment = async (postId: string) => {
        try {
            if (auth.currentUser) {
                const authorId = auth.currentUser.uid;

                if (fullName !== null) {
                    await addDoc(commentCollectionRef, {
                        postId,
                        authorId,
                        fullName,
                        commentText: commentTexts[postId] || '',
                        timestamp: Timestamp.now()
                    });

                    setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
                } else {
                    console.error('Full name is null!');
                }
            } else {
                console.error('User is not authenticated.');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const deletePost = async (id: string) => {
        try {
            const postDocRef = doc(db, 'posts', id);
            await deleteDoc(postDocRef);

            setPostsList((prevPosts) => prevPosts.filter((post) => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent, postId: string) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            createComment(postId);
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';

        // Define the colors to exclude
        const excludeColors = ['#FFFFFF', '#ECF4FD'];  // Add more colors as needed

        // Generate a new color until a non-excluded color is found
        do {
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
        } while (excludeColors.includes(color));

        return color;
    };

    const getColorForUser = (userId: string) => {
        // Check if the color is already assigned for the user
        if (userColors[userId]) {
            return userColors[userId];
        }

        // If not, generate a random color and store it
        const newColor = getRandomColor();
        setUserColors((prevColors) => ({ ...prevColors, [userId]: newColor }));
        return newColor;
    };

    return (
        <section id="forum" className="py-8 bg-blue-50">
            <div className="bg-white rounded-md shadow-2xl p-20 max-w-2xl mx-auto mt-24">
                <h1 className="text-3xl font-semibold mb-6">Forum</h1>
                <h2 className="text-xl font-semibold mb-6">Create a post</h2>
                <div className="inputGp mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Enter a descriptive title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="inputGp mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="post">
                        Post
                    </label>
                    <textarea
                        id="post"
                        placeholder="Share your thoughts, ask questions, or provide insights..."
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                        style={{ resize: 'none' }}
                    ></textarea>
                </div>
                <button
                    onClick={createPost}
                    className="float-right bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 "
                >
                    Share
                </button>
            </div>
            <div className='flex flex-wrap justify-between mt-2 max-w-screen-xl mx-auto'>
                {postLists.map((post) => (

                    <div key={post.id} className={`bg-white rounded-md shadow-md p-6 mt-2 w-full`}>
                        <div className="mb-4 flex justify-between items-center">
                            <div className="title">
                                <h1 className="text-2xl font-semibold">{post.title}</h1>
                            </div>
                            {post.authorId === auth.currentUser?.uid &&
                                <button onClick={() => deletePost(post.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path stroke-linecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>}
                        </div>
                        <div className="postTextContainer mb-4">{post.postText}</div>
                        <h3 className="text-blue-500">@{post.fullName}</h3>
                        <div className="flex items-center">
                            <textarea
                                onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => handleKeyPress(e, post.id)}
                                value={commentTexts[post.id] || ''}
                                style={{ resize: 'none' }}
                                className='mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 bg-gray-100 text-gray-800'
                                cols={40}
                                rows={2}
                                placeholder='Add a comment'
                            ></textarea>
                            <button
                                onClick={() => createComment(post.id)}
                                className='bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 ml-2'
                            >
                                Comment
                            </button>
                        </div>
                        {/* Display comments */}
                        {comments[post.id] && comments[post.id]
                            .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis())
                            .map((comment) => (
                                <div key={comment.id} className="bg-gray-100 p-2 mt-2 rounded-md">
                                    <strong style={{ color: getColorForUser(comment.authorId) }}>{comment.fullName}:</strong> {comment.commentText}
                                    <p className="text-gray-500">{comment.timestamp?.toDate().toLocaleString()}</p>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </section >
    );
};

export default Forum;
