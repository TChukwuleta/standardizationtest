const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const expect = chai.expect;
chai.use(sinonChai);

const Printer = require("../logic/printer");

describe("Printer", () => {
  it(".printStatement prints the statement header and result of array elements display calls on newlines", () => {
    let spy = sinon.spy(console, "log");
    const printer = new Printer();


    let result = ["credit || debit || balance ", "Hello", "World"].join(
      "\n"
    );

    printer.printStatement(["Hello", "World"], item => item);

    expect(spy).to.have.been.calledWith(result);
    console.log.restore();
  });
});
