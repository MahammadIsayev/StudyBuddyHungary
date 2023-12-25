'use client';
import Navbar from './components/navbar/page';
import MainHome from './components/mainhome/page';
import Community from './components/community/page';
import { useEffect, useState } from 'react';
import { SelectedPage } from './shared/types';
import Forum from './components/forum/page';
import { AuthProvider } from './contexts/AuthProvider';
import { ChatContextProvider } from './contexts/ChatContextProvider';
import Footer from './components/footer/page';

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
    <AuthProvider>
      <ChatContextProvider>
        <div>
          <div className='bg-gray-20'>
            <Navbar isTopOfPage={isTopOfPage} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
            <MainHome setSelectedPage={setSelectedPage} />
            <Community setSelectedPage={setSelectedPage} />
            <Forum setSelectedPage={setSelectedPage} />
            <Footer />
          </div>
        </div>
      </ChatContextProvider>
    </AuthProvider>
  )
}

Home.requireAuth = true