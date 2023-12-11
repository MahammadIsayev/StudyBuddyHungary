import { AppProps } from 'next/app';
import { AuthProvider } from './context/AuthProvider';
import { ChatContextProvider } from './context/ChatContextProvider';
import Footer from '@/app/scenes/footer/page';


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <ChatContextProvider>
                <Component {...pageProps} />
                {/* <Footer /> */}
            </ChatContextProvider>
        </AuthProvider>
    );
}

export default MyApp;
