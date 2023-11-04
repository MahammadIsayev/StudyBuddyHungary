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
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow-md"
            onClick={() => setSelectedPage(SelectedPage.Community)}
            href={`#${SelectedPage.Community}`}
        >
            {children}
        </AnchorLink>
    );
};

export default Button;