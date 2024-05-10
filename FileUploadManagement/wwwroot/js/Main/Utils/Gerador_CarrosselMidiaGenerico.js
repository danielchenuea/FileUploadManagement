import AjaxUpload from "../Info/AjaxUpload.js";
export default class Gerador_CarrosselImagem {
    constructor(options) {
        this.arrayImagens = [];
        this.fadeInDelay = 200;
        this.fadeOutDelay = 200;
        this.loadingPage = false;
        this.loadEveryImage = false;
        this.imagesPerLoad = 3;
        this.paginaAtual = 0;
        this.n_paginas_total = 0;
        this.idModalLabel = "";
        this.idModalCloseButton = "";
        this.idBotaoEsquerda = "";
        this.idBotaoDireita = "";
        this.idBotaoDisplay = "";
        this.idMidiaDiv = "";
        this.idMidiaDisplay = "";
        this.idMidiaIcon = "";
        this.idImagemDiv = "";
        this.idImagemDisplay = "";
        this.idImagemNome = "";
        this.idValidade = "";
        this.idModalLoading = "";
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
    JQueryOnLoad() {
        $(`#${this.idDiv},#fecharModal,#${this.idModalCloseButton}`).on("click", () => {
            if (this.loadingPage)
                return;
            this.FecharModal();
        });
        $(".modalContent").on("click", function (e) {
            e.stopPropagation();
        });
    }
    JQueryOnPress() {
        $(`#${this.idBotaoEsquerda}`).on("click", () => {
            if (this.loadingPage)
                return;
            if (!$(`#${this.idBotaoEsquerda}`).hasClass("disabled")) {
                this.VoltarPagina();
            }
        });
        $(`#${this.idBotaoDireita}`).on("click", () => {
            if (this.loadingPage)
                return;
            if (!$(`#${this.idBotaoDireita}`).hasClass("disabled")) {
                this.ProximaPagina();
            }
        });
    }
    AbrirImagem(base64MidiaImagem) {
        var image = new Image();
        image.src = base64MidiaImagem;
        var w = window.open("");
        if (w) {
            w.document.write(`<html><head><title></title></head><body style='margin: 0; padding: 0; overflow: scroll'>${image.outerHTML}</body></html>`);
        }
    }
    ProximaPagina() {
        this.ManipularPagina(1);
    }
    VoltarPagina() {
        this.ManipularPagina(-1);
    }
    ManipularPagina(pagina) {
        if (this.listaMidia === undefined)
            return;
        $(`#${this.idBotaoEsquerda}`).removeClass("disabled");
        $(`#${this.idBotaoDireita}`).removeClass("disabled");
        if (pagina == 0)
            this.paginaAtual = 0;
        const novaPagina = this.paginaAtual + pagina;
        if (novaPagina < 0)
            return;
        if (novaPagina >= this.n_paginas_total)
            return;
        if (novaPagina == 0)
            $(`#${this.idBotaoEsquerda}`).addClass("disabled");
        if (novaPagina >= this.n_paginas_total - 1)
            $(`#${this.idBotaoDireita}`).addClass("disabled");
        this.paginaAtual = novaPagina;
        this.ManipularInfoPagina(novaPagina);
    }
    ManipularInfoPagina(novaPagina) {
        const classThis = this;
        $(`#${this.idBotaoDisplay}`).text(`${novaPagina + 1} de ${this.n_paginas_total}`);
        $(`#${this.idImagemNome}`).fadeOut(100, function () {
            $(this).text(classThis.listaMidia[novaPagina].NOME_ARQUIVO).fadeIn(100);
        });
        $(`#${this.idMidiaDiv}:not(:hidden),#${this.idImagemDiv}:not(:hidden)`).fadeOut({
            duration: 100,
            complete: () => {
                $(`#${this.idImagemDisplay}`).attr("src", AjaxUpload.GetFileLink(this.listaMidia[novaPagina].GUID_ARQUIVO));
                $(`#${this.idImagemDiv}`).css({ opacity: "1" }).fadeIn(100);
            }
        });
    }
    ResetPagina() {
        $(`#${this.idMidiaDiv},#${this.idImagemDiv}`).css({ opacity: "0" });
        $(`#${this.idBotaoDisplay}`).text(`1 de 1`);
        $(`#${this.idImagemNome}`).text("");
        $(`#${this.idValidade}`).text("").removeClass();
    }
    StartLoading() {
        $(`#${this.idModalLoading}`).fadeIn(this.fadeInDelay);
        this.loadingPage = true;
    }
    EndLoading() {
        $(`#${this.idModalLoading}`).fadeOut(this.fadeInDelay);
        this.loadingPage = false;
    }
    AbrirModal(options) {
        this.ResetPagina();
        $(`#${this.idDiv}`).fadeIn(this.fadeInDelay);
        this.StartLoading();
        this.listaMidia = options.basicMidia;
        this.n_paginas_total = options.basicMidia.length;
        this.ManipularPagina(0);
        this.EndLoading();
    }
    FecharModal() {
        $(`#${this.idDiv}`).fadeOut(this.fadeOutDelay, () => {
        });
    }
}
