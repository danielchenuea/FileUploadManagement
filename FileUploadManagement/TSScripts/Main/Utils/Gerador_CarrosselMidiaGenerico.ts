import { RejectError } from "../../Models/Auth";
import AjaxUpload, { ArquivoArmazenado } from "../Info/AjaxUpload.js";
import SweetAlert from "./SweetAlertCommands.js";


interface BasicMidiaInfoList { }

/** 
 * Interface utilizada para o construtor do Gerador de Carrosel. Utilizado na lista de hoteis.
 */
export interface CarrosselImagemOptions {
    idDiv: string   
}

export interface AbrirModalOptions {
    basicMidia: BasicMidiaInfoList
}

export interface AbrirModalOptions2 {
    basicMidia: ArquivoArmazenado[]
}

export default class Gerador_CarrosselImagem {
    idDiv: string;

    listaMidia?: ArquivoArmazenado[]
    arrayImagens: File[] = []

    fadeInDelay = 200;
    fadeOutDelay = 200;

    basicMidiaList?: BasicMidiaInfoList;

    loadingPage: boolean = false;

    loadEveryImage: boolean = false;
    imagesPerLoad = 3;
    paginaAtual = 0;
    n_paginas_total = 0;

    idModalLabel: string = "";
    idModalCloseButton: string = "";

    idBotaoEsquerda: string = "";
    idBotaoDireita: string = "";
    idBotaoDisplay: string = "";

    idMidiaDiv: string = "";
    idMidiaDisplay: string = "";
    idMidiaIcon: string = "";

    idImagemDiv: string = "";
    idImagemDisplay: string = "";
    idImagemNome: string = "";
    idValidade: string = "";

    idModalLoading: string = "";


    constructor(options: CarrosselImagemOptions) {
        this.idDiv = options.idDiv;

        this.idModalLabel = `${this.idDiv}_modalLabel_Carrossel`;
        this.idModalCloseButton = `${this.idDiv}_closeButton_Carrosseel`;

        this.idBotaoEsquerda = `${this.idDiv}_botaoSetaEsquerda_Carrossel`;
        this.idBotaoDireita = `${this.idDiv}_botaoSetaDireita_Carrossel`;
        this.idBotaoDisplay = `${this.idDiv}_botaoSetaDisplay_Carrossel`;

        this.idMidiaDiv = `${this.idDiv}_divCarrosselMidia`;
        this.idMidiaDisplay = `${this.idDiv}_displayCarrosselMidia`;
        this.idMidiaIcon = `${this.idDiv}_iconCarrosselMidia`;

        this.idImagemDiv = `${this.idDiv}_CarrosselImagemDiv`;
        this.idImagemDisplay = `${this.idDiv}_displayCarrosselImagem`;
        this.idImagemNome = `${this.idDiv}_nomeCarrosselImagem`;
        this.idValidade = `${this.idDiv}_validadeArquivo`;

        this.idModalLoading = `${this.idDiv}_ModalLoading`;
    }

    /**
     * Função principal que utiliza das configurações para gerar HTML e Javascript útil para ser utilizado.
     * Essa função automaticamente coloca o conteúdo gerado dentro dentro do Div definido dentro das configurações.
     */
    Generate() {
        const div = document.querySelector("main");

        if (div) {

            const mainModalDiv = document.createElement("div");
            mainModalDiv.classList.add("modalDiv");
            mainModalDiv.id = this.idDiv;
            mainModalDiv.setAttribute("tabindex", "-1");
            mainModalDiv.setAttribute("role", "dialog");
            mainModalDiv.setAttribute("aria-hidden", "true");
            mainModalDiv.style.display = "none";

            mainModalDiv.innerHTML = `
                <div class="modal-dialog" role="document">
                    <div class="modalContentLoading" id="${this.idModalLoading}">
                        <i class="fa-solid fa-spinner fa-spin fa-xl"></i>
                    </div>
                    <div class="modal-content modalContent">
                        <div class="modal-header">
                            <h5 class="modal-title" id="${this.idModalLabel}">Carrossel de Mídia</h5>
                            <button type="button" id="${this.idModalCloseButton}" class="closeButton" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" style="width: 12px; height: 12px">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body modalBody">
                            <div class="carrosselImagemDiv">
                                <div class="carrosselContent">
                                    <div class="iconButtonWrapper" id="${this.idMidiaDiv}">
                                        <div class="iconButton" id="${this.idMidiaDisplay}">
                                            <i class="fa-regular fa-file-pdf fa-3x" id="${this.idMidiaIcon}"></i>
                                        </div>
                                    </div>
                                    <div class="botaoSetaDisplayPage" id="${this.idImagemDiv}" style="display: none">
                                        <img id="${this.idImagemDisplay}" src="" />
                                    </div>
                                </div>
                                <div class="nameDiv">
                                    <span id="${this.idImagemNome}"></span>
                                </div>
                                <div class="nameDiv">
                                    <span id="${this.idValidade}"></span>
                                </div>
                                <div class="carrosselDiv">
                                    <div class="botaoSeta disabled" id="${this.idBotaoEsquerda}">
                                        <i class="fa fa-arrow-left"></i>
                                    </div>
                                    <div class="botaoDisplayPage">
                                        <span id="${this.idBotaoDisplay}">1 de 1</span>
                                    </div>
                                    <div class="botaoSeta disabled" id="${this.idBotaoDireita}">
                                        <i class="fa fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            div.appendChild(mainModalDiv);
            this.JQueryOnPress();
            this.JQueryOnLoad();
            return this;
        }
        return this;
    }

    /**
     * Função que Configura os JQuery a serem utilizados pela classe.
     * - Clicar no Fora do Modal faz o Modal se fechar.
     * - Clicar no Modal impede que ele se feche.
     */
    private JQueryOnLoad() {
        $(`#${this.idDiv},#fecharModal,#${this.idModalCloseButton}`).on("click", () => {
            if (this.loadingPage) return;
            this.FecharModal();
        })

