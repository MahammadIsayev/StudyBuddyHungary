import React from 'react';
import { TelephoneFill, Instagram, Linkedin, Github } from 'react-bootstrap-icons';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-3">
            <div className="flex flex-wrap justify-between mt-4 max-w-screen-xl mx-auto">
                <div>
                    <h3 className="text-xl font-bold">Mahammad Isayev</h3>
                    <p>FrontEnd Developer | Cyber Security Engineer</p>

                    <div className='flex'>
                        <TelephoneFill className="bi mt-1" />
                        <p className='ml-2'>Phone: +36 20 3288232</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold">Connect With Me</h3>
                    <div className="flex space-x-4 mt-1">
                        <a href="https://www.instagram.com/magaforreall/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-500">
                            <Instagram className="bi" />
                        </a>
                        <a href="https://www.linkedin.com/in/mahammadisayev/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-500">
                            <Linkedin className="bi" />
                        </a>
                        <a href="https://www.github.com/MahammadIsayev/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-500">
                            <Github className="bi" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Mahammad Isayev. All rights reserved.</p>
                <p>Terms of Service | Privacy Policy</p>
            </div>
        </footer>
    );
};

export default Footer;
