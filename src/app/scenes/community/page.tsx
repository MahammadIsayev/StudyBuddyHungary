import React, { useEffect, useState } from 'react';
import { SelectedPage } from '@/app/shared/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

type User = {
    id: string,
    fullName: string;
    educationLevel: string;
    university: string;
    major: string;
    // Add more user properties here
};

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

const Community = ({ setSelectedPage }: Props) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Fetch user data from Firestore when the component mounts
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);

                const userData: User[] = [];
                usersSnapshot.forEach((doc) => {
                    userData.push({ id: doc.id, ...doc.data() } as User);
                });

                setUsers(userData);
                // console.log(userData)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <section id='community'>
            <div className='bg-red-300'>
                <div className='mx-auto min-h-full w-5/6 py-20 mt-24'>
                    <div className='bg-black text-white p-4'>
                        <h2 className='text-2xl font-semibold mb-4'>Community</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {users.map((user) => (
                                <div key={user.id} className='bg-white rounded-lg p-4'>
                                    <img /*src={user.profilePic}*/ alt={`${user.fullName}`} className='w-20 h-20 rounded-full mx-auto mb-2' />
                                    <h3 className='text-xl font-semibold text-black'>{user.fullName}</h3>
                                    <p className='text-sm text-gray-600'>University: {user.university}</p>
                                    <p className='text-sm text-gray-600'>Major: {user.major}</p>
                                    <p className='text-sm text-gray-600'>Education Level: {user.educationLevel}</p>
                                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full mt-4'>
                                        Message
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Community;
