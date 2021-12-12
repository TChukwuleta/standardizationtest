class Printer {
  printStatement(items, callBack) {
    const STATEMENT_HEADER = "credit || debit || balance \n";
    let rows = items.map(item => callBack(item));
    console.log(STATEMENT_HEADER + rows.join("\n"));
  }
}

module.exports = Printer;
