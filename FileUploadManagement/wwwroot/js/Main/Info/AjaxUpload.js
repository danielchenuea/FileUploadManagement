const controllerUrl = "/FileManager/";
export default class AjaxUpload {
    static GetFileList() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: controllerUrl + "GetUploadedList/",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                statusCode: {
                    200: function (response) {
                        return resolve(response);
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
    }
    static GetFile(guidFile) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: controllerUrl + "GetUploadedFile/" + guidFile,
                contentType: "image/*; charset=utf-8",
                statusCode: {
                    200: function (response) {
                        return resolve(response);
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
    }
    static GetFileLink(guidFile) { return controllerUrl + "GetUploadedFile/" + guidFile; }
    static PostFile(files) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: controllerUrl + "UploadLargeFile/",
                data: files,
                processData: false,
                contentType: false,
                statusCode: {
                    200: function (response) {
                        return resolve();
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
    }
}
