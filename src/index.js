const EventEmitter = require('events');
const MongoClient = require("mongodb").MongoClient;
const Config = require('./config');
const rp = require('request-promise-native');
const myEmitter = new EventEmitter();
/**
 * 启动函数
 */
function crawStocks(db) {
    console.log("开始爬取数据")
    console.log(`开始抓取第${this.Config.params.page}页`);
        const url = this.Config.getUrl();
        let options = {
            uri: this.url,
            json: true,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
                Accept: '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'cache-control': 'no-cache',
                Connection: 'keep-alive',
                Cookie:
                    'device_id=c86dc338ed7bef666ee643eed3b96e3b; s=dz16deykcw; aliyungf_tc=AQAAADnbY1HU1A0AwLgicy9Nm13OMtYt; xq_a_token=1cc984adc2303728559a6e27619a64e70cc9595c; xq_a_token.sig=98ueT2_mrb1JCknQpk_31plcb4U; xq_r_token=4ec1b5e304a99d5775bfe43683b99aa1e0a3cb7b; xq_r_token.sig=3HywtnqINhq1Y7nGeqmDicJpZp8; u=261559827698299; Hm_lvt_1db88642e346389874251b5a1eded6e3=1559827698; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1559829127',
                Referer: 'https://xueqiu.com/hq',
                Host: 'xueqiu.com',
                'X-Requested-With': 'XMLHttpRequest'
            },
            gzip: true
        };
        let body = await rp(options);
        if (body.error_code !== 0) {
            console.log('request error', this.url);
        } else {
            this.save(body.data.list);
        }
}

/**
 * 初始化mongo数据库
 */
async function initDb() {
    const url = "mongodb://localhost:27017";
    MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
        if (err) {
            return console.log("mongo 数据库连接失败", err);
        }

        console.log("数据库连接成功");
        const db = client.db("stocks");
        const singles = await db.collection("singles", { safe: true });
        const stocks = await db.collection("stocks", { safe: true });

        await singles.remove();
        await stocks.remove();
        await db.createCollection("singles");
        await singles.createIndex({
            timestamp: 1,
            symbol: 1,
        });
        await db.createCollection("stocks");
        myEmitter.emit("db:ready", db);
    });
}


myEmitter.on('db:ready', crawStocks);

initDb();
