export interface AuthData {
    email:string;
    password:string;
}

export interface User {
    userId: string;
    isAuthenticated: boolean;
    token: string;
    //tokenTimer: any;
}