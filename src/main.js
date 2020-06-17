const Config = require('./config');
const rp = require('request-promise-native');
const dates = require('./a');
const moment = require('moment');
// const FX = require('./find');
const MongoClient = require("mongodb").MongoClient;

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
            await this.stocks.remove();
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
                    turnoverrate: citem[8], // 换手率
                });
            });
            console.log(body.data.symbol, '获取记录数', tmp1.length);
            if (tmp1.length > 0) {
//                tmp1.forEach(async item => {
 //                   await collection.deleteMany({
 //                       symbol: item.symbol,
 //                       timestamp: item.timestamp
 //                   });
 //               });
                await collection.insertMany(tmp1);
                console.log('插入成功', body.data.symbol);
            }
        }
        setTimeout(() => {
            this.startCraw(data);
        }, 10);
    }

    async FX() {
        let db = this.db;
        if (!db) {
            setTimeout(() => {
                this.FX();
            }, 100);
            return;
        }
        // console.log(dates);
        let date1 = dates.shift();
        let date2 = dates.shift();
        if (date1 && date2) {
            // console.log(new Date(date1), new Date(date2));
            let collection = await db.collection('singles', { safe: true });
            let result = collection.find(
                { timestamp: date1, percent: { $lte: -9.9 } },
                { safe: true }
            );
            let res = await result.toArray();
            if (res.length > 0) {
                // console.log("第一天数据", new Date(date1),res);
                let symbols = [];
                res.forEach(item => {
                    symbols.push(item.symbol);
                });
                let nextDate = collection.find(
                    { timestamp: date2, symbol: { $in: symbols } },
                    { symbol: 1, percent: 1 }
                );
                let res2 = await nextDate.toArray();
                // console.log("第二天数据", new Date(date2),res2);
                let totalPercent = 0;
                res2.forEach(item => {
                    totalPercent += item.percent;
                });
                console.log('第二天总涨幅', totalPercent / res2.length);
            }

            this.FX();
        }
    }

    /**
     * 判断是否出现了十字星
     * @param {} item
     */
    star(item) {
        let ret = false;
        let dis = Math.abs(item.close - item.open);
        let bottomDis = Math.abs(Math.min(item.open, item.close) - item.low);
        let topDis = Math.abs(Math.max(item.open, item.close) - item.high);
        if (dis < bottomDis || dis < topDis) {
            ret = true;
        }
        return ret;
    }
    /**
     * 分析连续三天下跌第四天涨跌情况
     */
    async FX2() {
        let db = this.db;
        if (!db) {
            setTimeout(() => {
                this.FX2();
            }, 100);
            return;
        }
        let collection = this.collection;
        let len = dates.length;
        let curDate = dates.shift();
        // console.log(curDate);
        // if(dates.length < 5) {
        //     console.log('全部操作完成');
        //     return;
        // }
        // dates.forEach(async(date, index) => {
        // if(index === len - 3) {
        //     return;
        // }
        let date1 = dates[0];
        let date2 = dates[1];
        let date3 = dates[2];
        let date4 = dates[3];
        // let date5 = dates[4];

        let result = await collection.find(
            { timestamp: date1, percent: { $gte: 1, $lte: 10 } },
            { safe: true }
        );
        let res = await result.toArray();
        console.log('第一天数据', date1, new Date(date1), res);
        if (res.length > 0) {
            let symbols = [];
            let volMap1 = {};
            res.forEach(item => {
                if (
                    item.open < item.close
                    //   !this.star(item)
                ) {
                    symbols.push(item.symbol);
                    volMap1[item.symbol] = item.vol;
                }
            });
            let nextDate = await collection.find({
                timestamp: date2,
                symbol: { $in: symbols },
                percent: { $gte: 1, $lte: 10 }
            });
            let res2 = await nextDate.toArray();
            console.log('第二天数据', new Date(date2), res2);
            if (res2.length > 0) {
                let symbols = [];
                let volMap2 = {};
                res2.forEach(item => {
                    if (
                        item.vol >= volMap1[item.symbol] &&
                        item.vol < volMap1[item.symbol] * 2
                        //   item.open < item.close
                        //   !this.star(item)
                    ) {
                        symbols.push(item.symbol);
                        volMap2[item.symbol] = item.vol;
                    }
                });
                if (symbols.length === 0) {
                    this.FX2();
                    return;
                }
                let nextDate = await collection.find({
                    timestamp: date3,
                    symbol: { $in: symbols },
                    percent: { $gte: 5, $lte: 10 }
                });
                let res3 = await nextDate.toArray();
                console.log('第三天数据', new Date(date3), res3);
                if (res3.length > 0) {
                    let symbols = [];
                    let volMap3 = {};
                    res3.forEach(item => {
                        if (
                            item.vol > volMap2[item.symbol] &&
                            item.vol < volMap2[item.symbol] * 2
                            //   item.open < item.close
                            //   !this.star(item)
                        ) {
                            symbols.push(item.symbol);
                            volMap3[item.symbol] = item.vol;
                        }

                        // volMap[item.symbol] = item.vol;
                    });
                    if (symbols.length === 0) {
                        this.FX2();
                        return;
                    }
                    let nextDate = await collection.find({
                        timestamp: date4,
                        symbol: { $in: symbols },
                        percent: { $gte: -5, $lt: 0 }
                    });
                    let res4 = await nextDate.toArray();
                    console.log('第四天数据', res4);
                    if (res4.length > 0) {
                        let symbols = [];
                        res4.forEach(item => {
                            if (
                                item.vol < volMap3[item.symbol] &&
                                item.vol > volMap3[item.symbol] / 2
                                //   !this.star(item)
                            ) {
                                // volMap[item.symbol] = item.vol;
                                symbols.push(item.symbol);
                            }
                        });
                        console.log(symbols);
                        // if (symbols.length === 0) {
                        //   this.FX2();
                        //   return;
                        // }

                        // let nextDate = await collection
                        //   .find({
                        //     timestamp: { $gte: date5 },
                        //     symbol: { $in: symbols }
                        //   })
                        //   .sort({ timestamp: 1 })
                        //   .limit(symbols.length * 5);
                        // let res5 = await nextDate.toArray();
                        // let totalPercent = 0;
                        // let outSymbols = {};
                        // // console.log(res5);
                        // // 找到每个股票最后
                        // res5.forEach(item => {
                        //     if(!outSymbols[item.symbol]){
                        //         outSymbols[item.symbol] = [];
                        //     }
                        //     outSymbols[item.symbol].push(item);
                        // });
                        // for(let key in outSymbols) {
                        //     let avgchg = 0;
                        //     for(let i = 0 ; i < outSymbols[key].length ; i++) {
                        //         let citem = outSymbols[key][i];
                        //         avgchg += citem.percent;
                        //         if(citem.percent >= 5) {
                        //             break;
                        //         }
                        //     }
                        //     console.log('第五天个股涨幅',key, avgchg);
                        //     totalPercent += avgchg;
                        // }
                        // // console.log(
                        // //   "第四天数据",
                        // //   new Date(date4),
                        // //   res4
                        // // );
                        // console.log(
                        //   "第五天总涨幅",
                        //   new Date(date5),
                        //   totalPercent / Object.keys(outSymbols).length,
                        // );
                    }
                }
            }
        }
        // setTimeout(() => {
        //this.FX2();
        // }, 1000)

        // })
    }
}

module.exports = Craw;
