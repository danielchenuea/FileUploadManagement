export default class GuidUtils {
    static CheckAllValidGuid(...storageString) {
        return storageString.every(el => this.CheckValidGuid(el));
    }
    static CheckValidGuid(guid) {
        const isHEX = (h) => !isNaN(parseInt(h, 16));
        const RFC4122Len = [8, 4, 4, 4, 12];
        if (guid.length !== 36)
            return false;
        const groups = guid.split("-");
        if (groups.length !== 5)
            return false;
        groups.forEach((group, index) => {
            if (group.length !== RFC4122Len[index])
                return false;
        });
        return [...(groups.join(""))].every(isHEX);
    }
}
