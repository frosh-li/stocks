/**
 * 分析主升浪
 */
const moment = require("moment");
const request = require('request-promise-native');
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

    
    let res = await singles
        .find({ symbol: currentStock.symbol, timestamp: { $lte: now } })
        .sort({ timestamp: -1 })
        .limit(5);
    let resArray = await res.toArray();
    if (resArray.length < 5) {
        await parse(data);
        return;
    }
    // 第一天跌 后三天涨 第5天跌 第六天涨
    if (
        resArray[4].percent < 0 &&
        resArray[3].percent > 1 &&
        resArray[2].percent > 1 &&
        resArray[1].percent >= 0 &&
        resArray[0].percent < 0 && 
        resArray[3].vol > resArray[4].vol &&
        resArray[2].vol > resArray[3].vol &&
        resArray[1].vol > resArray[2].vol &&
        resArray[0].vol < resArray[1].vol &&
        resArray[4].close < resArray[4].open &&
        resArray[3].close > resArray[3].open &&
        resArray[2].close > resArray[2].open &&
        resArray[1].close > resArray[1].open &&
        resArray[0].close < resArray[0].open &&
        resArray[0].turnoverrate > 4
    ) {
        // 获取当前股价
        const code = currentStock.symbol.substring(2);
        const pre = code.toString()[0] === '6' ? 1 : 0;
        const realtimePrice = `http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292&secid=${pre}.${code}&_=${+Date.now()}`

        const cbody = await request(realtimePrice, {
          json: true,
          headers: {
            'keep-alive': true,
          }
        });

        let bk = cbody.data.f127; // 板块信息
        let moneys = cbody.data.f137; // 资金净流入
        let mcd = cbody.data.f140; //净超大单
        console.log(
            code,
            currentStock.name,
            "换手率:",
            resArray[0].turnoverrate,
            '当天涨幅:',
            resArray[0].percent,
            bk,
            '资金净流入',
            Math.ceil(moneys/10000) + '万元',
            '小单净流入',
            Math.ceil(cbody.data.f149/10000) + '万元',
            '超大单:',
            Math.ceil(mcd/10000) + '万元',
        );
        out.push({
            symbol: currentStock,
            percent: resArray[0].percent,
            turnoverrate: resArray[0].turnoverrate,
            // timestamp: new Date(resArray[0].timestamp)
        });
    }
    await parse(data);
}

module.exports = Start;
