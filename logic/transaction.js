const moment = require("moment"); 

class Transaction {
  constructor({ credit = null, debit = null, balance = null } = {}) {
    this.credit = credit;
    this.debit = debit;
    this.balance = balance;
  }

  display() {
    return [
      this._render(this.credit),
      this._render(this.debit),
      this._render(this.balance),
    ].join("|| ");
  }
  _render = (item) => (item != null ? `${item} ` : "");
}

module.exports = Transaction;
