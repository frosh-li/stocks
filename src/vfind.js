/**
 * 价值投资股票分析
 */

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
            
            this.yearlines = await this.db.collection("yearlines", { safe: true });
            this.stocks = await this.db.collection("stocks", { safe: true });
            await this.yearlines.remove();
            await this.db.createCollection("yearlines");
            await this.yearlines.createIndex({
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
        this.CrawYear();
    }

    CrawYear() {
        let db = this.db;
        if (!db) {
            setTimeout(() => {
                this.CrawYear();
            }, 100);
            return;
        }
        db.collection('stocks', { safe: true }, (err, collection) => {
            collection.find(
                {},
                { safe: true },

                async (err, result) => {
                    let data = await result.toArray();
                    console.log('data length', data.length)
                    this.RunCraw(data); // 目前只抓取一个股票的测试数据
                    // this.RunCraw([{
                    //     name: '新集能源',
                    //     symbol: 'SH601668'
                    // }])
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
            console.log(JSON.stringify(this.allStocks));
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
        let url = `https://stock.xueqiu.com/v5/stock/finance/cn/indicator.json?symbol=${item.symbol}&type=Q4&is_detail=true&count=3`;
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
        if (body && body.data && body.data.list && body.data.list.length === 3) {
            // 三年的数据都需要满足超过15%的增长
            let avg_roe_ok = true;
            const listData = [];
            body.data.list.forEach(item => {
                listData.push({
                    "净资产收益率": item.avg_roe[0],
                    "资产负债率": item.asset_liab_ratio[0],
                    "毛利率": item.gross_selling_rate[0],
                })
                if(item.avg_roe[0] < 15) {
                    avg_roe_ok = false;
                }
            });
            if(!avg_roe_ok) {
                // 不满足终止 并开始下一次的逻辑
                this.startCraw(data);
                return;
            };
            // 满足条件

            // 获取其他相关参数

            try {
                const fdata = await Promise.all([
                    // 从中获取 资产合计（总资产）、应付账款、预收款项、短期借款、货币资金
                    rp({
                        uri: `https://stock.xueqiu.com/v5/stock/finance/cn/balance.json?symbol=${item.symbol}&type=Q4&is_detail=true&count=3`,
                        json: true,
                        headers: this.headers,
                        //   resolveWithFullResponse: true,
                        gzip: true,
                        jar: this.cookiejar
                    }),
                    // 从中获取 利润总额（利润）、营业收入、营业成本、财务费用、营业外收入、营业外支出
                    rp({
                        uri: `https://stock.xueqiu.com/v5/stock/finance/cn/income.json?symbol=${item.symbol}&type=Q4&is_detail=true&count=3`,
                        json: true,
                        headers: this.headers,
                        //   resolveWithFullResponse: true,
                        gzip: true,
                        jar: this.cookiejar
                    }),
                ]);
                
                fdata[0] && fdata[0].data && fdata[0].data.list.forEach((item,index) => {
                    listData[index] = {
                        ...listData[index],
                        "总资产": item.total_assets[0],
                        "应付账款": item.accounts_payable[0],
                        "预收款项": item.pre_receivable[0],
                        "短期借款": item.st_loan[0],
                        "货币资金": item.currency_funds[0],
                    };
                });

                fdata[1] && fdata[1].data && fdata[1].data.list.forEach((item,index) => {
                    listData[index] = {
                        ...listData[index],
                        "利润": item.profit_total_amt[0],
                        "营业收入": item.total_revenue[0],
                        "营业成本": item.operating_costs[0],
                        "财务费用": item.financing_expenses[0],
                        "营业外收入": item.non_operating_income[0],
                        "营业外支出": item.non_operating_payout[0],
                    };
                });
            } catch (e) {
                console.log('获取相关财务数据出错', item.symbol)
            }
            console.log(JSON.stringify(listData))
            // 进行8项检测
            let nopass = new Set();
            // 检查资产负债率
            listData.forEach(item => {
                // 如果资产负债率大于50，判定第一条不合格
                if(item['资产负债率'] > 50) {
                    nopass.add('资产负债率');
                }

                // 毛利率要求30以上
                if(item['毛利率'] < 30) {
                    nopass.add('毛利率');
                }

                // 3. 应付账款：占比营业成本15%以上
                if(item['应付账款']/item['营业成本'] < 0.15) {
                    nopass.add('应付账款');
                }

                // 4. 预收账款：比营业收入15%以上
                if(item['预收款项']/item['营业收入'] < 0.15) {
                    nopass.add('预收款项')
                }

                // 5. 短期借款：占比货币资金10%以下
                if(item['短期借款'] / item['货币资金'] > 0.1) {
                    nopass.add('短期借款');
                }

                // 6. 货币资金：比总资产20%以上
                if(item['货币资金'] / item['总资产'] < 0.2) {
                    nopass.add('货币资金');
                }

                // 7. 财务费用：占比利润5%以下，负数最好
                if(item['财务费用'] / item['利润'] > 0.05) {
                    nopass.add('财务费用');
                }

                // 8. 营业外收如/支出：相对于营业收入、支出5%以下，而且没有陡然增大

                if(item['营业外收入'] / item['营业外支出'] > 0.05) {
                    nopass.add('营业外收入');
                }

            });
            console.log(nopass);
            if(nopass.size <= 4) {
                this.allStocks.push({
                    symbol: item.symbol,
                    name: item.name,
                    data: listData,
                })
            }
            
            console.log('满足三年净资产收益率', item.symbol, item.name);
        }
        setTimeout(() => {
            this.startCraw(data);
        }, 10);
    }
}

(new Craw()).run();
