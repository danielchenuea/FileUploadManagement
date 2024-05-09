
import SweetAlert from "./SweetAlertCommands.js";

export default class Base64Utils {

    static ConvertToBase64(fileInput: JQuery.ChangeEvent, fn: (res: FileList ) => void) {
        //console.log(fileInput.currentTarget.files)
        //Read File
        var selectedFile = fileInput.currentTarget.files as FileList;

        if (selectedFile.length !== 0) {

            //for (var i = 0; i < selectedFile.length; i++) {
            //    let MBSize = selectedFile[i].size / 1048576;
            //    if (MBSize > 30.0 && selectedFile[i].type === "application/pdf") {
            //        SweetAlert.AlertaFalha("Arquivos .pdf não podem ser maiores que 3 MBs");
            //        return false;
            //    }
            //}
            fn(selectedFile);
        }
    }
}
