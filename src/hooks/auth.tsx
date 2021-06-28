import React , { 
    createContext,
    useContext,
    useState,
    ReactNode
} from 'react';

import * as AuthSession from 'expo-auth-session';

import {
    SCOPE,
    CLIENT_ID,
    CDN_IMAGE,
    REDIRECT_URI,
    RESPONSE_TYPE
} from '../configs';

import { api } from '../services/api';

type User = {
    id: string;
    userName: string;
    firstName: string;
    avatar: string;
    email: string;
    token: string;
}

type AuthContextData = {
    user: User;
    loading: boolean;
    signIn: () => Promise<void>;
}

type AuthProviderProps ={
    children: ReactNode;
}

type AuthorizationResponse = AuthSession.AuthSessionResult & {
    params: {
        access_token: string;
    }
}

// contexto comeca como um objeto vazio mas que o tipo dele é um AutContextData
export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children } : AuthProviderProps) {
    // usestate é do tipo user que comeca vazio mas do tipo user
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(false);

    async function signIn() {
        try {
            setLoading(true);

            const authUrl = `${api.defaults.baseURL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            // pra onde deve ir ao comecar o processo de autenticacao
            // a resposta disso aqui, é isso as AuthorizationResponse
            const { type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

            if (type === "success") {
                // token injetado no headers
                api.defaults.headers.authorization = `Bearer ${params.access_token}`;
                // vai para url q tem no documentation
                const userInfo = await api.get('/users/@me');

                // pega o username faz um split no espaco e pega a primeira posicao [0]
                const firstName = userInfo.data.username.split(' ')[0];
            
                // busca a imagem com a hash e monta url (rota para pegar imagem)
                userInfo.data.avatar = `${CDN_IMAGE}/avatars/${userInfo.data.id}/${userInfo.data.avatar}.png`;

                setUser({
                    ...userInfo.data,
                    firstName,
                    token: params.access_token
                });

                setLoading(false);
            } else {
                setLoading(false);
            }

        } catch (error) {
            // lancar o erro para quem chamou
            throw new Error('Não foi possível autenticar!');
        }
    }
    
    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signIn
        }}>
            { children }
        </AuthContext.Provider>
    );
}

// criando meu próprio hook (useState, useEffect)
function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };