
export default class StringValido {
    /**
     * Função que verifica se todos os string são válidos.
     * Se todos sao validos, retorna true
     * Se pelo menos existe 1 inválido, retorna false
     * @param storageString - Operador Rest que contem as strings a serem verificadas
     * @returns
     */
    static IsStringAllValid(...storageString: (string | undefined | null)[]) {
        return storageString.every((el) => {
            if (el !== undefined &&
                el !== "undefined" &&
                el !== null &&
                el !== "null" &&
                el !== "")
                return true
            return false
        })
    }
}

