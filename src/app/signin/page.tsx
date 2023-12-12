'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { ChatContextProvider } from '../contexts/ChatContextProvider';
import { BsEye, BsEyeSlash } from 'react-icons/bs';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectingDots, setRedirectingDots] = useState('');

  const router = useRouter();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/user-not-found') {
        setGeneralError('User not found. Please sign up.');
      } else if (error.code === 'auth/invalid-login-credentials') {
        setGeneralError('Incorrect email or password. Please try again.');
      } else {
        setGeneralError('An error occurred while signing in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: any) => {
    const enteredEmail = e.target.value;
    setEmail(enteredEmail);
    setEmailError(validateEmail(enteredEmail) ? '' : 'Invalid email format.');
    setGeneralError('');
  };

  const isButtonDisabled = !email || !password || emailError;

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

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8" style={{
        background: `url('/assets/mainhome.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // margin: 0,
        // padding: '9.2%',
      }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Sign-in to your account
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
                  onChange={handleEmailChange}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-black/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {generalError && <p className="text-red-600 text-xs mt-2">{generalError}</p>}
            <div>
              <button
                onClick={handleSignIn}
                disabled={isButtonDisabled as boolean}
                className={`${isButtonDisabled ? 'cursor-not-allowed opacity-40' : ''
                  } flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="mr-2">Signing-in {redirectingDots}</span>
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  'Sign-in'
                )}
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-700">
            Not a member?{' '}
            <button onClick={() => router.push('signup')} className="font-semibold leading-6 text-indigo-700 hover:text-indigo-400">
              Sign up
            </button>
          </p>
          <div className="text-sm">
            <div onClick={() => router.push('/forgot-password')} className="cursor-pointer font-semibold text-indigo-700 hover:text-indigo-400 text-center">
              Forgot password?
            </div>
          </div>
        </div>
      </div>
    </ChatContextProvider>
  );
}

export default Signin
