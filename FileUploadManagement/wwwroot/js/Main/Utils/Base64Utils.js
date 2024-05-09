export default class Base64Utils {
    static ConvertToBase64(fileInput, fn) {
        var selectedFile = fileInput.currentTarget.files;
        if (selectedFile.length !== 0) {
            fn(selectedFile);
        }
    }
}
