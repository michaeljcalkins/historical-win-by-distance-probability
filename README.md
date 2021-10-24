# historical-distance-win-probability-experiment

## Getting Started

1. `npm i`
1. `npm start` for movement graph
1. `npm backtestCLI` for cli to test distances and premiums
1. `npm backtestAllScenarios` to run the present distances and static premiums against the provided data.

## Objective

I want to find out if there is an optimal way to trade SPX 0DTE credit spreads profitably for the long term.

## Background Information

1. Commision fees are not taken into consideration, nor are taxes.
1. Credit spreads are a great way to mitigate risk due to their ranged behavior without needed to be directionally correct and are inexpensive to sell.
1. The strategy focused on is 0DTE SPX opening at open and expiring worthless at close.
1. SPX has tax advantage and is cash settled allowing us to only open our trades while allowing them to close without triggering day trades.
1. We are not trying to time the market, this experiment assumes you are trading every day available.
1. If we had option chain data I'd be able to provide highly accurate test results, but I wanted this to be free.

## Hypothesis

I think selling far OTM put credit spreads is the ideal distance for long term success that lets you win the most times passively and allowing your position to go expiration.

## Material/Procedures

1. 10 year download from NASDAQ: https://www.nasdaq.com/market-activity/index/spx/historical
1. The main script is `winRateBackTestAllScenarios.mjs`
1. Run the main experiment with `npm run backtestAllScenarios`
1. Options data was from a 2DTE date because I wrote this on the weekend and all I really needed was option premium ratios at different strike prices. I'll probably update this on monday with new data but the results should be almost identical.
1. $5 spreads
1. Visualizer https://www.tradingview.com/chart/hb0iTLjt/

## Observances

1. I am assuming you will do the exact same trade for 10 years straight. This does not account for a trader moving around all the time.
1. Losses are not actual risk management. They are just a percentage off of the max loss.
1. The profit success varies wildly depeneding on your ability to close losing trades ASAP.
1. Far OTM is not the most profitable.
1. -25 is necessary to outlast max loss if you never managed a losing trade but you also miss out on so much money.
1. You are more profitable the faster you can manage your losing trades.
1. ATM isn't the most profitable when using put spreads because you can lose your account.
1. Call spreads appear to be more profitable.
1. If you reverse the data so it runs 2021 -> 2011 you still get similar results, risk managment is still king and put spreads beat call spreads.

**Data results**

