import { AppProps } from 'next/app';
import { AuthProvider } from './context/AuthProvider';
import { ChatContextProvider } from './context/ChatContextProvider';


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ChatContextProvider>
                <Component {...pageProps} />
            </ChatContextProvider>
        </AuthProvider>
    );
}

export default MyApp;
