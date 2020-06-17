/**
 * 找有量变异动的股票
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
        console.log(out);
        process.exit();
        return;
    }
    fIndex++;

    console.log("开始分析", moment(now), currentStock);
    let res = await singles
        .find({ symbol: currentStock.symbol, timestamp: { $lte: now } })
        .sort({ timestamp: -1 })
        .limit(40);
    let resArray = await res.toArray();
    if (resArray.length < 40) {
        await parse(data);
        return;
    }
    let halfVol = Math.floor(resArray[0].vol / 2);

    let startFirst = true;
    let counts = 0;
    for(let i = 1 ; i < 40 ; i++) {
        let vol = resArray[i].vol;
        
        if(i < 10 && vol > halfVol) {
            startFirst = false;
            break;
        }
        
        if(vol <= halfVol) {
            counts++;
        }
    }

    if(
        counts > 36
        && startFirst
    ) {
        out.push({
            symbol: currentStock,
            percent: resArray[0].percent,
            timestamp: new Date(resArray[0].timestamp)
        });
    }

    
    await parse(data);
}

module.exports = Start;
