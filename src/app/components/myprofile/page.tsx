import React, { useState, useEffect } from 'react';
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
    isProfileModalOpen: boolean;
    setProfileModalOpen: (isOpen: boolean) => void; 
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
    const [fileError, setFileError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const user: User | null = auth.currentUser;

    const fetchUserProfile = async () => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data() as ProfileData;
                setUpdatedProfileData(userData);
            }

        }
    };

    useEffect(() => {
        if (isProfileModalOpen && user) {
            fetchUserProfile();
        }
    }, [isProfileModalOpen, user]);

    const handleUpdateProfile = async () => {
        try {
            if (!user) {
                console.error('User is not authenticated');
                return;
            }

            if (fileError) return;
            setUpdating(true);
            const userDocRef = doc(db, 'users', user.uid);
            const updatedFields: Partial<ProfileData> = {};

            updatedFields.fullName = updatedProfileData.fullName;
            updatedFields.university = updatedProfileData.university;
            updatedFields.major = updatedProfileData.major;
            updatedFields.city = updatedProfileData.city;
            updatedFields.educationLevel = updatedProfileData.educationLevel;

            if (profilePicture) {
                try {
            
                    const storageRef = ref(storage, `profile-pictures/${user.uid}`);
                    await uploadBytes(storageRef, profilePicture);

            
                    const downloadURL = await getDownloadURL(storageRef);

                    updatedFields.profilePictureURL = downloadURL;
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                }
            }


            await setDoc(userDocRef, updatedFields, { merge: true });

            setUpdating(false);

            setUpdateSuccess(true);

            setTimeout(() => {
                setProfileModalOpen(false);
            }, 1100);

            setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error updating user profile data:', error);
            setUpdating(false);
        }
    };

    const isImageFile = (file: File): boolean => {

        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        return allowedImageTypes.includes(file.type);
    };




    return (
        <div className="mt-6">

            <div className="mb-4">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Profile Picture</label>
                <input
                    type="file"
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];

                        if (selectedFile) {
                            if (isImageFile(selectedFile)) {
                                setProfilePicture(selectedFile);
                                setFileError(null);
                            } else {
                                setFileError('Incorrect file type. Please select an image file.');
                            }
                        } else {
                            setFileError('No file selected');
                        }
                    }}
                    className="mt-1 p-2 border rounded w-full text-sm"
                />
                {updatedProfileData.profilePictureURL && !profilePicture && (
                    <div className="flex-center mt-8">
                        <img
                            src={updatedProfileData.profilePictureURL}
                            alt="Current Profile"
                            className="rounded-full h-16 w-16 object-cover mx-auto"
                        />
                    </div>
                )}
                {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Full Name</label>
                <input
                    type="text"
                    value={updatedProfileData.fullName}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, fullName: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full text-sm"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm text-orange-400 font-semibold">City</label>
                <select
                    value={updatedProfileData.city}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, city: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full text-sm"
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

            <div className="mb-4">
                <label className="block text-sm font-medium text-orange-400 font-semibold">University</label>
                <select
                    value={updatedProfileData.university}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, university: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full text-sm"
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

            <div className="mb-4">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Education Level</label>
                <select
                    value={updatedProfileData.educationLevel}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, educationLevel: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full text-sm"
                >
                    <option key="level" value="" disabled>Select level</option>
                    <option key="Bachelors" value="Bachelors">Bachelors</option>
                    <option key="Masters" value="Masters">Masters</option>
                    <option key="Doctoral" value="Doctoral">Doctoral</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-orange-400 font-semibold">Major</label>
                <input
                    type="text"
                    value={updatedProfileData.major}
                    onChange={(e) => setUpdatedProfileData((prevData) => ({ ...prevData, major: e.target.value }))}
                    className="mt-1 p-2 border rounded w-full text-sm"
                />
            </div>
            {updateSuccess && (
                <p className="text-green-500 text-sm">Profile updated successfully!</p>
            )}
            <button onClick={handleUpdateProfile} disabled={isUpdating} className="bg-blue-500 font-semibold text-white px-4 py-2 rounded float-right text-sm">
                {isUpdating ? "Updating..." : "Save"}
            </button>
        </div>
    );

};

export default MyProfile;






