import React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "./types";

type Props = {
    children: React.ReactNode;
    setSelectedPage: (value: SelectedPage) => void;
};

const Button = ({ children, setSelectedPage }: Props) => {
    return (
        <AnchorLink
            className="bg-[#fbbb5b] hover:bg-orange-400 text-black font-semibold py-2 px-4 rounded-full shadow-md"
            onClick={() => setSelectedPage(SelectedPage.Messages)}
            href={`#${SelectedPage.Messages}`}
        >
            {children}
        </AnchorLink>
    );
};

export default Button;