        $(".modalContent").on("click", function (e) {
            e.stopPropagation();
        })
    }

    /**
     * Função que Configura os JQuery a serem utilizados pela classe.
     * - Quando pressionar o Botão, decidir se a Página irá voltar.
     * - Quando pressionar o Botão, decidir se a Página irá avançar.
     * - Quando pressionar o Botão, abrir o arquivo se for uma imagem.
     * - Quando pressionar o Botão, abrir o arquivo se for um PDF.
     */
    private JQueryOnPress() {
        $(`#${this.idBotaoEsquerda}`).on("click", () => {
            if (this.loadingPage) return;
            if (!$(`#${this.idBotaoEsquerda}`).hasClass("disabled")) {
                this.VoltarPagina();
            }
        });
        $(`#${this.idBotaoDireita}`).on("click", () => {
            if (this.loadingPage) return;
            if (!$(`#${this.idBotaoDireita}`).hasClass("disabled")) {
                this.ProximaPagina();
            }
        });

        //$(`#${this.idImagemDisplay}`).on("click", () => {
        //    if (this.loadingPage) return;
        //    if (this.listaMidia) {
        //        this.AbrirImagem(this.listaMidia[this.paginaAtual].MIDIA_CLOB);
        //    }
        //});

        //$(`#${this.idMidiaDisplay}`).on("click", () => {
        //    if (this.loadingPage) return;
        //    if (this.listaMidia) {
        //        switch (this.listaMidia[this.paginaAtual].MIDIA_TIPO_ARQUIVO) {
        //            case "pdf":
        //                this.AbrirPDF(this.listaMidia[this.paginaAtual].MIDIA_CLOB, this.listaMidia[this.paginaAtual].MIDIA_NOME);
        //                break;

        //        };
        //    }
        //});
    }

    /**
     * Função para Abrir uma Imagem.
     * Pega uma string Base64 e mostra ele em uma página a parte.
     * @param base64MidiaImagem
     */
    private AbrirImagem(base64MidiaImagem: string) {
        var image = new Image();
        image.src = base64MidiaImagem;
        var w = window.open("");
        if (w) {
            w.document.write(
                `<html><head><title></title></head><body style='margin: 0; padding: 0; overflow: scroll'>${image.outerHTML}</body></html>`
            );
        }
    }

    ///**
    // * Função para Abrir um PDF.
    // * Pega uma string Base64 e mostra ele em uma página a parte.
    // * @param base64pdf
    // * @param titulo
    // */
    //private AbrirPDF(base64pdf: string, titulo: string) {
    //    const strippedBase64 = base64pdf.substring(base64pdf.indexOf(",") + 1)

    //    const blob = new Blob([Base64Utils.B64toBlob(strippedBase64)], { type: 'application/pdf' });

    //    const fileURL = URL.createObjectURL(blob);
    //    let pdfWindow = window.open("");
    //    setTimeout(() => {
    //        if (pdfWindow) {
    //            pdfWindow.document.write(`
    //                <html><head><title>${titulo}</title></head><body style='margin: 0; padding: 0'>
    //                <iframe style='width: calc(100% - 4px); height: calc(100% - 4px)' src='${encodeURI(fileURL)}#toolbar=0'></iframe>
    //                </body></html>
    //            `)
    //            pdfWindow.document.title = titulo;
    //        }
    //    }, 0)
    //}

    ProximaPagina() {
        this.ManipularPagina(1);
    }
    VoltarPagina() {
        this.ManipularPagina(-1);
    }

    ManipularPagina(pagina: -1 | 0 | 1) {
        if (this.listaMidia === undefined) return;

        $(`#${this.idBotaoEsquerda}`).removeClass("disabled");
        $(`#${this.idBotaoDireita}`).removeClass("disabled");

        if (pagina == 0) this.paginaAtual = 0;

        const novaPagina = this.paginaAtual + pagina;

        if (novaPagina < 0) return;
        if (novaPagina >= this.n_paginas_total) return;
        if (novaPagina == 0) $(`#${this.idBotaoEsquerda}`).addClass("disabled");
        if (novaPagina >= this.n_paginas_total - 1) $(`#${this.idBotaoDireita}`).addClass("disabled");

        this.paginaAtual = novaPagina;

        //if (this.listaMidia![novaPagina].IMAGEM_FILE == undefined) {
        //    this.StartLoading();
        //    const qtImagensAntigas = this.listaMidia.length;
        //    const novasImagens = this.imagesPerLoad;

        //    AjaxUpload.GetFile(this.listaMidia![novaPagina].GUID_ARQUIVO).then(res => {

        //        console.log(res)
        //        this.listaMidia![novaPagina].IMAGEM_FILE = res;
        //        //this.listaMidia = this.listaMidia!.concat(res)

        //        this.ManipularInfoPagina(novaPagina);
        //        this.EndLoading();

        //    })
        //} else {
        //}
        this.ManipularInfoPagina(novaPagina);
        //if (this.listaMidia![novaPagina] == undefined) {

        //} else {
        //}
    }

    private ManipularInfoPagina(novaPagina: number) {

        const classThis = this;

        $(`#${this.idBotaoDisplay}`).text(`${novaPagina + 1} de ${this.n_paginas_total}`);
        $(`#${this.idImagemNome}`).fadeOut(100, function () {
            $(this).text(classThis.listaMidia![novaPagina].NOME_ARQUIVO).fadeIn(100);
        });

        $(`#${this.idMidiaDiv}:not(:hidden),#${this.idImagemDiv}:not(:hidden)`).fadeOut({
            duration: 100,
            complete: () => {
                $(`#${this.idImagemDisplay}`).attr("src", AjaxUpload.GetFileLink(this.listaMidia![novaPagina].GUID_ARQUIVO!));
                $(`#${this.idImagemDiv}`).css({ opacity: "1" }).fadeIn(100);
            }
        })
    }

    private ResetPagina() {
        $(`#${this.idMidiaDiv},#${this.idImagemDiv}`).css({ opacity: "0" })
        $(`#${this.idBotaoDisplay}`).text(`1 de 1`);
        $(`#${this.idImagemNome}`).text("");
        $(`#${this.idValidade}`).text("").removeClass();
    }

    private StartLoading() {
        $(`#${this.idModalLoading}`).fadeIn(this.fadeInDelay);
        this.loadingPage = true;
    }
    private EndLoading() {
        $(`#${this.idModalLoading}`).fadeOut(this.fadeInDelay);
        this.loadingPage = false;

    }

    /**
     * Função que executa a rotina de abrir o Modal. Baseado nas opções que abrir o Modal.
     * O Modo Normal é utilizado quando o usuário já possui as imagens.
     */
    AbrirModal(options: AbrirModalOptions2) {
        this.ResetPagina()

        $(`#${this.idDiv}`).fadeIn(this.fadeInDelay);
        this.StartLoading();

        this.listaMidia = options.basicMidia;
        this.n_paginas_total = options.basicMidia.length;
        this.ManipularPagina(0);
        this.EndLoading();
    }

    /**
     * Função que executa a função de fechar o Modal.
     */
    FecharModal() {
        $(`#${this.idDiv}`).fadeOut(this.fadeOutDelay, () => {
            //this.ResetSelected();
        });
    }
}