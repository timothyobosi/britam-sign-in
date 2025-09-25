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
        console.warn('No serviceToken provided for verification');
        return false;
    }
    try {
        const decoded: any = jwtDecode(serviceToken);
        const isValid = decoded.exp > Date.now() / 1000;
        console.log(`Token verification - Token: ${serviceToken.slice(0, 10)}..., Valid: ${isValid}, Expires: ${new Date(decoded.exp * 1000)}`);
        return isValid;
    } catch (err) {
        console.error('Token verification failed:', err);
        return false;
    }
};

const setSession = (serviceToken: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
        console.log('Session set with token:', serviceToken.slice(0, 10), '...');
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
        console.log('Session cleared');
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
                    console.log('JWTContext initialized with user:', user);
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
                        console.error('Token found but not valid:', serviceToken.slice(0, 10), '...');
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
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            const { token, agentId, name, role } = response.data;
            setSession(token);
            const user = {
                agentId,
                name,
                role,
                email
            };
            console.log('Login successful, user:', user);
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user,
                    isInitialized: true
                }
            });
        } catch (err: any) {
            console.error('Login failed with error:', err);
            let errorMessage = 'Login failed';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message; // Extract message from response if available
            } else if (err.message) {
                errorMessage = err.message;
            }
            throw new Error(errorMessage);
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        const id = chance.bb_pin();
        try {
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
            console.log('Registration successful for email:', email);
        } catch (err) {
            console.error('Registration failed:', err);
            throw err;
        }
    };

    const logout = () => {
        setSession(null);
        // Clear all cached data
        localStorage.removeItem('sidebarSelection');
        localStorage.removeItem('formProgress');
        localStorage.removeItem('trainingModules_cache');
        localStorage.removeItem('analytics_scores');
        localStorage.removeItem('analytics_selectedModule');
        localStorage.removeItem('analytics_selectedAnswers');
        localStorage.removeItem('analytics_isSubmitted');
        for (let i = 1; i <= 4; i++) {
            localStorage.removeItem(`analytics_questions_${i}`);
            localStorage.removeItem(`audioProgress_${i}`);
        }
        console.log('Logged out, cleared all cached data');
        dispatch({ type: LOGOUT });
    };

    const resetPassword = async (email: string) => {
        try {
            await axios.post('/reset-password', { email });
            console.log('Password reset requested for email:', email);
        } catch (err) {
            console.error('Password reset failed:', err);
            throw err;
        }
    };

    const completeResetPassword = async (token: string, newPassword: string, email: string) => {
        try {
            await axios.post('/complete-reset-password', { token, newPassword, email });
            console.log('Password reset completed for email:', email);
        } catch (err) {
            console.error('Complete password reset failed:', err);
            throw err;
        }
    };

    const updateProfile = () => {
        console.log('Update profile called (not implemented)');
    };

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