```
Loss per losing trade: 25%
┌─────────┬──────────┬─────────┬───────────┬──────────┬───────────┬─────────┐
│ (index) │ distance │ maxLoss │ maxProfit │ winCount │ lossCount │ balance │
├─────────┼──────────┼─────────┼───────────┼──────────┼───────────┼─────────┤
│    0    │    50    │   490   │    10     │   1024   │    16     │  9788   │
│    1    │    45    │   485   │    15     │   1019   │    21     │  14244  │
│    2    │    40    │   480   │    20     │   1010   │    30     │  18100  │
│    3    │    35    │   465   │    35     │   1002   │    38     │  32162  │
│    4    │    30    │   445   │    55     │   982    │    58     │  49072  │
│    5    │    25    │   425   │    75     │   964    │    76     │  65744  │
│    6    │    20    │   390   │    110    │   922    │    118    │  91474  │
│    7    │    15    │   340   │    160    │   856    │    184    │ 122820  │
│    8    │    10    │   305   │    195    │   782    │    258    │ 134382  │
│    9    │    5     │   260   │    240    │   649    │    391    │ 131845  │
│   10    │    -5    │   325   │    175    │   727    │    313    │ 103372  │
│   11    │   -10    │   360   │    140    │   821    │    219    │  96730  │
│   12    │   -15    │   390   │    110    │   894    │    146    │  85678  │
│   13    │   -20    │   420   │    80     │   932    │    108    │  64720  │
│   14    │   -25    │   435   │    65     │   966    │    74     │  56298  │
│   15    │   -30    │   445   │    55     │   989    │    51     │  50234  │
│   16    │   -35    │   465   │    35     │   998    │    42     │  31558  │
│   17    │   -40    │   465   │    35     │   1009   │    31     │  33219  │
│   18    │   -45    │   475   │    25     │   1016   │    24     │  24068  │
│   19    │   -50    │   480   │    20     │   1023   │    17     │  19920  │
└─────────┴──────────┴─────────┴───────────┴──────────┴───────────┴─────────┘
Loss per losing trade: 50%
┌─────────┬──────────┬─────────┬───────────┬──────────┬───────────┬─────────┐
│ (index) │ distance │ maxLoss │ maxProfit │ winCount │ lossCount │ balance │
├─────────┼──────────┼─────────┼───────────┼──────────┼───────────┼─────────┤
│    0    │    50    │   490   │    10     │   1024   │    16     │  7820   │
│    1    │    45    │   485   │    15     │   1019   │    21     │  11703  │
│    2    │    40    │   480   │    20     │   1010   │    30     │  14500  │
│    3    │    35    │   465   │    35     │   1002   │    38     │  27754  │
│    4    │    30    │   445   │    55     │   982    │    58     │  42634  │
│    5    │    25    │   425   │    75     │   964    │    76     │  57688  │
│    6    │    20    │   390   │    110    │   922    │    118    │  79910  │
│    7    │    15    │   340   │    160    │   856    │    184    │ 107180  │
│    8    │    10    │   305   │    195    │   782    │    258    │ 114774  │
│    9    │    5     │   260   │    240    │   649    │    391    │ 106430  │
│   10    │    -5    │   325   │    175    │   727    │    313    │  78019  │
│   11    │   -10    │   360   │    140    │   821    │    219    │  77020  │
│   12    │   -15    │   390   │    110    │   894    │    146    │  71370  │
│   13    │   -20    │   420   │    80     │   932    │    108    │  53380  │
│   14    │   -25    │   435   │    65     │   966    │    74     │  48232  │
│   15    │   -30    │   445   │    55     │   989    │    51     │  44573  │
│   16    │   -35    │   465   │    35     │   998    │    42     │  26686  │
│   17    │   -40    │   465   │    35     │   1009   │    31     │  29623  │
│   18    │   -45    │   475   │    25     │   1016   │    24     │  21212  │
│   19    │   -50    │   480   │    20     │   1023   │    17     │  17880  │
└─────────┴──────────┴─────────┴───────────┴──────────┴───────────┴─────────┘
Loss per losing trade: 75%
┌─────────┬──────────┬─────────┬───────────┬──────────┬───────────┬─────────┬────────────────┐
│ (index) │ distance │ maxLoss │ maxProfit │ winCount │ lossCount │ balance │ unableToFinish │
├─────────┼──────────┼─────────┼───────────┼──────────┼───────────┼─────────┼────────────────┤
│    0    │    50    │   490   │    10     │   1024   │    16     │  5868   │                │
│    1    │    45    │   485   │    15     │   1019   │    21     │  9162   │                │
│    2    │    40    │   480   │    20     │   1010   │    30     │  10900  │                │
│    3    │    35    │   465   │    35     │   1002   │    38     │  23346  │                │
│    4    │    30    │   445   │    55     │   982    │    58     │  36196  │                │
│    5    │    25    │   425   │    75     │   964    │    76     │  49632  │                │
│    6    │    20    │   390   │    110    │   922    │    118    │  68464  │                │
│    7    │    15    │   340   │    160    │   856    │    184    │  91540  │                │
│    8    │    10    │   305   │    195    │   782    │    258    │  95166  │                │
│    9    │    5     │   260   │    240    │   649    │    391    │  81015  │                │
│   10    │    -5    │   325   │    175    │   727    │    313    │  52666  │                │
│   11    │   -10    │   360   │    140    │   821    │    219    │  57310  │                │
│   12    │   -15    │   390   │    110    │   894    │    146    │  57208  │                │
│   13    │   -20    │   420   │    80     │    5     │     5     │   325   │      true      │
│   14    │   -25    │   435   │    65     │   966    │    74     │  40166  │                │
│   15    │   -30    │   445   │    55     │   989    │    51     │  38912  │                │
│   16    │   -35    │   465   │    35     │   998    │    42     │  21814  │                │
│   17    │   -40    │   465   │    35     │   1009   │    31     │  26027  │                │
│   18    │   -45    │   475   │    25     │   1016   │    24     │  18356  │                │
│   19    │   -50    │   480   │    20     │   1023   │    17     │  15840  │                │
└─────────┴──────────┴─────────┴───────────┴──────────┴───────────┴─────────┴────────────────┘
Loss per losing trade: 100%
┌─────────┬──────────┬─────────┬───────────┬──────────┬───────────┬─────────┬────────────────┐
│ (index) │ distance │ maxLoss │ maxProfit │ winCount │ lossCount │ balance │ unableToFinish │
├─────────┼──────────┼─────────┼───────────┼──────────┼───────────┼─────────┼────────────────┤
│    0    │    50    │   490   │    10     │   1024   │    16     │  3900   │                │
│    1    │    45    │   485   │    15     │   1019   │    21     │  6600   │                │
│    2    │    40    │   480   │    20     │   1010   │    30     │  7300   │                │
│    3    │    35    │   465   │    35     │   1002   │    38     │  18900  │                │
│    4    │    30    │   445   │    55     │   982    │    58     │  29700  │                │
│    5    │    25    │   425   │    75     │   964    │    76     │  41500  │                │
│    6    │    20    │   390   │    110    │   922    │    118    │  56900  │                │
│    7    │    15    │   340   │    160    │   856    │    184    │  75900  │                │
│    8    │    10    │   305   │    195    │   782    │    258    │  75300  │                │
│    9    │    5     │   260   │    240    │   649    │    391    │  55600  │                │
│   10    │    -5    │   325   │    175    │    4     │     6     │   250   │      true      │
│   11    │   -10    │   360   │    140    │    4     │     5     │   260   │      true      │
│   12    │   -15    │   390   │    110    │    5     │     5     │   100   │      true      │
│   13    │   -20    │   420   │    80     │    5     │     4     │   220   │      true      │
│   14    │   -25    │   435   │    65     │   966    │    74     │  32100  │                │
│   15    │   -30    │   445   │    55     │   989    │    51     │  33200  │                │
│   16    │   -35    │   465   │    35     │   998    │    42     │  16900  │                │
│   17    │   -40    │   465   │    35     │   1009   │    31     │  22400  │                │
│   18    │   -45    │   475   │    25     │   1016   │    24     │  15500  │                │
│   19    │   -50    │   480   │    20     │   1023   │    17     │  13800  │                │
└─────────┴──────────┴─────────┴───────────┴──────────┴───────────┴─────────┴────────────────┘
```

## Conclusions

1. Closing losing trades fast and allow winning trades to finish are easily the most profitable.
1. The most profitable trades are credit call spreads from 10 and 15 OTM.
1. Far OTM does not make nearly as much profit as closer strike distances.
1. With no riskmanagement, call credit spreads are actually very successful.
1. You make 25 - 35% more profit with bad risk management and almost 80% more profit with good risk management.

## Unanswered Questions

1. How do winning streaks effect this trend?
1. How does one recover from big draw downs?
1. I'd like to see all these different scenarios charted out as graphs.
1. What if you could close a losing spread and open one on the other side?
