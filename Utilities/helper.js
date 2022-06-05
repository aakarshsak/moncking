class Helper {

    static isNullOrEmptyString = (str) => {
        if(str=== null || str === '' || str === undefined)
            return true;
        return false;
    }

    static isNullOrEmpty = (list) => {
        if(list.length === 0)
            return true;
        return false
    }
}


module.exports = Helper;