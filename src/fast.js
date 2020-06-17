/**
 * 快速爬取数据
 */

const Config = require('./config');
const rp = require('request-promise-native');
const dates = require('./a');
const moment = require('moment');
const MongoClient = require("mongodb").MongoClient;
let totalPage = 0;
let currentPage = 0;
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
            await this.stocks.remove();
            await this.db.createCollection("singles");
            await this.singles.createIndex({
                timestamp: 1,
                symbol: 1,
            });
            await this.db.createCollection("stocks");
        });
    }
    async run() {
        let db = this.db;
        if (!db) {
            setTimeout(() => {
                this.run();
            }, 100);
            return;
        }
        
        this.url = this.Config.getUrl();
        console.log(this.url);
        totalPage = await this.countStock(); // 获取第一页并且获取到总共有的记录数
        const cpu = 10;
        let tasks = [];
        for(let i = 1 ; i <= cpu ; i++) {
          tasks.push(this.getSingle(i));
        }
        currentPage = 10;
        Promise.all(tasks).then((data) => {
            console.log(data);
            console.log('抓取结束');
            console.log('开始抓取单个股票数据');
            this.CrawSingle();
        }).catch(e => {
            console.log(e);
        })
    }

    async countStock() {
        console.log('开始获取第一页数据');
        this.Config.resetPage();
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
            return 0;
        } else {
            console.log('总计条数', body.data.count, '总计页数', Math.ceil(body.data.count/30))
            return Math.ceil(body.data.count/30);
        }
    }

    async getSingle(page) {
        console.log(`开始抓取第${this.Config.params.page}页`);
        let options = {
            uri: this.Config.getUrlByPage(page),
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
        return new Promise(async (resolve, reject) => {
            let body = await rp(options);
            currentPage++;
            console.log('currentpage', currentPage, 'totalpage', totalPage)
            if (body.error_code !== 0) {
                if(currentPage < totalPage) {
                    return resolve(this.getSingle(currentPage));
                }
                return reject(new Error('抓取错误'));
            } else {
                await this.save(body.data.list);
                if(currentPage < totalPage) {
                   return resolve(this.getSingle(currentPage));
                }
                return resolve(true);
            }
        })
        
        
    }

    async save(data) {
        // console.log(data);
        if (data.length === 0) {
            console.log('无数据');
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
        })
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
        const tasks = [];
        for(let i = 1 ; i < 10 ; i++) {
            tasks.push(this.startCraw(data, i));
        }
        Promise.all(tasks).then(cdata => {
            console.log('所有爬取结束');
        }).catch(e => {
            console.log('数据爬取出错',e);
        })
        // this.startCraw(data);
    }

    async startCraw(data, i) {
        let db = this.db;
        let codes = [];
        let item = data[i];
        if (!item) {
            return;
        }
        let today = +moment()
            .add(1, 'day')
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0);
        let url = `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${
            item.symbol
        }&begin=${today}&period=day&type=before&count=-100&indicator=kline`;
        let options = {
            uri: url,
            json: true,
            headers: this.headers,
            //   resolveWithFullResponse: true,
            gzip: true,
            jar: this.cookiejar
        };
        console.log(url);
        return new Promise(async (resolve, reject) => {
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
                let collection = await db.collection('singles', { safe: true });
                var tmp1 = [];
                body.data.item.forEach(citem => {
                    tmp1.push({
                        symbol: body.data.symbol,
                        timestamp: citem[0],
                        vol: citem[1],
                        open: citem[2],
                        high: citem[3],
                        low: citem[4],
                        close: citem[5],
                        percent: citem[7],
                        pb: citem[13],
                    });
                });
                console.log(body.data.symbol, '获取记录数', tmp1.length);
                if (tmp1.length > 0) {
                    await collection.insertMany(tmp1);
                    console.log('插入成功', body.data.symbol);
                    if(i < data.length) {
                        return resolve(this.startCraw(data, i+1));
                    }
                    return resolve(true);
                }else{
                    return reject(new Error('无法插入数据'));
                }
            }
        })
        
    }
}

module.exports = Craw;
