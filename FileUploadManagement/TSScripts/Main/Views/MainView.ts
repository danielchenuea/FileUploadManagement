﻿import AjaxUpload, { ArquivoArmazenado } from "../Info/AjaxUpload.js";
import Base64Utils from "../Utils/Base64Utils.js";
import Gerador_CarrosselImagem from "../Utils/Gerador_CarrosselMidiaGenerico.js";

let fileList: FileList | undefined = undefined;

const geradorCarrossel = new Gerador_CarrosselImagem({
    idDiv: "carroselImagens"
}).Generate();

let listArq: ArquivoArmazenado[] = [];

$(`#uploadFiles`).on("change", function (e: JQuery.ChangeEvent) {
    Base64Utils.ConvertToBase64(e, ((res) => {
        if (res) {
            console.log(res);
            fileList = res
        }
    }));
});
$(`#submitFiles`).on("click", function (e: JQuery.ClickEvent) {
    if (fileList) {
        const formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            formData.append(i.toString(), fileList.item(i)!, fileList.item(i)!.name)
        }

        AjaxUpload.PostFile(formData).then(res => {
        });
    }
});

$(`#modalFiles`).on("click", function (e: JQuery.ClickEvent) {
    geradorCarrossel.AbrirModal({
        basicMidia: listArq
    });
});

$(function () {
    AjaxUpload.GetFileList().then(res => {
        listArq = res;
    })
});