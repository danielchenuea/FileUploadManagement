//import swal from 'sweetalert';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let swal: any;

export default class SweetAlert {
    /**
     * Retorna um sweetAlert de Sucesso.
     * @param mensagem - Mensagem a ser colocada
     * @returns Promise
     */
    static AlertaSucesso(mensagem : string) : Promise<void> {
        return swal({
            title: "Sucesso:",
            text: mensagem,
            icon: "success",
            buttons: {
                confirm: {
                    text: "Ok",
                    value: true,
                    visible: true,
                    closeModal: true
                }
            }
        });
    }

    /**
     * Retorna um sweetAlert de Falha.
     * @param mensagem - Mensagem a ser colocada
     * @returns Promise
     */
    static AlertaFalha(mensagem: string) : Promise<void> {
        return swal({
            title: "Atenção:",
            text: mensagem,
            icon: "error",
            buttons: {
                confirm: {
                    text: "Ok",
                    value: true,
                    visible: true,
                    closeModal: true
                }
            }
        });
    }

    /**
     * Retorna um sweetAlert de Carregamento.
     * @param mensagem - Mensagem a ser colocada
     * @param content - Conteúdo de HTML que pode ser colocado.
     * @returns Promise
     */
    static AlertaCarregando(mensagem: string, content: string): Promise<void> {
        return swal({
            title: "Atenção:",
            text: mensagem,
            icon: "warning",
            content: { element: content },
            closeOnClickOutside: false,
            buttons: [false]
        });
    }

    /**
     * Retorna um sweetAlert de Escolha binária.
     * @param mensagem - Mensagem a ser colocada
     * @param content - Conteúdo de HTML que pode ser colocado.
     * @returns Promise
     */
    static AlertaSimOuNao(mensagem: string): Promise<boolean> {
        return swal({
            title: "Atenção:",
            text: mensagem,
            icon: "warning",
            buttons: {
                cancel: {
                    text: "Não",
                    value: false,
                    visible: true,
                    closeModal: false
                },
                confirm: {
                    text: "Sim",
                    value: true,
                    visible: true,
                    closeModal: false
                }
            }
        });
    }
}
