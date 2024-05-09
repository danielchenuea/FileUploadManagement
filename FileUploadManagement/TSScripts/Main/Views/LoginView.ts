import Cookies from "../Utils/Cookies.js";

import AjaxLogin, { LoginResponse } from "../Info/AjaxLogin.js";
import AjaxAuth from "../Info/AjaxAuth.js";
import { RejectError } from "../../Models/Auth.js";

const loadingDelay = 100;

$(document).on("keypress", function (e) {
    if (e.which === 13) {
        sendLogin();
    }
});
$("#enviar").on("click", function () {
    sendLogin();
});

function startLoading(): void {
    $("#loginText").fadeOut(loadingDelay, () => {
        $("#loginSpinner").fadeIn(loadingDelay);
    });
    $("#enviar").prop("disabled", true);
    $("#user").prop("disabled", true);
    $("#password").prop("disabled", true);
}
function exitLoading(): void {
    $("#loginSpinner").fadeOut(loadingDelay, () => {
        $("#loginText").fadeIn(loadingDelay);
    });
    $("#enviar").prop("disabled", false);
    $("#user").prop("disabled", false);
    $("#password").prop("disabled", false);
}

// Função para enviar credenciais e retornar um token
const sendLogin = async function () {
    const user = <string>$("#user").val();
    const pass = <string>$("#password").val();

    const aviso = $("#aviso")!;

    if (user !== "" && pass !== "") {
        aviso.text("Carregando...");
        startLoading();

        // Usuario deve ser em maisculo por causa do oracle
        const id_AUTH = {
            user: user.toUpperCase(),
            password: pass,
        };
        //$.LoadingOverlay("show");
        await AjaxLogin.sendCredenciais(id_AUTH)
            .then((res: LoginResponse) => {
                aviso.text("Login feito com sucesso. Redirecionando...");
                Cookies.setCookie("key", res.token, 1);
                setTimeout(() => {
                    exitLoading();
                    window.location.assign("/Gestao");
                }, 1000)
            })
            .catch((e: RejectError) => {
                aviso.text(e.errorMessage);
                exitLoading();
            });

    } else {
        aviso.text("Digite suas credenciais.");
    }
};

async function onLoad() {
    const key = Cookies.getCookie("key");
    await AjaxAuth.checkToken(key, {
        beforeAuth: () => {
            startLoading();
        },
        afterSuccess: (res) => {
            setTimeout(() => {
                $("#aviso")!.text("Login feito com sucesso. Redirecionando...");
            }, 100)
            setTimeout(() => {
                exitLoading();
                window.location.assign("/Gestao");
            }, 1000)
        },
        afterFailure: () => {
            Cookies.setCookie("key", "null");
            $("#aviso")!.text("Digite suas credenciais.");
            exitLoading();
        },
        catchExpection: () => {
            Cookies.setCookie("key", "null");
            $("#aviso")!.text("Digite suas credenciais.");
            exitLoading();
        }
    });
}

$(function () {
    onLoad();
});

export const exportedForTesting = {
    sendLogin, onLoad
}