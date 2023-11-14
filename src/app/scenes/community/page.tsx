import React, { useEffect, useState } from 'react';
import { SelectedPage } from '@/app/shared/types';
import { universities, cities, educationLevels } from '@/app/shared/options';
import { collection, getDocs } from 'firebase/firestore';
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
    profilePicture: string;
};

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
};

const Community = ({ setSelectedPage }: Props) => {

    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
        if (args[0]?.includes('Encountered two children with the same key') || args[0]?.includes('Extra attributes from the server')) {
            return;
        }
        originalConsoleError.apply(console, args);
    };

    const [users, setUsers] = useState<User[]>([]);
    const [visibleUsers, setVisibleUsers] = useState<User[]>([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');
    const [selectedEducationLevel, setSelectedEducationLevel] = useState('');
    const cardsPerPage = 6;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);

                const userData: User[] = [];
                const imageUrlPromises: Promise<string>[] = []; // Specify the Promise type

                usersSnapshot.forEach((doc) => {
                    const user = { id: doc.id, ...doc.data() } as User;
                    userData.push(user);

                    if (user.profilePictureURL) {
                        const storageRef = ref(storage, user.profilePictureURL);
                        imageUrlPromises.push(getDownloadURL(storageRef));
                    } else {
                        imageUrlPromises.push(Promise.resolve('/assets/default-profile-picture.jpg'));
                    }
                });

                // Wait for all promises to resolve
                const imageUrls = await Promise.all(imageUrlPromises);

                // Update user objects with the correct URLs
                const usersWithImageUrls = userData.map((user, index) => ({
                    ...user,
                    profilePictureURL: user.profilePicture ? imageUrls[index] : '/assets/default-profile-picture.jpg',
                }));

                setUsers(usersWithImageUrls);
                console.log(usersWithImageUrls);
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
        const filteredUsers = users.filter((user) =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            && (selectedUniversity ? user.university.toLowerCase() === selectedUniversity.toLowerCase() : true)
            && (selectedCity ? user.city.toLowerCase() === selectedCity.toLowerCase() : true)
            && (selectedMajor ? user.major.toLowerCase() === selectedMajor.toLowerCase() : true)
            && (selectedEducationLevel ? user.educationLevel.toLowerCase() === selectedEducationLevel.toLowerCase() : true)
        );
        setVisibleUsers(filteredUsers);
    };

    const handleClearFilters = () => {
        setSelectedCity('');
        setSelectedUniversity('');
        setSelectedMajor('');
        setSelectedEducationLevel('');
        setSearchQuery('');

        setSelectedCity('');
        setSelectedUniversity('');
        setSelectedMajor('');
        setSelectedEducationLevel('');

        setVisibleUsers(users.slice(0, cardsPerPage));
    };

    return (
        <section id='community'>
            <div className='bg-[#fbbb5b]'>
                <div className='mx-auto min-h-full w-5/6 py-20 mt-24'>
                    <div className='bg-orange-400 text-black p-4 rounded-xl mt-20'>
                        <h2 className='text-2xl font-semibold mb-4'>Community</h2>

                        {/* Search Bar */}
                        <div className='mb-4 flex items-center'>
                            <input
                                type='text'
                                placeholder='Search...'
                                className='w-96 py-2 border border-gray-300 rounded-md mr-2'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md'
                                onClick={handleSearch}
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <button
                                className='bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md ml-2'
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>

                        {/* Filter Options */}
                        <div className='mb-4 flex items-center'>
                            <div className='mr-6'>
                                <label className='block text-sm font-medium text-black'>City:</label>
                                <select
                                    className='w-80 py-2 border border-gray-300 rounded-md'
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    <option value=''>Select City</option>
                                    {cities.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='mr-6'>
                                <label className='block text-sm font-medium text-black'>University:</label>
                                <select
                                    className='w-80 py-2 border border-gray-300 rounded-md'
                                    value={selectedUniversity}
                                    onChange={(e) => setSelectedUniversity(e.target.value)}
                                >
                                    <option value=''>Select University</option>
                                    {universities.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mr-6'>
                                <label className='block text-sm font-medium text-black'>Major:</label>
                                <input
                                    type='text'
                                    placeholder='Filter by major...'
                                    className='w-80 py-2 border border-gray-300 rounded-md'
                                    value={selectedMajor}
                                    onChange={(e) => setSelectedMajor(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-black'>Education Level:</label>
                                <select
                                    className='w-80 py-2 border border-gray-300 rounded-md'
                                    value={selectedEducationLevel}
                                    onChange={(e) => setSelectedEducationLevel(e.target.value)}
                                >
                                    <option value=''>Select Education Level</option>
                                    {educationLevels.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* User Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {visibleUsers.map((user) => (

                                <div key={user.id} className='bg-white rounded-lg p-5'>
                                    <img
                                        src={user.profilePicture ? user.profilePicture : "/assets/default-profile-picture.jpg"}
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
