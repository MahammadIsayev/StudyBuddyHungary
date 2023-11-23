'use client';
import Navbar from './scenes/navbar/page';
import MainHome from './scenes/mainhome/page';
import Community from './scenes/community/page';
import { useEffect, useState } from 'react';
import { SelectedPage } from './shared/types';
import Forum from './scenes/forum/page';
// import MessagesUI from '../../pages/messagesui';

export default function Home() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const scrollFunction = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home)
      } else {
        setIsTopOfPage(false);
      }
    }
    window.addEventListener("scroll", scrollFunction)
    return () => { window.removeEventListener("scroll", scrollFunction) }
  }, []);

  return (
    <div>
      <div className='bg-gray-20'>
        <Navbar isTopOfPage={isTopOfPage} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <MainHome setSelectedPage={setSelectedPage} />
        <Community setSelectedPage={setSelectedPage} />
        <Forum setSelectedPage={setSelectedPage} />
        {/* <MessagesUI /> */}
      </div>
    </div>
  )
}

Home.requireAuth = true