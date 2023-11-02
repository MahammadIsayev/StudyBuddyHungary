import React, { useState } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";

import Modal from "../modal/page";




const Button = () => {
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    return (
        <Modal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} children={undefined} />
    );
};

export default Button;