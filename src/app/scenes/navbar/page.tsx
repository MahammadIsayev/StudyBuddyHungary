import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "./Link";
import { SelectedPage } from "@/app/shared/types";
import { signOut } from "firebase/auth";
import Modal from "../modal/page";
import {
    doc,
    getDoc,
} from "firebase/firestore";
import { User } from 'firebase/auth';
import { db, auth } from "../../firebase"
import MyProfile from "../myprofile/page";
import Forum from "../forum/page";

interface ProfileData {
    fullName: string;
    university: string;
    major: string;
    city: string;
    educationLevel: string;
    profilePictureURL: string;
}

type Props = {
    isTopOfPage: boolean;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
    const navbarBackground = !isTopOfPage
        ? "bg-[#fbbb5b] drop-shadow-xl"
        : "bg-[#fbbb5b]";

    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [updatedProfileData, setUpdatedProfileData] = useState<ProfileData>({
        fullName: "",
        university: "",
        major: "",
        city: "",
        educationLevel: "",
        profilePictureURL: ""
    });

    const user: User | null = auth.currentUser;

    const fetchUserProfile = async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
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

    const signingOut = () => {
        signOut(auth);
        window.location.href = '/signin';
    }


    return (
        <nav>
            <div className={`fixed top-0 w-full py-2 ${navbarBackground} flex items-center justify-between z-30`}>
                <div className="w-5/6 mx-auto flex items-center justify-between">
                    <div className="w-full gap-16 flex items-center justify-between">
                        <Image src="/assets/Logo.png" alt="Logo" width={140} height={100} />

                        <div className="w-full flex items-center justify-between">
                            <div className="text-lg gap-8 flex items-center justify-between">
                                <Link page="Home" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                <Link page="Community" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                <Link page="Forum" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                                <button type="button" onClick={() => window.open('/messagesui', '_blank')}>
                                    Messages
                                </button>
                                {/* <Link page="Messages" selectedPage={selectedPage} setSelectedPage={openMessagesPage} /> */}
                            </div>
                            <div className="text-lg gap-8 flex items-center justify-between">
                                <button onClick={() => setProfileModalOpen(true)}>My Profile</button>
                                <button onClick={() => signingOut()}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)}>
                <MyProfile isProfileModalOpen={isProfileModalOpen} setProfileModalOpen={setProfileModalOpen} />
            </Modal>
        </nav>
    );
};

export default Navbar;
