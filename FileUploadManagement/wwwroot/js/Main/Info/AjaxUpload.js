export default class AjaxUpload {
    static GetFile() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/GetUploadedFile/Bra",
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
    static PostFile(files) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/FileManager/UploadLargeFile",
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
