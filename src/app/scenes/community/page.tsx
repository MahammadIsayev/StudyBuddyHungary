import React, { useEffect, useState } from 'react';
import { SelectedPage } from '@/app/shared/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';

type User = {
    id: string;
    fullName: string;
    city: string;
    educationLevel: string;
    university: string;
    major: string;
    profilePictureURL: string;
};

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

const Community = ({ setSelectedPage }: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const [visibleUsers, setVisibleUsers] = useState<User[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedEducationLevel, setSelectedEducationLevel] = useState('');
    const cardsPerPage = 6;

    const getImageUrl = async (profilePictureURL: string | undefined): Promise<string> => {
        if (profilePictureURL) {
            try {
                return await getDownloadURL(ref(storage, profilePictureURL));
            } catch (error) {
                console.error('Error getting download URL:', error);
            }
        }

        return '/assets/default-profile-picture.jpg';
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);

                const userData: User[] = [];
                usersSnapshot.forEach((doc) => {
                    userData.push({ id: doc.id, ...doc.data() } as User);
                });

                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const startIndex = currentIndex * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        setVisibleUsers(users.slice(startIndex, endIndex));
    }, [currentIndex, users]);

    const handleSlideLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSlideRight = () => {
        if (currentIndex < Math.ceil(users.length / cardsPerPage) - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSearch = () => {
        // Implement your search logic here based on searchQuery, selectedUniversity, selectedCity, selectedMajor, and selectedEducationLevel
        // You may use Array.filter to filter the users based on the criteria.
        const filteredUsers = users.filter((user) =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            && (selectedUniversity ? user.university.toLowerCase() === selectedUniversity.toLowerCase() : true)
            && (selectedCity ? user.city.toLowerCase() === selectedCity.toLowerCase() : true)
            && (selectedMajor ? user.major.toLowerCase() === selectedMajor.toLowerCase() : true)
            && (selectedEducationLevel ? user.educationLevel.toLowerCase() === selectedEducationLevel.toLowerCase() : true)
        );
        setVisibleUsers(filteredUsers);
    };

    return (
        <section id='community'>
            <div className='bg-[#fbbb5b]'>
                <div className='mx-auto min-h-full w-5/6 py-20 mt-24'>
                    <div className='bg-orange-400 text-white p-4 rounded-xl mt-20'>
                        <h2 className='text-2xl font-semibold mb-4'>Community</h2>

                        {/* Search Bar */}
                        <div className='mb-4 flex items-center'>
                            <input
                                type='text'
                                placeholder='Search by name...'
                                className='px-3 py-2 border border-gray-300 rounded-md mr-2'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md'
                                onClick={handleSearch}
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>

                        {/* Filter Options */}
                        <div className='mb-4 grid grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>University:</label>
                                <input
                                    type='text'
                                    placeholder='Filter by university...'
                                    className='px-3 py-2 border border-gray-300 rounded-md'
                                    value={selectedUniversity}
                                    onChange={(e) => setSelectedUniversity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>City:</label>
                                <input
                                    type='text'
                                    placeholder='Filter by city...'
                                    className='px-3 py-2 border border-gray-300 rounded-md'
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Major:</label>
                                <input
                                    type='text'
                                    placeholder='Filter by major...'
                                    className='px-3 py-2 border border-gray-300 rounded-md'
                                    value={selectedMajor}
                                    onChange={(e) => setSelectedMajor(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Education Level:</label>
                                <input
                                    type='text'
                                    placeholder='Filter by education level...'
                                    className='px-3 py-2 border border-gray-300 rounded-md'
                                    value={selectedEducationLevel}
                                    onChange={(e) => setSelectedEducationLevel(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* User Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {visibleUsers.map((user) => (
                                <div key={user.id} className='bg-white rounded-lg p-5'>
                                    <img
                                        src={user.profilePictureURL || '/assets/default-profile-picture.jpg'}
                                        alt={`${user.fullName}`}
                                        className='w-24 h-24 rounded-full mx-auto mb-2'
                                    />
                                    <h3 className='text-xl font-semibold text-black'>{user.fullName}</h3>
                                    <p className='text-sm text-gray-600'>City: {user.city}</p>
                                    <p className='text-sm text-gray-600'>University: {user.university}</p>
                                    <p className='text-sm text-gray-600'>Major: {user.major}</p>
                                    <p className='text-sm text-gray-600'>Education Level: {user.educationLevel}</p>
                                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full mt-4'>
                                        Message
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Buttons */}
                        <div className='mt-4 text-center'>
                            {currentIndex > 0 && (
                                <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full mr-2' onClick={handleSlideLeft}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            )}
                            {currentIndex < Math.ceil(users.length / cardsPerPage) - 1 && (
                                <button className='bg-blue-500 hover-bg-blue-700 text-white font-semibold py-2 px-4 rounded-full' onClick={handleSlideRight}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Community;
