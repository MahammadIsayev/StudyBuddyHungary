import React, { useState, useEffect } from 'react';
import Modal from '../modal/page';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth, ref, storage } from '../../firebase';
import { getDownloadURL, uploadBytes } from 'firebase/storage';

interface ProfileData {
    fullName: string;
    university: string;
    major: string;
    city: string;
    educationLevel: string;
    profilePictureURL: string;
}

interface Props {
    isProfileModalOpen: boolean; // Receive the isProfileModalOpen state as a prop
    setProfileModalOpen: (isOpen: boolean) => void; // Receive the setProfileModalOpen function as a prop
}

const MyProfile: React.FC<Props> = ({ isProfileModalOpen, setProfileModalOpen }) => {

    const [updatedProfileData, setUpdatedProfileData] = useState<ProfileData>({
        fullName: '',
        university: '',
        major: '',
        city: '',
        educationLevel: '',
        profilePictureURL: ''
    });
    const [isUpdating, setUpdating] = useState(false);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    console.log("Updated profile data:", updatedProfileData);
    const user: User | null = auth.currentUser;

    const fetchUserProfile = async () => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data() as ProfileData;
                console.log("User data retrieved:", userData);
                setUpdatedProfileData(userData);
            }

        }
    };

    useEffect(() => {
        if (isProfileModalOpen && user) {
            console.log("Fetching user profile data when modal is open.");
            fetchUserProfile();
        }
    }, [isProfileModalOpen, user]);

    const handleUpdateProfile = async () => {
        try {
            if (!user) {
                console.error('User is not authenticated');
                return;
            }
            setUpdating(true);
            const userDocRef = doc(db, 'users', user.uid);
            const updatedFields: Partial<ProfileData> = {};

            if (updatedProfileData.fullName !== '') {
                updatedFields.fullName = updatedProfileData.fullName;
            }
            if (updatedProfileData.university !== '') {
                updatedFields.university = updatedProfileData.university;
            }
            if (updatedProfileData.major !== '') {
                updatedFields.major = updatedProfileData.major;
            }
            if (updatedProfileData.city !== '') {
                updatedFields.city = updatedProfileData.city;
            }
            if (updatedProfileData.educationLevel !== '') {
                updatedFields.educationLevel = updatedProfileData.educationLevel;
            }

            if (profilePicture) {
                try {
                    // Upload profile picture to Firebase Storage
                    const storageRef = ref(storage, `profile-pictures/${user.uid}`);
                    await uploadBytes(storageRef, profilePicture);

                    // Get the download URL of the uploaded picture
                    const downloadURL = await getDownloadURL(storageRef);

                    // Update user profile with the image URL in Firestore
                    await setDoc(userDocRef, { profilePicture: downloadURL }, { merge: true });
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                }
            }

            setUpdating(false);

            setTimeout(() => {
                setProfileModalOpen(false);
            }, 1100);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error updating user profile data:', error);
            setUpdating(false);
        }
    };



    return (
        <div className="mt-10">

            <div className="mb-8">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Profile Picture</label>
                <input
                    type="file"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];

                        if (selectedFile) {
                            setProfilePicture(selectedFile);
                        } else {
                            console.error('No file selected');
                        }
                    }}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Full Name</label>
                <input
                    type="text"
                    value={updatedProfileData.fullName}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, fullName: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            <div className="mb-8">
                <label className="block text-sm text-orange-400 font-semibold">City</label>
                <select
                    value={updatedProfileData.city}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, city: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full"
                >
                    <option value=""></option>
                    <option value="Budapest">Budapest</option>
                    <option value="Debrecen">Debrecen</option>
                    <option value="Pécs">Pécs</option>
                    <option value="Miskolc">Miskolc</option>
                    <option value="Szeged">Szeged</option>
                    <option value="Győr">Győr</option>
                    <option value="Veszprém">Veszprém</option>
                    <option value="Szombathely">Szombathely</option>
                    <option value="Dunaújváros">Dunaújváros</option>
                    <option value="Kaposvár">Kaposvár</option>
                    <option value="Sopron">Sopron</option>
                    <option value="Szentendre">Szentendre</option>
                    <option value="Zalaegerszeg">Zalaegerszeg</option>
                    <option value="Eger">Eger</option>
                    <option value="Kecskemét">Kecskemét</option>
                    <option value="Tatabánya">Tatabánya</option>
                    <option value="Salgótarján">Salgótarján</option>
                    <option value="Hódmezővásárhely">Hódmezővásárhely</option>
                    <option value="Nagykanizsa">Nagykanizsa</option>
                    <option value="Szolnok">Szolnok</option>
                    <option value="Székesfehérvár">Székesfehérvár</option>
                    <option value="Szekszárd">Szekszárd</option>
                    <option value="Pécel">Pécel</option>
                    <option value="Sárvár">Sárvár</option>
                    <option value="Ajka">Ajka</option>
                    <option value="Ózd">Ózd</option>
                    <option value="Várpalota">Várpalota</option>
                    <option value="Dabas">Dabas</option>
                    <option value="Orosháza">Orosháza</option>
                    <option value="Kiskunhalas">Kiskunhalas</option>
                    <option value="Hajdúböszörmény">Hajdúböszörmény</option>
                    <option value="Keszthely">Keszthely</option>
                    <option value="Hatvan">Hatvan</option>
                    <option value="Kalocsa">Kalocsa</option>
                    <option value="Cegléd">Cegléd</option>
                    <option value="Szarvas">Szarvas</option>
                    <option value="Baja">Baja</option>
                    <option value="Gödöllő">Gödöllő</option>
                    <option value="Gyöngyös">Gyöngyös</option>
                    <option value="Monor">Monor</option>
                    <option value="Nagyatád">Nagyatád</option>
                    <option value="Mezőkövesd">Mezőkövesd</option>
                    <option value="Vác">Vác</option>
                    <option value="Pilisvörösvár">Pilisvörösvár</option>
                    <option value="Esztergom">Esztergom</option>
                    <option value="Sárbogárd">Sárbogárd</option>
                    <option value="Veszprémvarsány">Veszprémvarsány</option>
                    <option value="Zamárdi">Zamárdi</option>
                    <option value="Gyömrő">Gyömrő</option>
                    <option value="Hatvanbánhida">Hatvanbánhida</option>
                    <option value="Tapolca">Tapolca</option>
                    <option value="Ceglédbercel">Ceglédbercel</option>
                    <option value="Szabadszállás">Szabadszállás</option>
                    <option value="Nagytarcsa">Nagytarcsa</option>
                    <option value="Vácduka">Vácduka</option>
                </select>
            </div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-orange-400 font-semibold">University</label>
                <select
                    value={updatedProfileData.university}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, university: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full"
                >
                    <option value=""></option>
                    <option value="Eötvös Loránd University">Eötvös Loránd University</option>
                    <option value="Central European University">Central European University</option>
                    <option value="University of Debrecen">University of Debrecen</option>
                    <option value="University of Pécs">University of Pécs</option>
                    <option value="Budapest University of Technology and Economics">Budapest University of Technology and Economics</option>
                    <option value="Corvinus University of Budapest">Corvinus University of Budapest</option>
                    <option value="Semmelweis University">Semmelweis University</option>
                    <option value="University of Szeged">University of Szeged</option>
                    <option value="Széchenyi István University">Széchenyi István University</option>
                    <option value="University of Miskolc">University of Miskolc</option>
                    <option value="University of Physical Education">University of Physical Education</option>
                    <option value="Baptist Theological Seminary">Baptist Theological Seminary</option>
                    <option value="International Business School">International Business School</option>
                    <option value="McDaniel College Budapest">McDaniel College Budapest</option>
                    <option value="Moholy-Nagy University of Art and Design">Moholy-Nagy University of Art and Design</option>
                    <option value="Óbuda University">Óbuda University</option>
                    <option value="Premier Business School">Premier Business School</option>
                    <option value="Reformed Theological University">Reformed Theological University</option>
                    <option value="Tancsics Mihály Vocational College">Tancsics Mihály Vocational College</option>
                    <option value="The Hungarian University of Fine Arts">The Hungarian University of Fine Arts</option>
                    <option value="United Theological Seminary">United Theological Seminary</option>
                    <option value="University of Physical Education">University of Physical Education</option>
                    <option value="Berzsenyi Dániel College">Berzsenyi Dániel College</option>
                    <option value="Budapest Metropolitan University">Budapest Metropolitan University</option>
                    <option value="Budapest University of Jewish Studies">Budapest University of Jewish Studies</option>
                    <option value="College of Communication and Business">College of Communication and Business</option>
                    <option value="European Business School Budapest">European Business School Budapest</option>
                    <option value="Evangelical Lutheran Theological University">Evangelical Lutheran Theological University</option>
                    <option value="Gothard Theological College">Gothard Theological College</option>
                    <option value="Kodolányi János University of Applied Sciences">Kodolányi János University of Applied Sciences</option>
                    <option value="Liszt Ferenc Academy of Music">Liszt Ferenc Academy of Music</option>
                    <option value="National Public Service University">National Public Service University</option>
                    <option value="Perényi Péter Catholic University">Perényi Péter Catholic University</option>
                    <option value="Saint Stephen University">Saint Stephen University</option>
                    <option value="Sapientia Hungarian University of Transylvania">Sapientia Hungarian University of Transylvania</option>
                    <option value="Szent Ignác Catholic Student Hall">Szent Ignác Catholic Student Hall</option>
                    <option value="Szent István University">Szent István University</option>
                    <option value="Szent Kereszt Catholic University">Szent Kereszt Catholic University</option>
                    <option value="Szentpéteri Martin Lutheran Evangelical Theological College">Szentpéteri Martin Lutheran Evangelical Theological College</option>
                    <option value="Tomori Pál College">Tomori Pál College</option>
                    <option value="University of Dunaújváros">University of Dunaújváros</option>
                    <option value="University of Kaposvár">University of Kaposvár</option>
                    <option value="University of Pécs">University of Pécs</option>
                    <option value="University of Public Service">University of Public Service</option>
                    <option value="University of Sopron">University of Sopron</option>
                    <option value="University of West Hungary">University of West Hungary</option>
                    <option value="University of Zena">University of Zena</option>
                    <option value="West Hungarian University">West Hungarian University</option>
                    <option value="David Sinyard Student Apartment College">David Sinyard Student Apartment College</option>
                    <option value="Hungarian University of Fine Arts">Hungarian University of Fine Arts</option>
                    <option value="Janus Pannonius University">Janus Pannonius University</option>
                    <option value="Károly Róbert College">Károly Róbert College</option>
                    <option value="Kodolányi János College">Kodolányi János College</option>
                    <option value="Kossuth Lajos Student Dormitory">Kossuth Lajos Student Dormitory</option>
                    <option value="Mosonmagyaróvár Vásári Pályaműhely Secondary School">Mosonmagyaróvár Vásári Pályaműhely Secondary School</option>
                    <option value="National University of Public Service">National University of Public Service</option>
                    <option value="Pázmány Péter Catholic University">Pázmány Péter Catholic University</option>
                    <option value="SárgaFüzet Theatre School">SárgaFüzet Theatre School</option>
                    <option value="Szolnok University College">Szolnok University College</option>
                    <option value="The Szent István Institute">The Szent István Institute</option>
                </select>
            </div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Education Level</label>
                <select
                    value={updatedProfileData.educationLevel}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, educationLevel: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full"
                >
                    <option value=""></option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                </select>
            </div>
            <div className="mb-8">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Major</label>
                <input
                    type="text"
                    value={updatedProfileData.major}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, major: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full"
                />
            </div>
            <button onClick={handleUpdateProfile} disabled={isUpdating} className="bg-blue-500 font-semibold text-white px-4 py-2 rounded ">
                {isUpdating ? "Updating..." : "Update"}
            </button>
        </div>
    );
};

export default MyProfile;