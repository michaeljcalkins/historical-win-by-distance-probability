import parse from "csv-parse/lib/sync.js";
import fs from "fs";
import readline from "readline";

function round5(x) {
  return Math.ceil(x / 5) * 5;
}

const data = fs.readFileSync("./spx.csv");
const records = parse(data, {
  columns: true,
  skip_empty_lines: true,
});

// Keep only 0DTE dates which are Mon, Wed, and Fri
const expirationRecords = records
  .map((record) => {
    const dateString = record.Date.split("/");
    const recordDate = new Date(dateString[2], dateString[0], dateString[1], 9, 30);
    recordDate.toLocaleString("en-US", { timeZone: "America/New_York" });

    return {
      ...record,
      // Get the absolute difference between the open and close
      highLowDiff: Number(record.Open) - Number(record["Close/Last"]),
      dayOfWeek: recordDate.getDay(),
    };
  })
  .filter((record) => {
    return [1, 3, 5].includes(record.dayOfWeek);
  });

let statisticalMoves = {};
expirationRecords.forEach((record) => {
  const roundedDiff = round5(record.highLowDiff);
  if (roundedDiff > 0 || roundedDiff < -500) return;

  statisticalMoves[roundedDiff] = statisticalMoves[roundedDiff] || { value: 0, chanceOfLoss: 0 };
  statisticalMoves[roundedDiff].value++;
});

let probLossTotalCount = 0;
for (let x in statisticalMoves) {
  probLossTotalCount += Number(statisticalMoves[x].value);
}

let sortedStatisticalMoves = [];
for (let key in statisticalMoves) {
  let probLoss = 0;

  for (let x in statisticalMoves) {
    if (Number(x) <= Number(key)) {
      probLoss += Number(statisticalMoves[x].value);
      // console.log(x, key, probLoss);
    }
  }

  statisticalMoves[key].probLoss = probLoss;
  // statisticalMoves[key].probLossVisual = Array(probLoss).fill("■").join("");

  sortedStatisticalMoves.push([
    Number(key),
    String(Math.ceil((statisticalMoves[key].probLoss / probLossTotalCount) * 100)) + "%",
    statisticalMoves[key].probLoss,
    statisticalMoves[key].value,
  ]);
}

sortedStatisticalMoves
  .sort(function (a, b) {
    return a[0] - b[0];
  })
  .reverse();

const sortedStatisticalMovesObject = sortedStatisticalMoves.map((obj) => ({
  "Day Range": obj[0],
  Count: obj[3],
  "Prob. Loss": obj[1],
  "Prob. Loss Count": obj[2],
}));

console.table(sortedStatisticalMovesObject);
