export default class AjaxLogin {
    static sendCredenciais(idAuth) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/api/auth",
                data: JSON.stringify(idAuth),
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
}
