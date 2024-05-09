import { RejectError } from "../../Models/Auth";

export interface LoginCredentials {
    user: string
    password: string
}

export interface LoginResponse {
    auth: string
    setor: string
    token: string
    tpUsuario: string
    usuario: string
}

export default class AjaxUpload {
    /**
     * Função de Login, envia credenciais e retorna um token válido.
     * @param idAuth - Objeto que contêm Login e Senha
     * @returns Token de Authentication
     */
    static GetFile(): Promise<LoginResponse> {
        return new Promise<LoginResponse>((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/GetUploadedFile/Bra",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                statusCode: {
                    200: function (response: LoginResponse) {
                        return resolve(response);
                    },
                    400: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError)
                    },
                    401: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError)
                    },
                    404: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError)
                    },
                    500: function (res: JQuery.jqXHR) {
                        return reject(res.responseJSON as RejectError)
                    }
                }
            });
        })
    }
    /**
     * Função de Login, envia credenciais e retorna um token válido.
     * @param idAuth - Objeto que contêm Login e Senha
     * @returns Token de Authentication
     */
    static PostFile(files: FormData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/FileManager/UploadLargeFile",
                //contentType: "multipart/form-data; boundary=--123123123--",
                data: files,
                //dataType: "json",
                processData: false,
                contentType: false,
                statusCode: {
                    200: function (response: void) {
                        return resolve();
                    },
                    400: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError)
                    },
                    401: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError)
                    },
                    404: function (xhr: JQuery.jqXHR) {
                        return reject(xhr.responseJSON as RejectError)
                    },
                    500: function (res: JQuery.jqXHR) {
                        return reject(res.responseJSON as RejectError)
                    }
                }
            });
        })
    }
}