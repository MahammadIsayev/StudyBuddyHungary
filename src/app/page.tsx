'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Navbar from './scenes/navbar/page';

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  return (
    <div className="p-8">
      <div className='bg-gray-20'>
        <Navbar></Navbar>
      </div>
      {/* <div className='text-white'>{session?.data?.user?.email }</div>
      <button className='text-white' onClick={() => signOut()}>Logout</button> */}
    </div>
  )
}

Home.requireAuth = true