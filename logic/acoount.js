const Transaction = require("./transaction");
const Printer = require("./printer");

class Account {
  constructor(transactionClass = Transaction, printer = new Printer()) {
    const STARTING_BALANCE = 0;

    this.balance = STARTING_BALANCE;
    this.transactionClass = transactionClass;
    this.printer = printer;
    this.transactionHistory = [];
    this.isActive = true
  }

  deposit(amount){
    let credit = amount
    this.balance += credit
    this._addTransaction({ credit, balance: this.balance })
    return this._transactionMessage(credit, "was deposited to your account")
  }

  withdraw(amount){
    let debit = amount
    if(debit > this.balance){
      return "Insufficient funds"
    }
    this.balance -= debit
    this._addTransaction({ debit, balance: this.balance })
    return this._transactionMessage(debit, "was withdrawn from your account")
  }

  statement() {
    this.printer.printStatement(this.transactionHistory, (transaction) => {
      return transaction.display();
    });
  }

  disable() {
    if(this.isActive == false){
      return "Account is already disabled"
    }
    this.isActive == true
    return "Account was successfully disabled"
  }

  _addTransaction(argObj) {
    this.transactionHistory.unshift(new this.transactionClass(argObj));
  }

  _transactionMessage(credit, phrase){
    let creditDisplay = credit
    let balanceDisplay = this.balance
    return `${creditDisplay} ${phrase}. Current balance is: ${balanceDisplay}`
  }
}

module.exports = Account;
