/**
 * Automatically runs various spread distances with
 * manually pulled premium data that is statically
 * used against whatever data is provided.
 */
import parse from "csv-parse/lib/sync.js";
import fs from "fs";

function round5(x) {
  return Math.ceil(x / 5) * 5;
}

let startingBalance = 1500;
const riskManagements = [0.25, 0.5, 0.75, 1];

let outcomes = {};

const distances = [
  {
    distance: 50,
    maxLoss: 490,
    maxProfit: 10,
  },
  {
    distance: 5,
    maxLoss: 260,
    maxProfit: 240,
  },
  {
    distance: 10,
    maxLoss: 305,
    maxProfit: 195,
  },
  {
    distance: 15,
    maxLoss: 340,
    maxProfit: 160,
  },
  {
    distance: 20,
    maxLoss: 390,
    maxProfit: 110,
  },
  {
    distance: 25,
    maxLoss: 425,
    maxProfit: 75,
  },
  {
    distance: 30,
    maxLoss: 445,
    maxProfit: 55,
  },
  {
    distance: 35,
    maxLoss: 465,
    maxProfit: 35,
  },
  {
    distance: 40,
    maxLoss: 480,
    maxProfit: 20,
  },
  {
    distance: 45,
    maxLoss: 485,
    maxProfit: 15,
  },
  {
    distance: -5,
    maxLoss: 325,
    maxProfit: 175,
  },
  {
    distance: -10,
    maxLoss: 360,
    maxProfit: 140,
  },
  {
    distance: -15,
    maxLoss: 390,
    maxProfit: 110,
  },
  {
    distance: -20,
    maxLoss: 420,
    maxProfit: 80,
  },
  {
    distance: -25,
    maxLoss: 435,
    maxProfit: 65,
  },
  {
    distance: -30,
    maxLoss: 445,
    maxProfit: 55,
  },
  {
    distance: -35,
    maxLoss: 465,
    maxProfit: 35,
  },
  {
    distance: -40,
    maxLoss: 465,
    maxProfit: 35,
  },
  {
    distance: -45,
    maxLoss: 475,
    maxProfit: 25,
  },
  {
    distance: -50,
    maxLoss: 480,
    maxProfit: 20,
  },
];

const data = fs.readFileSync("./spx.csv");
const records = parse(data, {
  columns: true,
  skip_empty_lines: true,
});

// Keep only 0DTE dates which are Mon, Wed, and Fri
// .reverse() = starts at 2011 and goes forwards
// without reverse = starts at 2021 and goes backwards
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

riskManagements.forEach((riskManagement) => {
  outcomes[riskManagement] = {};
  distances.forEach((distance) => {
    outcomes[riskManagement][distance.distance] = { ...distance };
    let pointer = outcomes[riskManagement][distance.distance];
    pointer.winCount = 0;
    pointer.lossCount = 0;
    pointer.balance = startingBalance;

    expirationRecords.forEach((record) => {
      // You ran out of money
      if (pointer.balance <= pointer.maxLoss) {
        pointer.unableToFinish = true;
        return;
      }

      if (
        // put credit spreads
        (pointer.distance < 0 && record.openCloseDiff > pointer.distance) ||
        // call credit spreads
        (pointer.distance > 0 && record.openCloseDiff < pointer.distance)
      ) {
        pointer.balance += Math.floor(pointer.maxProfit);
        pointer.winCount++;
      } else {
        pointer.lossCount++;
        pointer.balance -= Math.floor(Number(pointer.maxLoss * riskManagement));
      }
    });
  });
});

let sortedOutcomes = [];
for (let key in outcomes) {
  sortedOutcomes.push([key, outcomes[key]]);
}

sortedOutcomes
  .sort((a, b) => {
    return a[0] - b[0];
  })
  .forEach((outcome) => {
    console.log("Loss per losing trade:", outcome[0] * 100 + "%");

    let sortedDistances = [];
    for (let key in outcome[1]) {
      sortedDistances.push([key, outcome[1][key]]);
    }

    let rebuiltDistances = sortedDistances
      .sort((a, b) => {
        return a[0] - b[0];
      })
      .reverse()
      .map((sortedDistance) => {
        return sortedDistance[1];
      });

    console.table(rebuiltDistances);
  });
