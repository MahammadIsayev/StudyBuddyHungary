'use client';
//Password should be at least 6 characters, Firebase: Error (auth/invalid-email)
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, db } from '../firebase';
import { ChatContextProvider } from '../../../pages/context/ChatContextProvider';
import { useRouter } from 'next/navigation';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isButtonDisabled = !email || !password || !passwordAgain || (password !== passwordAgain)

  const handlePasswordAgainPaste = (e: any) => {
    e.preventDefault();
    alert("Pasting into this field is disabled for security reasons.");
  };

  const signup = async () => {
    if (password === passwordAgain) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, 'users', user.uid);
        const userData = {
          userID: user.uid,
          fullName: '',
          university: '',
          major: '',
          city: '',
          educationLevel: '',
          profilePictureURL: ''
        };


        await setDoc(userRef, userData);
        await setDoc(doc(db, "userChats", user.uid), {});

        // localStorage.setItem('currentUser', JSON.stringify(userData));

        router.push("/signin")

      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  };

  return (
    <ChatContextProvider>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8" style={{
        backgroundImage: `url('/assets/mainhome.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Sign up for Free
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                  Password
                </label>
                <button
                  onClick={togglePasswordVisibility}
                  className="text-indigo-500 focus:outline-none"
                >
                  {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                </button>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                  Password Again
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="passwordAgain"
                  name="passwordAgain"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  onPaste={handlePasswordAgainPaste}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={isButtonDisabled}
                onClick={() => signup()}
                className={`${isButtonDisabled ? 'cursor-not-allowed opacity-40' : ''
                  } flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
              >
                Sign Up
              </button>

              <p className="mt-10 text-center text-sm text-gray-700">
                Already have an account?{' '}
                <button onClick={() => router.push('signin')} className="font-semibold leading-6 text-indigo-700 hover:text-indigo-400">
                  Sign-in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ChatContextProvider>
  )
}