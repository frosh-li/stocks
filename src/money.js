/**
 * 根据资金分析涨跌幅
 */
const moment = require("moment");
const rp = require('request-promise-native');
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
const api_host = 'http://push2.eastmoney.com';

async function parse(data) {
    let currentStock = data[fIndex];
    if (!currentStock) {
        console.log('所有的操作结束');
        console.log(out);
        process.exit();
        return;
    }
    let code = currentStock.symbol.replace(/[^0-9]/g, '');
    let api_url = `${api_host}/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=0.${code}&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63`;
    fIndex++;

    console.log("开始分析", moment(now), currentStock, api_url);
    let options = {
        uri: api_url,
        json: true,
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'cache-control': 'no-cache',
            Connection: 'keep-alive',
            Referer: api_host,
            Host: 'eastmoney.com',
            'X-Requested-With': 'XMLHttpRequest'
        },
        gzip:true,
    };
    let body = await rp(options);
    if (body.error_code !== 0) {
        console.log('request error', body);
    } else {
        console.log(body);
    }
    
    await parse(data);
}

module.exports = Start;
