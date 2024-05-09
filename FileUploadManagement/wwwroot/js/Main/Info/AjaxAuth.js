var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import StringValido from "../Utils/StringValido.js";
export const ForbiddenError = {
    error: true,
    responseCode: 403,
    errorMessage: "Forbidden. Você não possui permissão para realizar esta ação"
};
export default class AjaxAuth {
    static authKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: "/api/auth/token",
                    data: JSON.stringify({ token: key }),
                    contentType: "application/json",
                    dataType: "json",
                    statusCode: {
                        200: function (response) {
                            return resolve(JSON.parse(response));
                        },
                        204: function (response) {
                            return resolve(JSON.parse(response));
                        },
                        400: function (xhr) {
                            return reject(xhr.responseJSON);
                        },
                        401: function (xhr) {
                            return reject(xhr.responseJSON);
                        },
                        404: function (xhr) {
                            return reject(xhr.responseJSON);
                        },
                        500: function (res) {
                            return reject(res.responseJSON);
                        }
                    }
                });
            });
        });
    }
    static checkToken(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (StringValido.IsStringAllValid(key)) {
                if (options && options.beforeAuth)
                    options.beforeAuth();
                yield this.authKey(key)
                    .then((response) => {
                    if (response.Ok === "true") {
                        if (options && options.userRole) {
                            if (Array.isArray(options.userRole) && options.userRole.some(el => response[el] === "S") || response["ADMIN"] === "S") {
                                if (options && options.afterSuccess)
                                    options.afterSuccess(response);
                            }
                            else if (!Array.isArray(options.userRole) && response[options.userRole] === "S" || response["ADMIN"] === "S") {
                                if (options && options.afterSuccess)
                                    options.afterSuccess(response);
                            }
                            else {
                                if (options && options.afterFailure)
                                    options.afterFailure();
                            }
                        }
                        else {
                            if (options && options.afterSuccess)
                                options.afterSuccess(response);
                        }
                    }
                    else {
                        if (options && options.afterFailure)
                            options.afterFailure();
                    }
                })
                    .catch((e) => {
                    if (options && options.catchExpection)
                        options.catchExpection(e);
                });
            }
            else {
                if (options && options.afterFailure)
                    options.afterFailure();
            }
        });
    }
}
