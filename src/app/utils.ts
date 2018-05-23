export function getParamFromUrl(param) {
    try {
        const sQueryString = document.URL.split('#')[1] || document.URL.split('?')[1];
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
