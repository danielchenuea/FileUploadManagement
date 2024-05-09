export default class StringValido {
    static IsStringAllValid(...storageString) {
        return storageString.every((el) => {
            if (el !== undefined &&
                el !== "undefined" &&
                el !== null &&
                el !== "null" &&
                el !== "")
                return true;
            return false;
        });
    }
}
