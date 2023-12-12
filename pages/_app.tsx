import { AppProps } from 'next/app';
import { AuthProvider } from '../src/app/contexts/AuthProvider';
import { ChatContextProvider } from '../src/app/contexts/ChatContextProvider';
import '../src/app/globals.css'


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <AuthProvider>
            <ChatContextProvider>
                <Component {...pageProps} />
            </ChatContextProvider>
        </AuthProvider>
    );
}

export default MyApp;
