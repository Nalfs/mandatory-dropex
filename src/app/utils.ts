import { dropboxConfig, DbxAuth } from './configs';

export function getParamFromUrl(param) {
    try {
        const sQueryString = document.URL.split('#')[1] || document.URL.split('?')[1] || '';
        const searchParams = new URLSearchParams(sQueryString);
        if (searchParams.has(param)) {
            return searchParams.get(param);
        } else {
            return '';
        }
    } catch (error) {
        return error;
    }
}

export function createObjFromParams() {
    try {
        const sQueryString = document.URL.split('#')[1] || document.URL.split('?')[1] || '';
        const referrerUrl = document.referrer;

        // This object's properties must be like the return URL from Dropbox API
        const objParams = { access_token: '',
                            token_type: '',
                            uid: '',
                            account_id: ''
                        };

        if (sQueryString && referrerUrl.startsWith(dropboxConfig.trustUrl)) {
            const arrParams = sQueryString.split('&');
            for (let i = 0; i < arrParams.length; i++) {
                const item = arrParams[i].split('=');
                for (const key of Object.keys(objParams)) {
                    if (key === item[0]) {
                        objParams[key] = item[1];
                    }
                }
            }
        }

        return objParams;
    } catch (error) {
        return error;
    }
}

export function storeCredentials(credentials: DbxAuth) {
    try {
        if (typeof(Storage) !== 'undefined') {
            const credentialsString = JSON.stringify(credentials);
            sessionStorage.setItem('dropexCredentials', credentialsString);
        }
    } catch (error) {
        return error;
    }
}

export function retrieveCredentials() {
    try {
        if (typeof(Storage) !== 'undefined' && sessionStorage.getItem('dropexCredentials')) {
            return JSON.parse(sessionStorage.getItem('dropexCredentials'));
        }
        return null;
    } catch (error) {
        return error;
    }
}

export function clearCredentials() {
    try {
        if (typeof(Storage) !== 'undefined' && sessionStorage.getItem('dropexCredentials')) {
            sessionStorage.removeItem('dropexCredentials');
        }
        return null;
    } catch (error) {
        return error;
    }
}
