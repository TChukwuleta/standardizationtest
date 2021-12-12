const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const Account = require("../logic/acoount");

describe("Account Feature Test", () => {
  it("deposit 1000, 2000 then withdraw 500", () => {

    let spy = sinon.spy(console, "log");

    const account = new Account();
    account.deposit(1000);
    account.deposit(2000);
    account.withdraw(500);

    let statement = [
      "credit || debit || balance ",
      "|| 500 || 2500 ",
      "2000 || || 3000 ",
      "1000 || || 1000 ",
    ].join("\n");

    account.statement();
    expect(spy).to.have.been.calledWith(statement);

    console.log.restore();
  });
});
