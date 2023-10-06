import { useState } from "react";
import Image from 'next/image';
import Link from "./Link";
import { SelectedPage } from "@/app/shared/types";
import { signOut } from "next-auth/react";

type Props = {
    isTopOfPage: boolean;
    selectedPage: SelectedPage;
    setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
    console.log(isTopOfPage)
    const navbarBackground = !isTopOfPage ? "" : "bg-[#fbbb5b] drop-shadow-md";

    return (
        <nav>
            <div className={`${navbarBackground} flex items-center justify-between fixed top-0 z-30 w-full py-2`}>
                <div className={`flex items-center justify-between mx-auto w-5/6`}>
                    <div className={`flex items-center justify-between w-full gap-16`}>
                        <Image src="/assets/Logo.png" alt="Logo" width={140} height={100} />

                        <div className={`flex items-center justify-between w-full`}>
                            <div className={`flex items-center justify-between gap-8 text-lg`}>
                                <Link
                                    page="Home"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                />
                                <Link
                                    page="Community"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                />
                                <Link
                                    page="Forum"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                />
                                <Link
                                    page="Messages"
                                    selectedPage={selectedPage}
                                    setSelectedPage={setSelectedPage}
                                />
                            </div>
                            <div className={`flex items-center justify-between gap-8 text-lg`}>
                                <button onClick={() => signOut()}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;