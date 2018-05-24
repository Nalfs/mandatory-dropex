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
        const objParams = {
            access_token: '',
            token_type: '',
            uid: '',
            account_id: ''
        };

        if (sQueryString) {
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
