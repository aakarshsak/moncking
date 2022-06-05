class Bank {
    constructor(bankName, bankCodeName, country) {
        this.bankName = bankName,
        this.bankCodeName = bankCodeName,
        this.country = country
    }

    static getBankName = () => this.bankName;
    static setBankName = (bankName) => this.bankName = bankName;

    static getBankCodeName = () => this.bankCodeName;
    static setBankCodeName = (bankCodeName) => this.bankCodeName = bankCodeName;

    static getCountry = () => this.country;
    static setCountry = (country) => this.country = country;

}

module.exports = Bank;