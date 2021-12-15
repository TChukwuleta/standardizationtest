const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const Account = require("../logic/acoount");

describe("Account", () => {
  describe(".deposit", () => {
    it("returns str with balance: 100", () => {
      const account = new Account();

      expect(account.deposit(100)).to.equal(
        "100 was deposited to your account. Current balance is: 100"
      );
    });

    it("returns str with balance: 200", () => {
      const account = new Account();

      expect(account.deposit(200)).to.equal(
        "200 was deposited to your account. Current balance is: 200"
      );
    });

    it("returns str with deposited 100, balance: 300", () => {
      const account = new Account();
      account.deposit(200);

      expect(account.deposit(100)).to.equal(
        "100 was deposited to your account. Current balance is: 300"
      );
    });

    it("returns str with balance: 10.50", () => {
      const account = new Account();

      expect(account.deposit(10.5)).to.equal(
        "10.5 was deposited to your account. Current balance is: 10.5"
      );
    });
  });

  describe(".withdraw (account already has money deposited in it)", () => {
    it("reduces balance by 100", () => {
      const account = moneyAccount();

      expect(account.withdraw(100)).to.equal(
        "100 was withdrawn from your account. Current balance is: 900"
      );
    });

    it("reduces balance by 200", () => {
      const account = moneyAccount();

      expect(account.withdraw(200)).to.equal(
        "200 was withdrawn from your account. Current balance is: 800"
      );
    });

    it("100 then 200, return balance: 700.00", () => {
      const account = moneyAccount();
      account.withdraw(100);

      expect(account.withdraw(200)).to.equal(
        "200 was withdrawn from your account. Current balance is: 700"
      );
    });

    it("overwithdraw should return string 'Insufficient funds'", () => {
      const account = moneyAccount();

      expect(account.withdraw(1500)).to.equal("Insufficient funds");
    });
  });

  describe("uses Transaction class", () => {
    it("deposit calls for new Transaction", () => {
      let transactionSpy = sinon.spy();
      const account = new Account(transactionSpy);

      account.deposit(10000);
      expect(transactionSpy).to.have.been.calledWith({
        credit: 10000,
        balance: 10000,
      });
    });

    it("withdraw calls for new Transaction", () => {
      let transactionSpy = sinon.spy();
      const account = new Account(transactionSpy);
      account.deposit(10000);

      account.withdraw(10000);
      expect(transactionSpy).to.have.been.calledWith({
        debit: 10000,
        balance: 0,
      });
    });
  });

  describe("uses Printer class", () => {
    it("statement calls printer.printStatement", () => {
      let printerSpy = {
        printStatement: () => {},
      };
      let spiedFunction = sinon.spy(printerSpy, "printStatement");
      let transactionSpy;
      const account = new Account(transactionSpy, printerSpy);

      account.statement();
      expect(spiedFunction).to.have.been.called;
    });
  });

  describe("Disables user", () => {
    it('should disable a user', () => {''
      let
    })
  })
});

function moneyAccount() {
  let account = new Account();
  account.deposit(1000);
  return account;
}
