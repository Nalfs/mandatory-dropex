// Configurations
export const dropboxConfig = {
    clientId: 'tefcr0lybxy6atz',
    redirectUri: 'https://ec-dropex.firebaseapp.com/auth:now',
    responseType: 'token',
    trustUrl: 'https://www.dropbox.com'
};

export const dropboxApi = {
    'filesListFolderContinue': 'https://api.dropboxapi.com/2/files/list_folder/continue',
    'filesListFolderGetLatestCursor': 'https://api.dropboxapi.com/2/files/list_folder/get_latest_cursor'
};

export const firebaseConfig = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyAfwHE20PEcAAAHLCav6T8pvBx_DVmpX2A',
        authDomain: 'angular-dropbox-webhooks.firebaseapp.com',
        databaseURL: 'https://angular-dropbox-webhooks.firebaseio.com',
        projectId: 'angular-dropbox-webhooks',
        storageBucket: 'angular-dropbox-webhooks.appspot.com',
        messagingSenderId: '425496205859'
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
