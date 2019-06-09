/**
 * 分析主升浪
 */
const moment = require("moment");
let out = [];
// 生产对应的日期
let now = +new Date("2019-06-07");
let fIndex = 0;
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const server = new mongodb.Server("localhost", 27017, { auto_reconnect: true });
let singles, stocks;
MongoClient.connect(url, async (err, client) => {
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
    // let allStocks = await getStockList();
    let allStocks = [
        { symbol: "SZ300587" },
        { symbol: "SZ300590" },
        { symbol: "SH600191" },
        { symbol: "SZ300091" },
        { symbol: "SZ300412" },
        { symbol: "SH600727" },
        { symbol: "SH603177" },
        { symbol: "SH600345" },
        { symbol: "SZ002592" },
        { symbol: "SZ300213" },
        { symbol: "SH600237" },
        { symbol: "SZ002496" },
        { symbol: "SZ000933" },
        { symbol: "SH600093" },
        { symbol: "SH601068" },
        { symbol: "SH603616" },
        { symbol: "SZ002730" },
        { symbol: "SZ002864" },
        { symbol: "SZ002810" },
        { symbol: "SZ000027" },
        { symbol: "SH600192" },
        { symbol: "SZ300007" },
        { symbol: "SZ000801" },
        { symbol: "SH601880" },
        { symbol: "SZ002545" },
        { symbol: "SZ000576" },
        { symbol: "SH900940" },
        { symbol: "SZ002063" },
        { symbol: "SH600316" },
        { symbol: "SH603063" },
        { symbol: "SH600644" },
        { symbol: "SZ300348" },
        { symbol: "SZ300151" },
        { symbol: "SH603990" },
        { symbol: "SH600810" },
        { symbol: "SH600862" },
        { symbol: "SH600117" },
        { symbol: "SH603339" },
        { symbol: "SH603260" },
        { symbol: "SZ000426" },
        { symbol: "SZ002746" },
        { symbol: "SZ002211" },
        { symbol: "SH600072" },
        { symbol: "SH600403" },
        { symbol: "SH603706" },
        { symbol: "SH600809" },
        { symbol: "SZ300008" },
        { symbol: "SH600640" },
        { symbol: "SH603999" },
        { symbol: "SH600378" },
        { symbol: "SH600227" },
        { symbol: "SZ002261" },
        { symbol: "SZ300229" },
        { symbol: "SZ300451" },
        { symbol: "SH601811" },
        { symbol: "SH600010" },
        { symbol: "SH600332" },
        { symbol: "SH600004" },
        { symbol: "SH601116" },
        { symbol: "SZ002299" },
        { symbol: "SZ300359" },
        { symbol: "SH600726" },
        { symbol: "SZ002114" },
        { symbol: "SH601208" },
        { symbol: "SH601012" },
        { symbol: "SH600250" },
        { symbol: "SZ002378" },
        { symbol: "SH600571" },
        { symbol: "SZ000650" },
        { symbol: "SH601678" },
        { symbol: "SH600293" },
        { symbol: "SZ300386" },
        { symbol: "SZ000732" },
        { symbol: "SZ002842" },
        { symbol: "SZ002373" },
        { symbol: "SZ002312" },
        { symbol: "SH603886" },
        { symbol: "SZ002140" },
        { symbol: "SZ002413" },
        { symbol: "SH600107" },
        { symbol: "SZ002240" },
        { symbol: "SZ002482" },
        { symbol: "SZ300675" },
        { symbol: "SZ300169" },
        { symbol: "SZ002075" },
        { symbol: "SZ300751" },
        { symbol: "SH603803" },
        { symbol: "SZ002463" },
        { symbol: "SZ002346" },
        { symbol: "SH600026" },
        { symbol: "SH600198" },
        { symbol: "SZ002043" },
        { symbol: "SH603725" },
        { symbol: "SH600526" },
        { symbol: "SZ002582" },
        { symbol: "SH600726" },
        { symbol: "SZ002288" },
        { symbol: "SZ300620" },
        { symbol: "SZ002536" },
        { symbol: "SZ002098" },
        { symbol: "SH600112" },
        { symbol: "SZ000795" },
        { symbol: "SH601952" },
        { symbol: "SZ300086" },
        { symbol: "SH600704" },
        { symbol: "SZ000415" },
        { symbol: "SZ300767" },
        { symbol: "SZ000528" },
        { symbol: "SZ000638" },
        { symbol: "SZ002202" },
        { symbol: "SH600538" },
        { symbol: "SZ200058" },
        { symbol: "SH603198" },
        { symbol: "SZ002746" },
        { symbol: "SH603218" },
        { symbol: "SH600459" },
        { symbol: "SZ300116" },
        { symbol: "SZ300368" },
        { symbol: "SZ002212" },
        { symbol: "SZ002850" },
        { symbol: "SH603060" },
        { symbol: "SZ000880" },
        { symbol: "SZ002599" },
        { symbol: "SZ300138" },
        { symbol: "SH601908" },
        { symbol: "SZ002871" },
        { symbol: "SZ002412" },
        { symbol: "SZ300209" },
        { symbol: "SZ002952" },
        { symbol: "SZ002548" },
        { symbol: "SH600070" },
        { symbol: "SH600810" },
        { symbol: "SH600705" },
        { symbol: "SZ000969" },
        { symbol: "SZ002016" },
        { symbol: "SH601880" },
        { symbol: "SZ000532" },
        { symbol: "SZ300579" },
        { symbol: "SH600792" },
        { symbol: "SZ000617" },
        { symbol: "SZ002683" },
        { symbol: "SH600066" },
        { symbol: "SH600643" },
        { symbol: "SH601011" },
        { symbol: "SH603696" },
        { symbol: "SZ000710" },
        { symbol: "SZ300351" },
        { symbol: "SZ300449" },
        { symbol: "SZ000503" },
        { symbol: "SZ002092" },
        { symbol: "SH600283" },
        { symbol: "SH601588" },
        { symbol: "SZ002762" },
        { symbol: "SZ300229" },
        { symbol: "SZ002099" },
        { symbol: "SZ300025" },
        { symbol: "SH601216" }
    ];
    parse(allStocks);
}

async function parse(data) {
    let currentStock = data[fIndex];
    if (!currentStock) {
        // console.log('所有的操作结束');
        fIndex = 0;
        now = +moment(now).subtract(1, "days");
        if (now < new Date("2019-01-01")) {
            console.log("全年全部完成");
            console.log(JSON.stringify(out));
            return;
        }
        await parse(data);
        return;
    }
    fIndex++;
    console.log("开始分析", moment(now), currentStock);
    let res = await singles
        .find({ symbol: currentStock.symbol, timestamp: { $lt: now } })
        .sort({ timestamp: -1 })
        .limit(6);
    let resArray = await res.toArray();
    if (resArray.length < 6) {
        // now = +moment(now).subtract(-1, 'days');
        await parse(data);
        // console.log('当天没有找到');
        return;
    }
    // 第一天跌 后三天涨 第5天跌 第六天涨
    if (
        resArray[5].percent < 0 &&
        resArray[4].percent > 1 &&
        resArray[4].percent <= 10 &&
        resArray[3].percent > 1 &&
        resArray[3].percent <= 10 &&
        resArray[2].percent >= 5 &&
        resArray[2].percent <= 10 &&
        resArray[1].percent < 0 &&
        resArray[1].percent >=-5 && 
        resArray[4].vol > resArray[5].vol &&
        resArray[3].vol > resArray[4].vol &&
        resArray[2].vol > resArray[3].vol &&
        resArray[1].vol < resArray[2].vol &&
        resArray[5].close < resArray[5].open && 
        resArray[4].close > resArray[4].open &&
        resArray[3].close > resArray[3].open &&
        resArray[2].close > resArray[2].open &&
        resArray[1].close < resArray[1].open
    ) {
        console.log(
            moment(resArray[5].timestamp),
            moment(resArray[4].timestamp),
            moment(resArray[3].timestamp),
            moment(resArray[2].timestamp),
            moment(resArray[1].timestamp)
        );
        console.log("后天涨幅", currentStock, resArray[0].percent, new Date(resArray[0].timestamp));
        out.push({
            symbol: currentStock,
            percent: resArray[0].percent,
            timestamp: new Date(resArray[0].timestamp)
        });
    }
    await parse(data);
}
