/**
 * 分析主升浪
 */
const moment = require('moment');
// 最终输出结果
let out = [];
// 生产对应的日期
let now = +new Date();
let fIndex = 0;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let singles, stocks;
MongoClient.connect(url, async (err, client) => {
    if (err) {
        return console.log('mongo 数据库连接失败', err);
    }
    console.log('数据库连接成功');
    this.db = client.db('stocks');
    singles = await this.db.collection('singles', { safe: true });
    stocks = await this.db.collection('stocks', { safe: true });
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

async function parse(data) {
    let currentStock = data[fIndex];
    if (!currentStock) {
        console.log('所有的操作结束');
        console.log(out);
        process.exit();
        return;
    }
    fIndex++;
    console.log('开始分析', moment(now), currentStock);
    let res = await singles
        .find({ symbol: currentStock.symbol, timestamp: { $lte: now } })
        .sort({ timestamp: -1 })
        .limit(4);
    let resArray = await res.toArray();
    if (resArray.length < 4) {
        await parse(data);
        return;
    }
    // 第一天跌 后三天涨 第5天跌 第六天涨
    if (
        resArray[3].percent < 0 &&
        resArray[2].percent > 1 &&
        resArray[2].percent <= 10 &&
        resArray[1].percent > 1 &&
        resArray[1].percent <= 10 &&
        resArray[0].percent >= 5 &&
        resArray[0].percent <= 10 &&
        resArray[2].vol > resArray[3].vol &&
        resArray[1].vol > resArray[2].vol &&
        resArray[0].vol > resArray[1].vol &&
        resArray[3].close < resArray[3].open &&
        resArray[2].close > resArray[2].open &&
        resArray[1].close > resArray[1].open &&
        resArray[0].close > resArray[0].open
    ) {
        console.log(
            '后天涨幅',
            currentStock,
            resArray[0].percent,
            new Date(resArray[0].timestamp)
        );
        out.push({
            symbol: currentStock
            // percent: resArray[0].percent,
            // timestamp: new Date(resArray[0].timestamp)
        });
    }
    await parse(data);
}
