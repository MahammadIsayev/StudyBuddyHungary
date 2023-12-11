import React, { useEffect, useState } from 'react';
import { SelectedPage } from '@/app/shared/types';
import { universities, cities, educationLevels } from '@/app/shared/options';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Search, ChevronLeft, ChevronRight, X } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';

type User = {
    id: string;
    fullName: string;
    city: string;
    educationLevel: string;
    university: string;
    major: string;
    profilePictureURL: string;
    // profilePicture: string;
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

                // all promises to resolve
                const imageUrls = await Promise.all(imageUrlPromises);

                // Update user objects with the correct URLs
                const usersWithImageUrls = userData.map((user, index) => ({
                    ...user,
                    profilePictureURL: user.profilePictureURL ? imageUrls[index] : '/assets/default-profile-picture.jpg',
                }));

                setUsers(usersWithImageUrls);
                // console.log(usersWithImageUrls);
                const startIndex = currentIndex * cardsPerPage;
                const endIndex = startIndex + cardsPerPage;
                setVisibleUsers(usersWithImageUrls.slice(startIndex, endIndex));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
        const startIndex = currentIndex * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;

        const filteredUsers = users.filter((user) =>
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
            && (selectedUniversity ? user.university.toLowerCase() === selectedUniversity.toLowerCase() : true)
            && (selectedCity ? user.city.toLowerCase() === selectedCity.toLowerCase() : true)
            && (selectedMajor ? user.major.toLowerCase().includes(selectedMajor.toLowerCase()) : true)
            && (selectedEducationLevel ? user.educationLevel.toLowerCase() === selectedEducationLevel.toLowerCase() : true)
        );

        setVisibleUsers(filteredUsers.slice(startIndex, endIndex));
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
                <div
                    className='mx-auto min-h-full w-5/6 py-10 mt-24'
                >
                    <div className=' text-black p-4 rounded-xl mt-20'>
                        <h2 className='text-3xl text-center font-semibold tracking-wide mb-8'>Community</h2>

                        <div className='mb-6 flex flex-wrap items-center'>
                            <div className='flex-1 mb-2 md:mr-2 md:mb-0'>
                                <label className='block text-sm font-medium text-black mb-1'>Full Name:</label>
                                <input
                                    type='text'
                                    placeholder='Search by full name...'
                                    className='w-96 py-2 border border-gray-300 shadow-lg rounded-md px-2'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className='flex items-center mb-2 space-x-5 md:ml-2 md:mb-0'>
                                <div className='flex flex-col'>
                                    <label className='block text-sm font-medium text-black mb-2'>City:</label>
                                    <select
                                        className='w-40 py-2 px-2 border border-gray-300 shadow-lg rounded-md'
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                    >
                                        <option key="city" value="" disabled>Select a city</option>
                                        <option key="Baja" value="Baja">Baja</option>
                                        <option key="Budapest" value="Budapest">Budapest</option>
                                        <option key="Debrecen" value="Debrecen">Debrecen</option>
                                        <option key="Dunaújváros" value="Dunaújváros">Dunaújváros</option>
                                        <option key="Eger" value="Eger">Eger</option>
                                        <option key="Esztergom" value="Esztergom">Esztergom</option>
                                        <option key="Gödöllo" value="Gödöllo">Gödöllo</option>
                                        <option key="Gyor" value="Gyor">Gyor</option>
                                        <option key="Kecskemét" value="Kecskemét">Kecskemét</option>
                                        <option key="Nyíregyháza" value="Nyíregyháza">Nyíregyháza</option>
                                        <option key="Pécel" value="Pécel">Pécel</option>
                                        <option key="Pécs" value="Pécs">Pécs</option>
                                        <option key="Sopron" value="Sopron">Sopron</option>
                                        <option key="Székesfehérvár" value="Székesfehérvár">Székesfehérvár</option>
                                        <option key="Szeged" value="Szeged">Szeged</option>
                                        <option key="Tatabánya" value="Tatabánya">Tatabánya</option>
                                        <option key="Veszprém" value="Veszprém">Veszprém</option>
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='block text-sm font-medium text-black mb-2'>University:</label>
                                    <select
                                        className='w-40 py-2 px-2 border border-gray-300 shadow-lg rounded-md'
                                        value={selectedUniversity}
                                        onChange={(e) => setSelectedUniversity(e.target.value)}
                                    >
                                        <option key="uni" value="" disabled>Select university</option>
                                        <option key="AdventistaTeológiaiFõiskola" value="Adventista Teológiai Fõiskola">Adventista Teológiai Fõiskola</option>
                                        <option key="AndrássyUniversitätBudapest" value="Andrássy Universität Budapest">Andrássy Universität</option>
                                        <option key="BudapestiCorvinusEgyetem" value="Budapesti Corvinus Egyetem">Budapesti Corvinus Egyetem</option>
                                        <option key="BudapestiGazdaságiEgyetem" value="Budapesti Gazdasági Egyetem">Budapesti Gazdasági Egyetem</option>
                                        <option key="BudapestiMetropolitanEgyetem" value="Budapesti Metropolitan Egyetem">Budapesti Metropolitan Egyetem</option>
                                        <option key="BudapestiMuszakiésGazdaságtudományiEgyetem" value="Budapesti Muszaki és Gazdaságtudományi Egyetem">Budapesti Muszaki és Gazdaságtudományi Egyetem</option>
                                        <option key="DebreceniEgyetem" value="Debreceni Egyetem">Debreceni Egyetem</option>
                                        <option key="DebreceniReformátusHittudományiEgyetem" value="Debreceni Református Hittudományi Egyetem">Debreceni Református Hittudományi Egyetem</option>
                                        <option key="DunaújvárosiEgyetem" value="Dunaújvárosi Egyetem">Dunaújvárosi Egyetem</option>
                                        <option key="EdutusEgyetem" value="Edutus Egyetem">Edutus Egyetem</option>
                                        <option key="EötvösJózsefFoiskola" value="Eötvös József Foiskola">Eötvös József Foiskola</option>
                                        <option key="EötvösLorándTudományegyetem" value="Eötvös Loránd Tudományegyetem">Eötvös Loránd Tudományegyetem</option>
                                        <option key="EsztergomiHittudományiFõiskola" value="Esztergomi Hittudományi Fõiskola">Esztergomi Hittudományi Fõiskola</option>
                                        <option key="EszterházyKárolyEgyetem" value="Eszterházy Károly Egyetem">Eszterházy Károly Egyetem</option>
                                        <option key="GáborDénesFoiskola" value="Gábor Dénes Foiskola">Gábor Dénes Foiskola</option>
                                        <option key="InternationalBusinessSchool" value="International Business School">International Business School</option>
                                        <option key="KároliGáspárReformátusEgyetem" value="Károli Gáspár Református Egyetem">Károli Gáspár Református Egyetem</option>
                                        <option key="KodolányiJánosEgyetem" value="Kodolányi János Egyetem">Kodolányi János Egyetem</option>
                                        <option key="Közép-EurópaiEgyetem" value="Közép-Európai Egyetem">Közép-Európai Egyetem</option>
                                        <option key="LisztFerencZenemuvészetiEgyetem" value="Liszt Ferenc Zenemuvészeti Egyetem">Liszt Ferenc Zenemuvészeti Egyetem</option>
                                        <option key="MagyarAgrár-ésÉlettudományiEgyetem" value="Magyar Agrár- és Élettudományi Egyetem">Magyar Agrár- és Élettudományi Egyetem</option>
                                        <option key="MagyarKépzomuvészetiEgyetem" value="Magyar Képzomuvészeti Egyetem">Magyar Képzomuvészeti Egyetem</option>
                                        <option key="MagyarTáncmuvészetiEgyetem" value="Magyar Táncmuvészeti Egyetem">Magyar Táncmuvészeti Egyetem</option>
                                        <option key="MiltonFriedmanEgyetem" value="Milton Friedman Egyetem">Milton Friedman Egyetem</option>
                                        <option key="MiskolciEgyetem" value="Miskolci Egyetem">Miskolci Egyetem</option>
                                        <option key="Moholy-NagyMuvészetiEgyetem" value="Moholy-Nagy Muvészeti Egyetem">Moholy-Nagy Muvészeti Egyetem</option>
                                        <option key="NemzetiKözszolgálatiEgyetem" value="Nemzeti Közszolgálati Egyetem">Nemzeti Közszolgálati Egyetem</option>
                                        <option key="NeumannJánosEgyetem" value="Neumann János Egyetem">Neumann János Egyetem</option>
                                        <option key="NyíregyháziEgyetem" value="Nyíregyházi Egyetem">Nyíregyházi Egyetem</option>
                                        <option key="ÓbudaiEgyetem" value="Óbudai Egyetem">Óbudai Egyetem</option>
                                        <option key="PannonEgyetem" value="Pannon Egyetem">Pannon Egyetem</option>
                                        <option key="PázmányPéterKatolikusEgyetem" value="Pázmány Péter Katolikus Egyetem">Pázmány Péter Katolikus Egyetem</option>
                                        <option key="PécsiTudományegyetem" value="Pécsi Tudományegyetem">Pécsi Tudományegyetem</option>
                                        <option key="SemmelweisEgyetem" value="Semmelweis Egyetem">Semmelweis Egyetem</option>
                                        <option key="SoproniEgyetem" value="Soproni Egyetem">Soproni Egyetem</option>
                                        <option key="SzéchényiIstvánEgyetem" value="Széchényi István Egyetem">Széchényi István Egyetem</option>
                                        <option key="SzegediTudományegyetem" value="Szegedi Tudományegyetem">Szegedi Tudományegyetem</option>
                                        <option key="Színház-ésFilmmuvészetiEgyetem" value="Színház- és Filmmuvészeti Egyetem">Színház- és Filmmuvészeti Egyetem</option>
                                        <option key="TomoriPálFoiskola" value="Tomori Pál Foiskola">Tomori Pál Foiskola</option>
                                        <option key="WekerleSándorÜzletiFoiskola" value="Wekerle Sándor Üzleti Foiskola">Wekerle Sándor Üzleti Foiskola</option>
                                        <option key="WesleyJánosLelkészképzoFoiskola" value="Wesley János Lelkészképzo Foiskola">Wesley János Lelkészképzo</option>

                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className='block text-sm font-medium text-black mb-2'>Major:</label>
                                    <input
                                        type='text'
                                        placeholder='Filter by major...'
                                        className='w-40 py-2 px-2 border border-gray-300 shadow-lg rounded-md'
                                        value={selectedMajor}
                                        onChange={(e) => setSelectedMajor(e.target.value)}
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='block text-sm font-medium text-black mb-2'>Education Level:</label>
                                    <select
                                        className='w-40 py-2 px-2 border border-gray-300 shadow-lg rounded-md'
                                        value={selectedEducationLevel}
                                        onChange={(e) => setSelectedEducationLevel(e.target.value)}
                                    >
                                        <option key="level" value="" disabled>Select level</option>
                                        <option key="Bachelors" value="Bachelors">Bachelors</option>
                                        <option key="Masters" value="Masters">Masters</option>
                                        <option key="Doctoral" value="Doctoral">Doctoral</option>
                                    </select>
                                </div>
                            </div>
                            {/* Search and Clear Filters Icons */}
                            <div className='flex items-center ml-2 mt-7'>
                                <button
                                    className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 shadow-lg rounded-md mr-2'
                                    onClick={handleSearch}
                                >
                                    <Search size={20} />
                                </button>
                                <button
                                    className='bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 shadow-lg rounded-md'
                                    onClick={handleClearFilters}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* User Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' style={{ minHeight: '200px' }}>
                            {visibleUsers.length === 0 ? (
                                <p className='text-gray-600'>No results found.</p>
                            ) : (
                                visibleUsers.map((user) => (
                                    <div key={user.id} className='bg-white rounded-lg shadow-2xl p-4 ease-in-out duration-300'>
                                        <img
                                            src={user.profilePictureURL ? user.profilePictureURL : "/assets/default-profile-picture.jpg"}
                                            alt={`${user.fullName}`}
                                            className='w-24 h-24 rounded-full mx-auto mb-2'
                                        />
                                        <h3 className='text-lg font-semibold text-black'>{user.fullName}</h3>
                                        <p className='text-sm text-gray-600'>City: {user.city}</p>
                                        <p className='text-sm text-gray-600'>University: {user.university}</p>
                                        <p className='text-sm text-gray-600'>Major: {user.major}</p>
                                        <p className='text-sm text-gray-600'>Education Level: {user.educationLevel}</p>
                                        {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full mt-4 float-right'>
                                        Message
                                    </button> */}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination Buttons */}
                        <div className='mt-6 text-center'>
                            {currentIndex > 0 && (
                                <motion.button
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 shadow-xl rounded-full mr-2`}
                                    onClick={handleSlideLeft}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>
                            )}
                            {currentIndex < Math.floor(users.length / cardsPerPage) && visibleUsers.length >= cardsPerPage && (
                                <motion.button
                                    className={`bg-blue-500 hover-bg-blue-700 text-white font-semibold py-2 px-4 shadow-xl rounded-full`}
                                    onClick={handleSlideRight}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronRight size={20} />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Community;
