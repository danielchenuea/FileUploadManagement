
import { RejectError } from "../../Models/Auth"
import StringValido from "../Utils/StringValido.js"

export interface AuthPromiseReturn {
    ADMIN: string
    IMPLEMENTACAO: string
    CADASTRO: string
    CONTROLLER: string
    PRODUTOS: string
    SUPORTE: string
    NomeUsuario: string
    Ok: string
    Perfil: string
    Usuario: string
    Token: string
    Auth: string
    TipoUsuario: string
    Setor: string
    aud: string
    exp: string
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string
    iss: string
    [key: string]: string;
}

interface CheckTokenOptions {
    userRole?: string | string[]
    beforeAuth?: () => void
    afterSuccess?: (response: AuthPromiseReturn) => void
    afterFailure?: () => void
    catchExpection?: (ex: RejectError) => void
}

export const ForbiddenError: RejectError = {
    error: true,
    responseCode: 403,
    errorMessage: "Forbidden. Você não possui permissão para realizar esta ação"
}

export default class AjaxAuth {

    /**
     * Função que verifica o status do token passado. Baseado nesse status, uma função de ações pode ser executada
     * @param key - Token a ser verificado.
     * @returns Promessa de autentificação.
     */
    static async authKey(key: string): Promise<AuthPromiseReturn> {
        return new Promise<AuthPromiseReturn>((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/api/auth/token",
                data: JSON.stringify({ token: key }),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    200: function (response: string) {
                        return resolve(JSON.parse(response) as AuthPromiseReturn);
                    },
                    204: function (response: string) {
                        return resolve(JSON.parse(response) as AuthPromiseReturn);
                    },
                    400: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError);
                    },
                    401: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError);
                    },
                    404: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError);
                    },
                    500: function (res: JQuery.jqXHR) {
                        return reject(res.responseJSON as RejectError)
                    }
                }
            })
        })
    }

    static async checkToken(key: string, options?: CheckTokenOptions): Promise<void> {

        if (StringValido.IsStringAllValid(key)) {
            if (options && options.beforeAuth) options.beforeAuth();
        
            await this.authKey(key)
                .then((response) => {
                    if (response.Ok === "true") {

                        if (options && options.userRole) {

                            if (Array.isArray(options.userRole) && options.userRole.some(el => response[el] === "S") || response["ADMIN"] === "S") {

                                if (options && options.afterSuccess) options.afterSuccess(response);

                            }
                            else if (!Array.isArray(options.userRole) && response[options.userRole] === "S" || response["ADMIN"] === "S") {

                                if (options && options.afterSuccess) options.afterSuccess(response);

                            } else {

                                if (options && options.afterFailure) options.afterFailure();

                            }
                        } else {

                            if (options && options.afterSuccess) options.afterSuccess(response);

                        }
                        
                    } else {

                        if (options && options.afterFailure) options.afterFailure();

                    }
                })
                .catch((e: RejectError) => {

                    if (options && options.catchExpection) options.catchExpection(e);

                });
        } else {
            if (options && options.afterFailure) options.afterFailure();
        }
    }
}