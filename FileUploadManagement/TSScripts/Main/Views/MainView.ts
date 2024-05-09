import AjaxUpload from "../Info/AjaxUpload.js";
import Base64Utils from "../Utils/Base64Utils.js";

let fileList: FileList | undefined = undefined;

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