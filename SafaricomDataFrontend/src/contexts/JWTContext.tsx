import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
const BASE_URL = import.meta.env.VITE_API_TARGET + import.meta.env.VITE_API_BASE_URL;
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

const chance = new Chance();

// constant
interface UserType {
    agentId?: string;
    [key: string]: any;
}

interface StateType {
    isLoggedIn: boolean;
    isInitialized: boolean;
    user: UserType | null;
}

const initialState: StateType = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken: string) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: any = jwtDecode(serviceToken);
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<StateType & {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    completeResetPassword: (token: string, newPassword: string, email: string) => Promise<void>;
    updateProfile: () => void;
} | null>(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    // Decode agent info from JWT
                    const decoded: any = jwtDecode(serviceToken);
                    const user = {
                        agentId: decoded.AgentId,
                        name: decoded.Name,
                        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role,
                        email: decoded.sub
                    };
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user,
                            isInitialized: true
                        }
                    });
                } else {
                    if (!serviceToken) {
                        console.error('No serviceToken found in localStorage');
                    } else {
                        console.error('Token found but not valid:', serviceToken);
                    }
                    dispatch({
                        type: LOGOUT,
                        payload: { isInitialized: true, user: null, isLoggedIn: false }
                    });
                }
            } catch (err) {
                console.error('JWTContext init error:', err);
                dispatch({
                    type: LOGOUT,
                    payload: { isInitialized: true, user: null, isLoggedIn: false }
                });
            }
        };
        init();
    }, []);

    const login = async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
        const { token, agentId, name, role } = response.data;
        setSession(token);
        const user = {
            agentId,
            name,
            role,
            email
        };
        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user,
                isInitialized: true
            }
        });
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        // NOTE: Your API docs don’t show register for Agents,
        // so this may not work unless backend supports it.
        const id = chance.bb_pin();
        const response = await axios.post('/register', {
            id,
            email,
            password,
            firstName,
            lastName
        });

        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers),
                {
                    id,
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
    setSession(null);
    // Clear sidebar selection and form progress persistence
    localStorage.removeItem('sidebarSelection');
    localStorage.removeItem('formProgress');
    dispatch({ type: LOGOUT });
    };

    const resetPassword = async (email: string) => {
        await axios.post('/reset-password', { email });
    };

    const completeResetPassword = async (token: string, newPassword: string, email: string) => {
        await axios.post('/complete-reset-password', { token, newPassword, email });
    };

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider
            value={{
                ...state,
                login,
                logout,
                register,
                resetPassword,
                completeResetPassword,
                updateProfile
            }}
        >
            {children}
        </JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
