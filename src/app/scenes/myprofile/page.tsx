import { useState } from "react";
import Image from "next/image";
import { SelectedPage } from "@/app/shared/types";
import { signOut } from "next-auth/react";
import Modal from "../modal/page";
import { doc, updateDoc } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBH5zfXdzYEYLSSlKkUk8DhchYKfePsybw",
    authDomain: "study-buddy-hungary.firebaseapp.com",
    projectId: "study-buddy-hungary",
    storageBucket: "study-buddy-hungary.appspot.com",
    messagingSenderId: "204464023423",
    appId: "1:204464023423:web:2be386d4fd50c710f11c4a",
    measurementId: "G-VQCS17VNSE"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [updatedProfileData, setUpdatedProfileData] = useState({
        university: "",
        major: "",
        city: "",
        educationLevel: "",
    });


    const handleUpdateProfile = async () => {

        const userId = "XntuMXqony0GmDaGk17c";
        try {
            const userDocRef = doc(db, "users", userId);
            const dataToUpdate = {
                university: updatedProfileData.university,
                major: updatedProfileData.major,
                city: updatedProfileData.city,
                educationLevel: updatedProfileData.educationLevel,
            };

            await updateDoc(userDocRef, dataToUpdate);
            console.log("User profile data updated:", dataToUpdate);

            setUpdatedProfileData((prevData) => ({
                ...prevData,
                university: "",
                major: "",
                city: "",
                educationLevel: "",
            }));
            setProfileModalOpen(false);
        } catch (error) {
            console.error("Error updating user profile data:", error);
        }
    };

const MyProfile = () => {
    return (
        <Modal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)}>
                <div className="mt-10">
                    <form>
                        <div className="mb-8">
                            <label className="block text-sm text-orange-400 font-semibold">City</label>
                            <select
                                value={updatedProfileData.city}
                                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, city: e.target.value })}
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
                                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, university: e.target.value })}
                                className="mt-1 p-2 border rounded w-full"
                            >
                                <option value=""></option>
                                <option value="eotvos-lorand-university">Eötvös Loránd University</option>
                                <option value="central-european-university">Central European University</option>
                                <option value="university-of-debrecen">University of Debrecen</option>
                                <option value="university-of-pecs">University of Pécs</option>
                                <option value="budapest-university-of-technology-and-economics">Budapest University of Technology and Economics</option>
                                <option value="corvinus-university-of-budapest">Corvinus University of Budapest</option>
                                <option value="semmelweis-university">Semmelweis University</option>
                                <option value="university-of-szeged">University of Szeged</option>
                                <option value="szechenyi-istvan-university">Széchenyi István University</option>
                                <option value="university-of-miskolc">University of Miskolc</option>
                                <option value="university-of-physical-education">University of Physical Education</option>
                                <option value="baptist-theological-seminary">Baptist Theological Seminary</option>
                                <option value="international-business-school">International Business School</option>
                                <option value="mc-daniel-college-budapest">McDaniel College Budapest</option>
                                <option value="moholy-nagy-university-of-art-and-design">Moholy-Nagy University of Art and Design</option>
                                <option value="obuda-university">Óbuda University</option>
                                <option value="premier-business-school">Premier Business School</option>
                                <option value="reformed-theological-university">Reformed Theological University</option>
                                <option value="tancsics-mihaly-vocational-college">Tancsics Mihály Vocational College</option>
                                <option value="the-hungarian-university-of-fine-arts">The Hungarian University of Fine Arts</option>
                                <option value="united-theological-seminary">United Theological Seminary</option>
                                <option value="university-of-physical-education">University of Physical Education</option>
                                <option value="berzsenyi-daniel-college">Berzsenyi Dániel College</option>
                                <option value="budapest-metropolitan-university">Budapest Metropolitan University</option>
                                <option value="budapest-university-of-jewish-studies">Budapest University of Jewish Studies</option>
                                <option value="college-of-communication-and-business">College of Communication and Business</option>
                                <option value="european-business-school-budapest">European Business School Budapest</option>
                                <option value="evangelical-lutheran-theological-university">Evangelical Lutheran Theological University</option>
                                <option value="gothard-theological-college">Gothard Theological College</option>
                                <option value="kodolanyi-janos-university-of-applied-sciences">Kodolányi János University of Applied Sciences</option>
                                <option value="liszt-ferenc-academy-of-music">Liszt Ferenc Academy of Music</option>
                                <option value="moholy-nagy-university-of-art-and-design">Moholy-Nagy University of Art and Design</option>
                                <option value="obuda-university">Óbuda University</option>
                                <option value="premier-business-school">Premier Business School</option>
                                <option value="reformed-theological-university">Reformed Theological University</option>
                                <option value="tancsics-mihaly-vocational-college">Tancsics Mihály Vocational College</option>
                                <option value="the-hungarian-university-of-fine-arts">The Hungarian University of Fine Arts</option>
                                <option value="united-theological-seminary">United Theological Seminary</option>
                                <option value="university-of-physical-education">University of Physical Education</option>
                                <option value="berzsenyi-daniel-college">Berzsenyi Dániel College</option>
                                <option value="budapest-metropolitan-university">Budapest Metropolitan University</option>
                                <option value="budapest-university-of-jewish-studies">Budapest University of Jewish Studies</option>
                                <option value="college-of-communication-and-business">College of Communication and Business</option>
                                <option value="european-business-school-budapest">European Business School Budapest</option>
                                <option value="evangelical-lutheran-theological-university">Evangelical Lutheran Theological University</option>
                                <option value="gothard-theological-college">Gothard Theological College</option>
                                <option value="kodolanyi-janos-university-of-applied-sciences">Kodolányi János University of Applied Sciences</option>
                                <option value="liszt-ferenc-academy-of-music">Liszt Ferenc Academy of Music</option>
                                <option value="moholy-nagy-university-of-art-and-design">Moholy-Nagy University of Art and Design</option>
                                <option value="obuda-university">Óbuda University</option>
                                <option value="premier-business-school">Premier Business School</option>
                                <option value="reformed-theological-university">Reformed Theological University</option>
                                <option value="tancsics-mihaly-vocational-college">Tancsics Mihály Vocational College</option>
                                <option value="the-hungarian-university-of-fine-arts">The Hungarian University of Fine Arts</option>
                                <option value="united-theological-seminary">United Theological Seminary</option>
                                <option value="university-of-physical-education">University of Physical Education</option>
                                <option value="berzsenyi-daniel-college">Berzsenyi Dániel College</option>
                                <option value="budapest-metropolitan-university">Budapest Metropolitan University</option>
                                <option value="budapest-university-of-jewish-studies">Budapest University of Jewish Studies</option>
                                <option value="college-of-communication-and-business">College of Communication and Business</option>
                                <option value="european-business-school-budapest">European Business School Budapest</option>
                                <option value="evangelical-lutheran-theological-university">Evangelical Lutheran Theological University</option>
                                <option value="gothard-theological-college">Gothard Theological College</option>
                                <option value="kodolanyi-janos-university-of-applied-sciences">Kodolányi János University of Applied Sciences</option>
                                <option value="liszt-ferenc-academy-of-music">Liszt Ferenc Academy of Music</option>
                                <option value="national-public-service-university">National Public Service University</option>
                                <option value="perenyi-peter-catholic-university">Perényi Péter Catholic University</option>
                                <option value="saint-stephen-university">Saint Stephen University</option>
                                <option value="sapientia-hungarian-university-of-transylvania">Sapientia Hungarian University of Transylvania</option>
                                <option value="szent-ignac-catholic-student-hall">Szent Ignác Catholic Student Hall</option>
                                <option value="szent-istvan-university">Szent István University</option>
                                <option value="szent-kereszt-catholic-university">Szent Kereszt Catholic University</option>
                                <option value="szentpeteri-martin-lutheran-evangelical-theological-college">Szentpéteri Martin Lutheran Evangelical Theological College</option>
                                <option value="tomori-pal-college">Tomori Pál College</option>
                                <option value="university-of-dunaújváros">University of Dunaújváros</option>
                                <option value="university-of-kaposvar">University of Kaposvár</option>
                                <option value="university-of-physical-education">University of Physical Education</option>
                                <option value="university-of-pecs">University of Pécs</option>
                                <option value="university-of-public-service">University of Public Service</option>
                                <option value="university-of-sopron">University of Sopron</option>
                                <option value="university-of-west-hungary">University of West Hungary</option>
                                <option value="university-of-zena">University of Zena</option>
                                <option value="west-hungarian-university">West Hungarian University</option>
                                <option value="david-sinyard-student-apartment-college">David Sinyard Student Apartment College</option>
                                <option value="hungarian-university-of-fine-arts">Hungarian University of Fine Arts</option>
                                <option value="janus-pannonius-university">Janus Pannonius University</option>
                                <option value="karoly-robert-college">Károly Róbert College</option>
                                <option value="kodolanyi-janos-college">Kodolányi János College</option>
                                <option value="kossuth-lajos-student-dormitory">Kossuth Lajos Student Dormitory</option>
                                <option value="mosonmagyarovar-vasvari-palyamuhely-secondary-school">Mosonmagyaróvár Vásári Pályaműhely Secondary School</option>
                                <option value="national-university-of-public-service">National University of Public Service</option>
                                <option value="peter-pazmany-catholic-university">Pázmány Péter Catholic University</option>
                                <option value="sargfabrik-theatre-school">SárgaFüzet Theatre School</option>
                                <option value="szolnok-university-college">Szolnok University College</option>
                                <option value="the-szent-istvan-institute">The Szent István Institute</option>
                            </select>
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-orange-400 font-semibold">Education Level</label>
                            <select
                                value={updatedProfileData.educationLevel}
                                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, educationLevel: e.target.value })}
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
                                onChange={(e) => setUpdatedProfileData({ ...updatedProfileData, major: e.target.value })}
                                className="mt-1 p-2 border rounded w-full"
                            />
                        </div>
                        <button onClick={handleUpdateProfile} className="bg-[#fbbb5b] font-semibold text-black px-4 py-2 rounded ">
                            Update
                        </button>
                    </form>
                </div>
            </Modal>
    )
}

export default MyProfile;