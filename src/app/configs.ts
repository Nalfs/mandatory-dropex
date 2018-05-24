// Configurations
export const dropboxConfig = {
    clientId: 'tefcr0lybxy6atz',
    redirectUri: 'http://localhost:4200/auth',
    responseType: 'token',
    trustUrl: 'https://www.dropbox.com'
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
    accountId?: string;
    isAuth?: boolean;
}
