'use client';
import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false); 
  const [isMailSent, setIsMailSent] = useState(false);

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const resetEmail = async () => {
    if (isEmailValid) {
      try {
        await sendPasswordResetEmail(auth, email);
        setIsMailSent(true);
      } catch (error) {
        console.error('Error sending reset email:', error);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" style={{
        backgroundImage: `url('/assets/mainhome.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Forgot Password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setEmail(newEmail);
                    setIsEmailValid(validateEmail(newEmail));
                  }}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={resetEmail}
                disabled={!isEmailValid}
                className={`flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${!isEmailValid ? 'cursor-not-allowed opacity-40' : ''
                  }`}
              >
                {isMailSent ? 'An email has been sent!' : 'Send "Forgot Password" Email'} </button>
              <div className='text-center mt-2'>
                <button onClick={() => router.push('signin')} className="font-semibold leading-6 text-indigo-700 text-sm hover:text-indigo-400">
                  Back to Sign-in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
