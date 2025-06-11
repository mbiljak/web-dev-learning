/*
1. Deposit Money
2. determine number of lines to bet on
3. store bet amount
4. spin the slot machine
5. check if user won
6. give winnings
7. play again (money left?)
*/

const prompt = require("prompt-sync")(); //() gives you access to function to get user input

// defining slot machine

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_MULTIPLIER = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// same way of defining regular function, function expression
const deposit = () => {
  while (true) {
    const depositAmount = prompt("enter deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again");
    } else {
      return numberDepositAmount; //this breaks the while loop
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("How many lines do you want to bet on? (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    let bet = prompt("How much do you wager per line?: ");
    const betNumber = parseFloat(bet) * lines;
    let betPercentage = (betNumber / balance) * 100;

    if (isNaN(betNumber) || betNumber > balance || betNumber <= 0) {
      console.log("Invalid bet, try again");
      continue;
    }

    if (betNumber > betNumber * 0.9) {
      console.log(
        "your bet is " +
          parseInt(betPercentage) +
          "% of your balance. Do you want to continue (Y/n): "
      );
      let decision = prompt(""); //done to reduce echoing of prompt

      if (decision.toLowerCase() == "y") {
        return betNumber;
      } else {
        continue; //stops current interation and moves to the next one
      }
    } else {
      return betNumber;
    }
  }
};

const spin = () => {
  //create symbol pool ---> symbols = ["A", "A", "B", "B", "B", "B", "C", "C", "C", "C", "C", "C", "D", "D", "D", "D", "D", "D", "D", "D"]
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    //turns the object into a list of key, value
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = []; //prepare slot machine to hold reels

  //fill each reel randomly
  for (let i = 0; i < COLS; i++) {
    reels.push([]); // pushes reels into slot machine
    const reelSymbols = [...symbols]; // for each column the pool is copied so chances are the same

    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length); //get random index from reelSymbols (multiply to get valid index)
      const selectedSymbol = reelSymbols[randomIndex]; //stores random symbol
      reels[i].push(selectedSymbol); // adds it to the column
      reelSymbols.splice(randomIndex, 1); //removes it from list so it doesnt appear again in the same column
    }
  }
  return reels;
};

const transpose = (reel) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reel[j][i]);
    }
  }

  return rows;
};
const printSlotMachine = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != rows.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols)
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }

    if (allSame) {
      winnings += bet * SYMBOL_MULTIPLIER[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();
  console.log("You deposited " + balance + "$");

  while (true) {
    console.log("your balance is $" + balance);
    const amountOfLines = getNumberOfLines();
    console.log("You have selected " + amountOfLines + " lines to bet on");

    const betAmount = getBet(balance, amountOfLines);
    balance -= betAmount;

    const reels = spin();
    const rows = transpose(reels);
    printSlotMachine(rows);

    const winnings = getWinnings(rows, betAmount, amountOfLines);
    balance += winnings;
    console.log("You won, $" + winnings);

    if (balance <= 0) {
      console.log("----GAME OVER----");
      const moreMoneyPrompt = prompt(
        "Would you like to deposit more money? (Y/n): "
      );
      if (moreMoneyPrompt.toLowerCase() === "y") {
        balance = deposit();
        continue; // back to start of loop
      } else {
        console.log("You left with $0. Thanks for playing!");
        break;
      }
    }

    const continueGame = prompt("Would you like to bet again? (Y/n): ");
    if (continueGame.toLowerCase() !== "y") {
      console.log("You left with $" + balance);
      break;
    }
  }
};

game();
