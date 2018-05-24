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
        const trustUrl = 'https://www.dropbox.com';

        // This object's properties must be like the return URL from Dropbox API
        const objParams = {
            access_token: '',
            token_type: '',
            uid: '',
            account_id: ''
        };

        if (sQueryString && referrerUrl.substring(0, trustUrl.length) === trustUrl) {
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
