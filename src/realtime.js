/**
 * 实时获取资金流
 */
const request = require('request-promise-native');

const moment = require('moment');
const year = moment().subtract(1, 'day').year();
const month = (moment().subtract(1, 'day').month() + 1).toString().padStart(2, '0');
let day = moment().subtract(1, 'day').date().toString().padStart(2, '0');

console.log(year, month, day);
const fetch = require('node-fetch');
// 引入 events 模块
const events = require('events');
// 创建 eventEmitter 对象
const eventEmitter = new events.EventEmitter();
const fork = require('child_process').fork;
const maxProcess = 10;
const fs = require('fs');
const datapath = 'datas/' + moment().format('YYYY-MM-DD');
if (!fs.existsSync(datapath)) {
  fs.writeFile(datapath, "", () => {});
}

let startLen = 1;



let mainStocks = [];
 // 获取换手率6%以上的股票
const results = {};
let counts = 0;
eventEmitter.on('request:done', function(code) { 
  counts++;
  if(counts.length === mainStocks.length) {
    // 所有的结束
    console.log('开始下一轮数据抓取');
    counts = 0;
    setTimeout(() => {
      const tmpStocks = [...mainStocks];
      realtime(tmpStocks);
    }, 60000);
  }
}); 

(async() => {
  const MongoClient = require("mongodb").MongoClient;
  const url = "mongodb://localhost:27017";
  let singles, db;
  MongoClient.connect(url,{ useNewUrlParser: true }, async (err, client) => {
    console.log("数据库连接成功");
    db = await client.db("stocks");
    singles = await db.collection("singles", { safe: true });
        
    const lastDay = await singles.find({}).sort({timestamp: -1}).limit(1);
    const lastDayRes = await lastDay.toArray();
    console.log(lastDayRes)
    const res = await singles.find({timestamp: lastDayRes[0].timestamp, turnoverrate: {$gte: 4}});
    const ret = await res.toArray();
    const stocks = ret.map(item => ({Code: item.symbol.substring(2), Name: item.symbol}));
    console.log('stocks', stocks)
    mainStocks = [...stocks];
    console.log('总数量为', stocks.length);
    startFork(stocks);
  })
  
  
  // return;
  // setTimeout(function() {
  //   const hours = moment().hours();
  //   const minute = moment().minute();
  //   console.log('当前时间', hours, '时', minute, '分');
  //   if(
  //     (hours === 9 && minute >= 30) //9点30正式开盘
  //     ||
  //     (hours === 10)
  //     ||
  //     (hours === 11 && minute <= 30)
  //     ||
  //     (hours >= 13 && hours <= 15)
  //    ) {
  //       startFork(stocks);
  //   }else{
  //     console.log('没到开盘时间');
  //     setTimeout(arguments.callee,1000);
  //   }
  // }, 1000)
  
})();

const subs = {};
const processes = {}
for(let i = 0 ; i < maxProcess ; i++) {
  let child = fork('./src/sub.js');
  child.on('message', (msg) => {
    if(msg.status === 'free') {
      subs[msg.pid] = {
        status: msg.status,
        child: child,
      };
      if(!processes[msg.pid]) {
        processes[msg.pid] = child;
      }
    }
    if(msg.status === 'busy') {
      subs[msg.pid] = {
        status: msg.status,
        child: child,
      };
    }
  })
}

function startFork(stocks) {
  
  if(stocks.length === 0) {
    console.log('本轮已经结束');
    setTimeout(() => {
      startFork([...mainStocks]);
    }, 60000);
    return;
  }
  for(let key in subs) {
    if(subs[key].status === 'free') {
      const stock = stocks.shift();
      if(!stock) {
        break;
      }
      // subs[key].child.send({...stock});
      processes[key].send({...stock});
      
      break;
    }
  }
  setTimeout(() => {
    startFork(stocks);
  }, 10);
}




