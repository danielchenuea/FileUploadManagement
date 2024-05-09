import DateTimeTS from "./DateTimeTS.js";
export default class Cookies {
    static setCookie(cookieName, cookieValue, exdays = 1) {
        const d = new DateTimeTS().SetDateNow().AddDays(exdays);
        const expires = "expires=" + d.ToUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }
    static getCookie(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}
