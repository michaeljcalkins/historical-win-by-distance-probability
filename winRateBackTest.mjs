/**
 * Lets you run a single spread distance
 * against historical data with custom
 * premium and risk management values.
 */
import parse from "csv-parse/lib/sync.js";
import fs from "fs";
import readline from "readline";

function round5(x) {
  return Math.ceil(x / 5) * 5;
}

const backtest = (distance, maxProfit, maxLoss, riskManagement, startingBalance) => {
  distance = Number(distance);
  maxProfit = Number(maxProfit);
  maxLoss = Number(maxLoss);
  riskManagement = Number(riskManagement);
  let balance = Number(startingBalance);

  const data = fs.readFileSync("./spx.csv");
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true,
  });

  // Keep only 0DTE dates which are Mon, Wed, and Fri
  const expirationRecords = records
    .reverse()
    .map((record) => {
      const dateString = record.Date.split("/");
      const recordDate = new Date(dateString[2], dateString[0], dateString[1], 9, 30);
      recordDate.toLocaleString("en-US", { timeZone: "America/New_York" });

      return {
        ...record,
        // Get the absolute difference between the open and close
        openCloseDiff: Number(record["Close/Last"]) - Number(record.Open),
        dayOfWeek: recordDate.getDay(),
      };
    })
    .filter((record) => {
      return [1, 3, 5].includes(record.dayOfWeek) && record.Open !== "0";
    });

  let winCount = 0;
  let lossCount = 0;
  let lossEvents = [];
  expirationRecords.forEach((record) => {
    if (balance <= maxLoss) {
      return;
    }

    if (record.openCloseDiff > distance) {
      balance += maxProfit;
      winCount++;
    } else {
      lossCount++;
      lossEvents.push({ ...record, balance });
      balance -= Number(maxLoss * riskManagement);
    }
  });

  console.table(lossEvents);
  console.log("Ending balance: ", balance);
  console.log("Win Percentage: ", 100 - Math.floor((lossCount / expirationRecords.length) * 100) + "%");
  console.log("Wins: ", winCount);
  console.log("Losses: ", lossCount);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Distance from ATM: ", function (distance) {
  rl.question("Starting Balance: ", function (startingBalance) {
    rl.question("Max Profit: ", function (maxProfit) {
      rl.question("Max Loss: ", function (maxLoss) {
        rl.question("Manage at percentage loss: ", function (riskManagement) {
          backtest(distance, maxProfit, maxLoss, riskManagement, startingBalance);
          rl.close();
        });
      });
    });
  });
});
