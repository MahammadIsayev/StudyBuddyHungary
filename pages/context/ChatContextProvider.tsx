import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../src/app/firebase'

interface ChatContextProps {
    children: ReactNode;
}

interface ChatState {
    chatId: string;
    user: Record<string, any>;
}

interface Action {
    type: string;
    payload: Record<string, any>;
}

export const ChatContext = createContext<any>(null);

export const ChatContextProvider: React.FC<ChatContextProps> = ({ children }) => {
    const currentUser: User | null = auth.currentUser;
    // console.log('Current User:', currentUser);
    const INITIAL_STATE: ChatState = {
        chatId: 'null',
        user: {},
    };

    const chatReducer = (state: ChatState, action: Action) => {
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    user: action.payload,
                    chatId:
                        currentUser?.uid && currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + (currentUser?.uid || ''),
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
};
