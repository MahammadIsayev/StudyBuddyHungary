import React from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { SelectedPage } from "@/app/shared/types";

type Props = {
  page: string;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Link = ({ page, selectedPage, setSelectedPage }: Props) => {
  const lowerCasePage = page.toLowerCase().replace(/ /g, "") as SelectedPage;

  return (
    <ScrollLink
      activeClass="border-b-2 border-orange-700"
      className={`text-base transition duration-500 hover:text-primary-300 cursor-pointer ${selectedPage === lowerCasePage ? "text-primary-900" : ""
        }`}
      to={lowerCasePage}
      spy={true}
      smooth={true}
      offset={-100}
      onClick={() => setSelectedPage(lowerCasePage)}
    >
      {page}
    </ScrollLink>
  );
};

export default Link;
