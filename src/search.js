/**
 * 根据关键字搜索股票
 */
const Config = require('./config');
const rp = require('request-promise-native');
const dates = require('./a');
const moment = require('moment');
// const FX = require('./find');
const MongoClient = require("mongodb").MongoClient;
let outRes = [];
const searchKey = '口罩';
class Craw {
    constructor() {
        this.startAt = '';
        this.hasStart = true;
        this.Config = new Config();
        this.db = null;
        this.allStocks = [];
        this.headers = {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'cache-control': 'max-age=0',
            Connection: 'keep-alive',
            Referer: 'https://xueqiu.com/hq',
            Host: 'xueqiu.com',
            'Upgrade-Insecure-Requests': 1
            //   "X-Requested-With": "XMLHttpRequest"
        };

        
        const url = "mongodb://localhost:27017";
        MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
            if (err) {
                return console.log("mongo 数据库连接失败", err);
            }
            console.log("数据库连接成功");
            this.db = client.db("stocks");
            
            this.singles = await this.db.collection("singles", { safe: true });
            this.stocks = await this.db.collection("stocks", { safe: true });
            await this.singles.remove();
            // await this.stocks.remove();
            await this.db.createCollection("singles");
            await this.singles.createIndex({
                timestamp: 1,
                symbol: 1,
            });
            await this.db.createCollection("stocks");
        });
    }
    run() {
        let db = this.db;
        if (!db) {
            setTimeout(() => {
                this.run();
            }, 100);
            return;
        }
        
        this.url = this.Config.getUrl();
        console.log(this.url);
        this.startCrawAllStock();
    }

    async startCrawAllStock() {
        console.log(`开始抓取第${this.Config.params.page}页`);
        this.url = this.Config.getUrl();
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

    async save(data) {
        console.log(data);
        if (data.length === 0) {
            console.log('all stocks', this.allStocks);
            this.CrawSingle();
            // FX(this.allStocks);
            return;
        }
        data = data.map(item => {
            return {
                ...item,
                symbol: item.symbol,
                name: item.name,
            }
        })
        await this.db.collection("stocks", {safe: true}, async (err, collection) => {
            await collection.insertMany(data);
            this.Config.nextPage();
            this.startCrawAllStock();
        })
        // this.allStocks = this.allStocks.concat(data);
        
    }

    CrawSingle() {
        let db = this.db;
        if (!db) {
            setTimeout(() => {
                this.CrawSingle();
            }, 100);
            return;
        }
        db.collection('stocks', { safe: true }, (err, collection) => {
            collection.find(
                {},
                { safe: true },

                async (err, result) => {
                    let data = await result.toArray();
                    this.RunCraw(data);
                    // this.startCraw();
                }
            );
        });
    }

    async RunCraw(data) {
        this.cookiejar = rp.jar();
        let res = await rp({
            uri: 'https://stock.xueqiu.com',
            resolveWithFullResponse: true, //  <---  <---  <---  <---
            headers: this.headers,
            gzip: true,
            jar: this.cookiejar
        });
        console.log(res.headers['set-cookie']);
        this.headers['Host'] = 'stock.xueqiu.com';
        this.headers.Cookie =
            'device_id=c86dc338ed7bef666ee643eed3b96e3b; s=dz16deykcw;' +
            this.cookiejar.getCookieString('https://stock.xueqiu.com');
        console.log(this.cookiejar.getCookieString('https://stock.xueqiu.com'));
        // return;
        delete this.headers.Referer;
        console.log(this.headers);

        this.startCraw(data);
    }

    async startCraw(data) {
        let db = this.db;
        let codes = [];
        let item = data.shift();
        if (!item) {
            console.log('所有的爬取结束');
            console.log(JSON.stringify(outRes));
            fs.writeFileSync('search'+moment().format("YYYYMMDD"), JSON.stringify(outRes));
            return;
        }
        console.log('start at', item.symbol, this.startAt, this.hasStart);
        if (item.symbol === this.startAt) {
            this.hasStart = true;
        }
        if (this.hasStart !== true) {
            this.startCraw(data);
            return;
        }
        let today = +moment()
            .add(1, 'day')
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0);
        let url = `https://stock.xueqiu.com/v5/stock/f10/cn/company.json?symbol=${item.symbol}`;
        let options = {
            uri: url,
            json: true,
            headers: this.headers,
            //   resolveWithFullResponse: true,
            gzip: true,
            jar: this.cookiejar
        };
        console.log(url);
        let body;
        try {
            body = await rp(options);
        } catch (e) {
            console.log('获取数据出错，重试');
            body = await rp(options);
        }
        this.headers.Cookie =
            'device_id=c86dc338ed7bef666ee643eed3b96e3b; s=dz16deykcw;' +
            this.cookiejar.getCookieString('https://stock.xueqiu.com');
        if (body) {
            console.log(body.data.company);
            try {
                db.collection('stocks', { safe: true }, (err, collection) => {
                    collection.update(
                        {symbol: item.symbol},
                        {$set: {
                            desc: `${body.data.company.main_operation_business} ${body.data.company.org_cn_introduction} ${body.data.company.operating_scope}`
                        }},
                        async (err, result) => {
                            if(err) {
                                console.log(err);
                            }
                        }
                    );
                });
            }catch(e) {
                console.log(e);
            }
            if(body.data && body.data.company) {
                if(body.data.company.main_operation_business.indexOf(searchKey) > -1 
                ||body.data.company.org_cn_introduction.indexOf(searchKey) > -1
                ||body.data.company.operating_scope.indexOf(searchKey) > -1 ) {
                    console.log('FIND:' + item.symbol + ' ' + item.name);
                    outRes.push(item.symbol + ' ' + item.name);
                }
            }
        }
        setTimeout(() => {
            this.startCraw(data);
        }, 10);
    }
}
new Craw().CrawSingle();
module.exports = Craw;
