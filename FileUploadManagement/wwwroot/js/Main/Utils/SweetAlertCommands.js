export default class SweetAlert {
    static AlertaSucesso(mensagem) {
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
    static AlertaFalha(mensagem) {
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
    static AlertaCarregando(mensagem, content) {
        return swal({
            title: "Atenção:",
            text: mensagem,
            icon: "warning",
            content: { element: content },
            closeOnClickOutside: false,
            buttons: [false]
        });
    }
    static AlertaSimOuNao(mensagem) {
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
