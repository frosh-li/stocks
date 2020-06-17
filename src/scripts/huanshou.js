/**
 * 换手率统计
 */
const moment = require("moment");
const fs = require('fs')
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
let now = +new Date();
let singles, stocks;
MongoClient.connect(url,{ useNewUrlParser: true }, async (err, client) => {
    if (err) {
        return console.log("mongo 数据库连接失败", err);
    }
    console.log("数据库连接成功");
    let db = client.db("stocks");
    singles = await db.collection("singles", { safe: true });
    stocks = await db.collection("stocks", { safe: true });
    setTimeout(() => {
      Start();
    },1000)
    
});

async function getStockList() {
  let allStocks = await stocks.find({});
  let ret = await allStocks.toArray();

  return ret.map(item => {
      return {
          symbol: item.symbol,
          name: item.name
      };
  });
}
const results = [];
async function Start() {
  const stocks = await getStockList();


  stocks.forEach(async element => {
    console.log('element', element);
    // 每一个股票再次查询表里面
    const res = await parseStock(element);
    now = +new Date();
  });
  
}


async function parseStock(element) {
  let res_1 = await singles
        .find({ symbol: element.symbol, timestamp: { $lte: now } })
        .sort({ timestamp: -1 })
        .limit(4);
    // 分析换手率 如果三天换手都在8%到12%之间，看第四天的涨跌幅
    const res = await res_1.toArray();
    if(res.length === 4) {
      if(res[1].turnoverrate > 4
        &&res[2].turnoverrate >4
        &&res[3].turnoverrate >4
        && res[1].percent <= 0
        && res[2].percent <= 0
        && res[3].percent <= 0) {
          console.log('res', res);
          results.push(res);
          const strings = [];
          strings.push(`\n${moment(res[0].timestamp).format('YYYY-MM-DD')} ${res[0].symbol}`);
          res.forEach(_item => {
            strings.push(`\t ${moment(_item.timestamp).format('YYYY-MM-DD')} 涨幅${_item.percent} 换手率${_item.turnoverrate}`);
          })
          fs.writeFileSync(`logs.txt`, strings.join("\n"), {
            flag: 'a+'
          });
      }
      // 进入当前股票的下一天
      now = +moment(now).subtract(1, "days");
      await parseStock(element);
    }
}