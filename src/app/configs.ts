// Configurations
export const dropboxConfig = {
    clientId: 'tefcr0lybxy6atz',
    redirectUri: 'http://localhost:4200/auth',
    responseType: 'token'
};

export const firestoreConfig = {
    apiKey: '#',
    authDomain: '#',
    projectId: '#'
};

// Constants
export interface DbxAuth {
    accessToken?: string;
    tokenType?: string;
    uid?: string;
    accountId?: number;
    isAuth?: boolean;
}
