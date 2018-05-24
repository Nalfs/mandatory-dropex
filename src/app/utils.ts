import { dropboxConfig } from './configs';

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
