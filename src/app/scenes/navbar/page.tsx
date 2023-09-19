import React from 'react'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import Logo from './assets/Logo.png';


type Props = {}

const Navbar = (props: Props) => {
    return (
        <nav>
            <div className='flex items-center justify-center fixed top-0 z-30 w-full py-6'>
                <div className='flex items-center justify-center mx-auto w-5/6'>
                    <div className='flex items-center justify-center w-full gap-16'>
                        <img className='object-cover h-36 w-64.5' alt="logo" src="/assets/Logo.png" />
                        <div className='flex items-center justify-center w-full'>
                            <div className='flex items-center justify-center gap-8 text-sm'>
                                <p>Home</p>
                                <p>Search</p>
                                <p>Forum</p>
                                <p>Contact</p>
                            </div>
                            <div className='flex items-center justify-center gap-8'>
                                <p>Sign in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;