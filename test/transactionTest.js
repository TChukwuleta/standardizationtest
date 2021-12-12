const sinon = require("sinon");
const expect = require("chai").expect;
const Transaction = require("../logic/transaction");

describe("Transaction", () => {
  describe(".display", () => {

    it("has the credit amount in first column", () => {
      const transaction = new Transaction({ credit: 10000 });
      expect(transaction.display()).to.equal("10000 || || ");
    });

    it("has the debit amount in second column", () => {
      const transaction = new Transaction({ debit: 10000 });
      expect(transaction.display()).to.equal("|| 10000 || ");
    });

    it("has the balance amount in third column", () => {
      const transaction = new Transaction({ balance: 10000 });
      expect(transaction.display()).to.equal("|| || 10000 ");
    });
  });
}); 
