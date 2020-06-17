/**
 * 一阳盖三阴模型
 */
const moment = require("moment");
// 最终输出结果
let out = [];
// 生产对应的日期
let now = +new Date();
let fIndex = 0;
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
let singles, stocks;
MongoClient.connect(url,{ useNewUrlParser: true }, async (err, client) => {
    if (err) {
        return console.log("mongo 数据库连接失败", err);
    }
    console.log("数据库连接成功");
    this.db = client.db("stocks");
    singles = await this.db.collection("singles", { safe: true });
    stocks = await this.db.collection("stocks", { safe: true });
    Start();
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

/**
 * 开始运行
 */
async function Start() {
    let allStocks = await getStockList();
    parse(allStocks);
}
now = +moment(now).subtract(0, "days");
async function parse(data) {
    let currentStock = data[fIndex];
    if (!currentStock) {
        console.log('所有的操作结束');
        out.forEach(item => {
            console.log(`${item.symbol.symbol} ${item.symbol.name} ${item.turnoverrate}`);
        })
        process.exit();
        return;
    }
    fIndex++;

    console.log("开始分析", moment(now), currentStock);
    let res = await singles
        .find({ symbol: currentStock.symbol, timestamp: { $lte: now } })
        .sort({ timestamp: -1 })
        .limit(4);
    let resArray = await res.toArray();
    if (resArray.length < 4) {
        await parse(data);
        return;
    }

    if(
        resArray[0].percent < 0
        && resArray[1].percent < 0
        && resArray[2].percent < 0
        && resArray[3].percent > 0
        && resArray[3].low <= resArray[2].low
        && resArray[3].low <= resArray[1].low
        && resArray[3].low <= resArray[0].low
    ) {
        // console.log("后天涨幅", currentStock, resArray[0].percent, new Date(resArray[0].timestamp));
        out.push({
            symbol: currentStock,
            percent: resArray[0].percent,
            timestamp: new Date(resArray[0].timestamp),
            turnoverrate: resArray[0].turnoverrate
        });
    }


    await parse(data);
}

module.exports = Start;
