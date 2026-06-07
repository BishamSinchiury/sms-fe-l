let accessToken = null;

const getAccessToken = () => accessToken;

const setAccessToken = (token) => {
  accessToken = token;
};

const clearAccessToken = () => {
  accessToken = null;
};

const isAccessTokenValid = () => {
    if (!accessToken) return false;

    try{
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const tenSecondsFromNow = Date.now() / 1000 + 10;
        return payload.exp > tenSecondsFromNow;
    } catch{
        return false;
    }

}

export { getAccessToken, setAccessToken, clearAccessToken, isAccessTokenValid };