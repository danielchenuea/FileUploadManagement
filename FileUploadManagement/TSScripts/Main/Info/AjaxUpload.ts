import { RejectError } from "../../Models/Auth";

const controllerUrl = "/FileManager/";

export interface ArquivoArmazenado {
    GUID_ARQUIVO: string
    NOME_ARQUIVO: string
    TIPO_ARQUIVO: string
    MIMO_ARQUIVO: string
    DATA_INSERCAO: Date
    IMAGEM_FILE?: File
}

export default class AjaxUpload {
    /**
     * Função de Login, envia credenciais e retorna um token válido.
     * @param idAuth - Objeto que contêm Login e Senha
     * @returns Token de Authentication
     */
    static GetFileList(): Promise<ArquivoArmazenado[]> {
        return new Promise<ArquivoArmazenado[]>((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: controllerUrl + "GetUploadedList/",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                statusCode: {
                    200: function (response: ArquivoArmazenado[]) {
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
    static GetFile(guidFile: string): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: controllerUrl + "GetUploadedFile/" + guidFile,
                contentType: "image/*; charset=utf-8",
                statusCode: {
                    200: function (response: File) {
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
    static GetFileLink(guidFile: string): string { return controllerUrl + "GetUploadedFile/" + guidFile; }

    /**
     * Função de Login, envia credenciais e retorna um token válido.
     * @param idAuth - Objeto que contêm Login e Senha
     * @returns Token de Authentication
     */
    static PostFile(files: FormData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: controllerUrl + "UploadLargeFile/",
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