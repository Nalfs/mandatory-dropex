// Configurations
export const dropboxConfig = {
    clientId: '#',
    redirectUri: '#',
    responseType: '#',
    trustUrl: 'https://www.dropbox.com'
};

export const dropboxApi = {
    'filesListFolderContinue': 'https://api.dropboxapi.com/2/files/list_folder/continue',
    'filesListFolderGetLatestCursor': 'https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor'
};

export const firebaseConfig = {
    production: false,
    firebase: {
        apiKey: '#',
        authDomain: '#',
        databaseURL: '#',
        projectId: '#',
        storageBucket: '#',
        messagingSenderId: '#'
    },
    listPath: '/dbxwebhooks',
    orderBy: 'list_folder/accounts/0'
};

// Constants
export interface DbxAuth {
    accessToken?: string;
    tokenType?: string;
    uid?: string;
    accountId?: string;
    isAuth?: boolean;
}
