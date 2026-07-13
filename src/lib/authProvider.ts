import { AuthProvider } from 'react-admin';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const authProvider: AuthProvider = {
    login: async ({ username }) => {
        // Para ambiente local, aceita o email de administrador cadastrado.
        // Se não tiver o prefixo "mock:", nós o adicionamos automaticamente.
        const idToken = username.startsWith('mock:') ? username : `mock:${username}`;

        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ idToken }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Falha na autenticação');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            return Promise.resolve();
        }

        throw new Error('Token não retornado pelo servidor');
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return Promise.resolve();
    },
    
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    
    checkAuth: () => {
        return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
    },
    
    getPermissions: () => Promise.resolve(),
    
    getIdentity: () => {
        const username = localStorage.getItem('username') || 'Administrador';
        return Promise.resolve({
            id: 'admin',
            fullName: username,
        });
    },
};
