/** URLパラメータ取得ユーティリティ */
export const getUrlParams = (): Record<string, string> => {
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    params.forEach((value, key) => {
        obj[key.toLowerCase()] = value;
    });
    return obj;
};
