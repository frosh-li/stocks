/**
 * 实时获取资金流
 */
const request = require('request-promise-native');
const proxy_list = [
  "223.247.164.77:4245",
  "182.99.40.150:4272",
  "121.56.38.120:4267",
  "106.110.96.216:4258",
  "59.35.224.66:4230",
  "114.98.163.175:4236",
  "117.94.183.43:4253",
  "125.111.150.125:4205",
  "60.168.24.7:4251",
  "223.215.19.208:4245",
  "36.57.85.160:4227",
  "60.169.94.69:4282",
  "111.72.136.136:4273",
  "221.229.25.52:4226",
  "221.210.54.231:4257",
  "220.177.145.12:4232",
  "114.104.130.45:4227",
  "115.208.46.17:4280",
  "59.58.62.180:4235",
  "106.5.192.136:4227",
]
const moment = require('moment');
const year = moment().subtract(1, 'day').year();
const month = (moment().subtract(1, 'day').month() + 1).toString().padStart(2, '0');
let day = moment().subtract(1, 'day').date().toString().padStart(2, '0');
const redis = require('redis');
const { promisify } = require("util");
let client = redis.createClient(6379, '127.0.0.1');   // 监听消费者
const keysAsync = promisify(client.keys).bind(client);
console.log(year, month, day);
const fetch = require('node-fetch');
// 引入 events 模块
const events = require('events');
// 创建 eventEmitter 对象
const eventEmitter = new events.EventEmitter();
const fork = require('child_process').fork;
const maxProcess = 10;

// 300160 秀强股份
// 300045 华力创通
// 002062 宏润建设
// 000616 海航投资
// 002151 北斗星通
// 300379 东方通
// 300598 诚迈科技


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
  const res = await keysAsync(`stock:${moment().subtract(1, 'days').format("YYYY-MM-DD")}*`)
  const stocks = res.map(item => {
    const data = item.split(":");
    return {
      Code: data[2],
      Name: data[3],
    }
  });
  // console.log('stocks', stocks);
  // stocks.length = 10;
  mainStocks = [...stocks];
  console.log('总数量为', stocks.length);
  startFork(stocks);
})();

const subs = {};
const processes = {}
for(let i = 0 ; i < maxProcess ; i++) {
  let child = fork('./src/sub.js', [proxy_list[i]]);
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




