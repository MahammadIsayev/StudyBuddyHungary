'use client';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { ChatContextProvider } from '../contexts/ChatContextProvider';
import { useRouter } from 'next/navigation';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [redirectingDots, setRedirectingDots] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordAgainError, setPasswordAgainError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');
  const [isRedirected, setIsRedirected] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: any) => {
    return password.length >= 6;
  };

  const isValidEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isButtonDisabled = !email || !password || !passwordAgain || (password !== passwordAgain) || !isValidEmail(email) || !validatePassword(password)

  const handlePasswordAgainPaste = (e: any) => {
    e.preventDefault();
    alert("Pasting into this field is disabled for security reasons.");
  };

  const signup = async () => {
    try {
      setIsLoading(true);
      if (password !== passwordAgain) {
        setFirebaseError('Passwords do not match.');
        setIsSignupSuccess(false);
        return;
      }

      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setFirebaseError('Email is already in use. Please use a different email.');
        setIsSignupSuccess(false);
        return;
      }

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
        profilePictureURL: '',
      };

      await setDoc(userRef, userData);
      await setDoc(doc(db, 'userChats', user.uid), {});

      setIsSignupSuccess(true);
    } catch (error: any) {
      console.error('Error signing up:', error);
      if (error.code === 'auth/email-already-in-use') {
        setFirebaseError('Email is already in use. Please use a different email.');
      } else {
        setFirebaseError('An error occurred while signing up. Please try again later.');
      }
      setIsSignupSuccess(false);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setIsSignupSuccess(false);
      setTimeout(() => {
        if (!firebaseError && !isRedirected) {
          setIsRedirected(true);
          router.push('/signin');
        }
      }, 500);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRedirectingDots((prevDots) => {
        return prevDots.length === 3 ? '' : prevDots + '.';
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(!isValidEmail(e.target.value) ? 'Invalid email format.' : '');
                    setFirebaseError('');
                  }}
                  required
                  className={`block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${emailError ? 'border-red-500' : ''
                    }`}
                />
                {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(!validatePassword(e.target.value) ? 'Password should be at least 6 characters.' : '');
                  }}
                  required
                  className={`block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${passwordError ? 'border-red-500' : ''
                    }`}
                />
                {passwordError && <p className="text-red-600 text-xs mt-1">{passwordError}</p>}

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
                  onChange={(e) => {
                    setPasswordAgain(e.target.value);
                    setPasswordAgainError(password !== e.target.value ? 'Passwords do not match.' : '');
                  }}
                  onPaste={handlePasswordAgainPaste}
                  required
                  className={`block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 ${passwordAgainError ? 'border-red-500' : ''
                    }`}
                />
                {passwordAgainError && <p className="text-red-600 text-xs mt-1">{passwordAgainError}</p>}
              </div>
            </div>

            <div>
              <button
                disabled={isButtonDisabled}
                onClick={() => signup()}
                className={`${isButtonDisabled ? 'cursor-not-allowed opacity-40' : ''
                  } flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="mr-2">Signing up {redirectingDots}</span>
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  'Sign up'
                )}
              </button>
              {firebaseError && <p className="text-red-600 text-xs mt-2">{firebaseError}</p>}

              {/*if true*/}
              {isSignupSuccess && !isRedirected && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-md text-center">
                    <p className="text-green-500 font-semibold">Account created successfully!</p>
                    <p className="text-black">Redirecting {redirectingDots}</p>
                  </div>
                </div>
              )}
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