class Utils {
    getDateKey(date) {
        //getUTCMonth index starts at 0, so need to add 1
        return date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCFullYear();
    }
}

export default Utils;
