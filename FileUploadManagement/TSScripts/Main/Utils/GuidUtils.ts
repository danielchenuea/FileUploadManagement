
export default class GuidUtils {

    static CheckAllValidGuid(...storageString: (string)[]): boolean {
        return storageString.every(el => this.CheckValidGuid(el));
    }
    
    static CheckValidGuid(guid: string): boolean {
        const isHEX = (h: string) => !isNaN(parseInt(h, 16));
        const RFC4122Len = [8, 4, 4, 4, 12];

        if (guid.length !== 36) return false;

        // Must have 5 groups
        const groups = guid.split("-");
        if (groups.length !== 5) return false;

        // RFC defines 5 groups of 8-4-4-4-12 codepoints chars each
        groups.forEach((group, index) => {
            if (group.length !== RFC4122Len[index]) return false;
        });

        // Finally join groups (without the "-" separators and check for each char is HEX)
        return [...(groups.join(""))].every(isHEX);
    }
}