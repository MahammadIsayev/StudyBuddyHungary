import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { SelectedPage } from '@/app/shared/types';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { User } from 'firebase/auth';
import { useUser } from '../../contexts/AuthProvider';
import { PencilSquare } from 'react-bootstrap-icons';
import PostModal from '@/app/modals/threadmodal';
import UserModal from '@/app/modals/usermodal';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

type PostUser = {
    id: string;
    fullName: string;
    city: string;
    educationLevel: string;
    university: string;
    major: string;
    profilePictureURL: string;
};

type Post = {
    authorId: string;
    id: string;
    fullName: string;
    postText: string;
    title: string;
    category: string;
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
    const [category, setCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
    const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({});
    const [userColors, setUserColors] = useState<{ [userId: string]: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserForModal, setSelectedUserForModal] = useState<PostUser | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const categories = ["General", "Academic Discussion", "University-specific", "Career Development", "Study Meetups"];

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
                    authorId: doc.data().author.id,
                    category: doc.data().category
                }));
                posts.forEach(post => {
                    if (post.authorId === auth.currentUser?.uid) {
                        post.fullName = fullName;
                    }
                });
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
                        const commentAuthorId = commentDoc.data().authorId;

                        const updatedFullName = (commentAuthorId === auth.currentUser?.uid) ? fullName : commentDoc.data().fullName;
                        postComments.push({
                            id: commentDoc.id,
                            authorId: commentDoc.data().authorId,
                            fullName: updatedFullName,
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

        // getComments();

        getComments();
    }, [commentCollectionRef]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === selectedCategory ? null : category);
    };

    const filteredPosts = selectedCategory
        ? postLists.filter((post) => post.category === selectedCategory)
        : postLists;

    const createPost = async () => {
        try {
            if (auth.currentUser) {
                const authorId = auth.currentUser.uid;

                if (fullName !== null) {
                    await addDoc(postCollectionRef, {
                        title,
                        postText,
                        author: {
                            fullName,
                            id: authorId,
                        },
                        category
                    });
                    setTitle('');
                    setPostText('');
                    setCategory('');
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

        const excludeColors = ['#FFFFFF', '#ECF4FD']; 

        do {
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
        } while (excludeColors.includes(color));

        return color;
    };

    const getColorForUser = (userId: string) => {
        if (userColors[userId]) {
            return userColors[userId];
        }

        const newColor = getRandomColor();
        setUserColors((prevColors) => ({ ...prevColors, [userId]: newColor }));
        return newColor;
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const createPostAndCloseModal = () => {
        createPost();
        closeModal();
    };

    const openUserModal = async (authorId: string) => {
        try {
            const userDocRef = doc(db, 'users', authorId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data() as PostUser;
                setSelectedUserForModal(userData);
                setIsUserModalOpen(true);
            } else {
                console.error('User document does not exist for authorId:', authorId);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
    };

    return (
        <section id="forum" className="py-8 bg-blue-50">
            <h1 className="text-3xl font-semibold mb-6 text-center tracking-wide mt-24">Active Forum Threads</h1>
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                    <label className="block mb-2 text-gray-700">Filter by Category:</label>
                    <select
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        value={selectedCategory || ''}
                        className="p-2 border rounded-md"
                    >
                        <option value="">All</option>
                        {categories.map((category: string) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button
                onClick={openModal}
                className={`fixed bottom-4 right-4 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300`}
            >
                <PencilSquare size={20} />
            </button>
            {/* PostModal component */}
            <PostModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                createPost={createPostAndCloseModal}
                title={title}
                setTitle={setTitle}
                postText={postText}
                setPostText={setPostText}
                category={category}
                setCategory={setCategory}
            />
            <div className='flex flex-wrap justify-between mt-2 max-w-screen-xl mx-auto'>
                {filteredPosts.map((post) => (

                    <div key={post.id} className={`bg-white rounded-md shadow-xl p-6 mt-4 w-full`}>
                        <div className="mb-4 flex justify-between items-center">
                            <div className="title">
                                <h1 className="text-2xl font-semibold text-blue-500">{post.title}</h1>
                                <p className="text-gray-500">Category: {post.category}</p>
                            </div>
                            {post.authorId === auth.currentUser?.uid &&
                                <button onClick={() => deletePost(post.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>}
                        </div>
                        <div className="postTextContainer mb-4 text-gray-800">
                            {post.postText.split('\n').map((paragraph, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <br />}
                                    {paragraph}
                                </React.Fragment>))}
                        </div>
                        <UserModal
                            isOpen={isUserModalOpen}
                            closeModal={closeUserModal}
                            user={selectedUserForModal}
                        />
                        <h3
                            className="text-blue-500 cursor-pointer"
                            onClick={() => openUserModal(post.authorId)}
                        >
                            @{post.fullName}
                        </h3>
                        <div className="flex items-center">
                            <textarea
                                onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => handleKeyPress(e, post.id)}
                                value={commentTexts[post.id] || ''}
                                style={{ resize: 'none', maxHeight: '150px' }}
                                className='mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 bg-gray-100 text-gray-800'
                                cols={40}
                                rows={2}
                                placeholder='Add a comment'
                                maxLength={1000}
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
                                    <strong style={{ color: getColorForUser(comment.authorId) }}>{comment.fullName}: </strong>
                                    {comment.commentText.split('\n').map((paragraph, index) => (
                                        <React.Fragment key={index}>
                                            {index > 0 && <br />}
                                            {paragraph}
                                        </React.Fragment>))}
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
