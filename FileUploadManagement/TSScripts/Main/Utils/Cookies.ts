import DateTimeTS from "./DateTimeTS.js";

/**
 * Classe que reúne funções de manipução de Cookies
 */
export default class Cookies {

    /**
     * Função que define um Cookie a ser colocado em memória
     * @param cookieName - Nome do Cookie a ser colocado.
     * @param cookieValue - Valor do Cookie a ser colocado.
     * @param exdays - Numero de dias até expirar o Cookie.
     */
    static setCookie(cookieName: string, cookieValue: string, exdays = 1): void {
        const d = new DateTimeTS().SetDateNow().AddDays(exdays);
        const expires = "expires=" + d.ToUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }

    /**
     * Pegar o Cookie guardado em memória.
     * @param cookieName - Nome do Cookie a ser resgatado.
     * @returns - Valor do Cookie resgatado.
     */
    static getCookie(cookieName : string) : string {
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
