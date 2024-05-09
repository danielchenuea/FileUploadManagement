var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Cookies from "../Utils/Cookies.js";
import AjaxLogin from "../Info/AjaxLogin.js";
import AjaxAuth from "../Info/AjaxAuth.js";
const loadingDelay = 100;
$(document).on("keypress", function (e) {
    if (e.which === 13) {
        sendLogin();
    }
});
$("#enviar").on("click", function () {
    sendLogin();
});
function startLoading() {
    $("#loginText").fadeOut(loadingDelay, () => {
        $("#loginSpinner").fadeIn(loadingDelay);
    });
    $("#enviar").prop("disabled", true);
    $("#user").prop("disabled", true);
    $("#password").prop("disabled", true);
}
function exitLoading() {
    $("#loginSpinner").fadeOut(loadingDelay, () => {
        $("#loginText").fadeIn(loadingDelay);
    });
    $("#enviar").prop("disabled", false);
    $("#user").prop("disabled", false);
    $("#password").prop("disabled", false);
}
const sendLogin = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = $("#user").val();
        const pass = $("#password").val();
        const aviso = $("#aviso");
        if (user !== "" && pass !== "") {
            aviso.text("Carregando...");
            startLoading();
            const id_AUTH = {
                user: user.toUpperCase(),
                password: pass,
            };
            yield AjaxLogin.sendCredenciais(id_AUTH)
                .then((res) => {
                aviso.text("Login feito com sucesso. Redirecionando...");
                Cookies.setCookie("key", res.token, 1);
                setTimeout(() => {
                    exitLoading();
                    window.location.assign("/Gestao");
                }, 1000);
            })
                .catch((e) => {
                aviso.text(e.errorMessage);
                exitLoading();
            });
        }
        else {
            aviso.text("Digite suas credenciais.");
        }
    });
};
function onLoad() {
    return __awaiter(this, void 0, void 0, function* () {
        const key = Cookies.getCookie("key");
        yield AjaxAuth.checkToken(key, {
            beforeAuth: () => {
                startLoading();
            },
            afterSuccess: (res) => {
                setTimeout(() => {
                    $("#aviso").text("Login feito com sucesso. Redirecionando...");
                }, 100);
                setTimeout(() => {
                    exitLoading();
                    window.location.assign("/Gestao");
                }, 1000);
            },
            afterFailure: () => {
                Cookies.setCookie("key", "null");
                $("#aviso").text("Digite suas credenciais.");
                exitLoading();
            },
            catchExpection: () => {
                Cookies.setCookie("key", "null");
                $("#aviso").text("Digite suas credenciais.");
                exitLoading();
            }
        });
    });
}
$(function () {
    onLoad();
});
export const exportedForTesting = {
    sendLogin, onLoad
};
