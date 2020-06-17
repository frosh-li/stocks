console.log('child pid: ' + process.pid, process.argv[2]);
const redis = require('redis');
const { promisify } = require("util");
const proxy = process.argv[2];
var styles = {
  'bold'          : ['\x1B[1m',  '\x1B[22m'],
  'italic'        : ['\x1B[3m',  '\x1B[23m'],
  'underline'     : ['\x1B[4m',  '\x1B[24m'],
  'inverse'       : ['\x1B[7m',  '\x1B[27m'],
  'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
  'white'         : ['\x1B[37m', '\x1B[39m'],
  'grey'          : ['\x1B[90m', '\x1B[39m'],
  'black'         : ['\x1B[30m', '\x1B[39m'],
  'blue'          : ['\x1B[34m', '\x1B[39m'],
  'cyan'          : ['\x1B[36m', '\x1B[39m'],
  'green'         : ['\x1B[32m', '\x1B[39m'],
  'magenta'       : ['\x1B[35m', '\x1B[39m'],
  'red'           : ['\x1B[31m', '\x1B[39m'],
  'yellow'        : ['\x1B[33m', '\x1B[39m'],
  'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
  'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
  'blackBG'       : ['\x1B[40m', '\x1B[49m'],
  'blueBG'        : ['\x1B[44m', '\x1B[49m'],
  'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
  'greenBG'       : ['\x1B[42m', '\x1B[49m'],
  'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
  'redBG'         : ['\x1B[41m', '\x1B[49m'],
  'yellowBG'      : ['\x1B[43m', '\x1B[49m']
}

function log (key, obj) {
  if (typeof obj === 'string') {
      console.log(styles[key][0] + '%s' + styles[key][1], obj)
  } else if (typeof obj === 'object') {
      console.log(styles[key][0] + '%o' + styles[key][1], obj)
  } else {
      console.log(styles[key][0] + '%s' + styles[key][1], obj)
  }
}
const request = require('request-promise-native');
const moment = require('moment');
const fetch = require('node-fetch');
const dingding = 'https://oapi.dingtalk.com/robot/send?access_token=3e255427c7770ffb88c2a55c4df6ffdf418ff6ca88d1519a4ed7c6926ad68f91';
const perCount = 3000000;
const currentSec = 100;
let client = redis.createClient(6379, '127.0.0.1');   // 监听消费者
const getAsync = promisify(client.get).bind(client);
process.on('message', async function(stock){
  process.send({status: 'busy', pid: process.pid});
  
  const code = stock.Code;
  const pre = code.toString()[0] === '6' ? 1 : 0;
  const uri = `http://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&secid=${pre}.${code}&fields1=f1,f2,f3,f7&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63`;
  
  try {
    const data = await request(uri, {
      json: true,
      // proxy: "http://" + proxy,
      headers: {
        'keep-alive': true,
      }
    });
    
    const cbodystring = await getAsync(`stock:${moment().subtract(1, 'days').format('YYYY-MM-DD')}:${code}:${stock.Name}`);
    const cbody = JSON.parse(cbodystring);
    
    const {percent, bk, ltsz} = cbody;
    if(data && data.data && data.data.klines && data.data.klines.length > 0) {
        // console.log(data.data.klines);
        // 检查10点半之前的数据，小单和中单流入，大单，超大单流出
        // console.log(data.data.klines)
        // 找到最后15个点
        let klines = [];
        if(data.data.klines.length < 3) {
          setTimeout(() => {
            process.send({status: 'free', pid: process.pid});
          }, 10)
          return;
        }
        // if(data.data.klines.length > currentSec) {
        //   data.data.klines.length = currentSec
        // }
        // data.data.klines.length = 10;
        klines = data.data.klines;
  
        
        let citem = klines[klines.length - 3].split(",");
        let passitem = klines[klines.length - 1].split(",");
        if(Number(passitem[2]) - Number(citem[2]) > 0) {
          log('yellow', [code,data.data.name,  '3分钟小单流出' , Number(passitem[2]) - Number(citem[2]), '理论值', ltsz * 0.06 / 240 * 3].join(" "));
        }else{
          log('blue', [code,data.data.name,  '3分钟小单流出' , Number(passitem[2]) - Number(citem[2]), '理论值', ltsz * 0.06 / 240 * 3].join(" "));
        }

        // 获取当前股价
        const realtimePrice = `http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292&secid=${pre}.${code}&_=${+Date.now()}`
        const cbody = await request(realtimePrice, {
          json: true,
          headers: {
            'keep-alive': true,
          }
        });
        let percent = cbody.data.f170;
        let bk = cbody.data.f127; // 板块信息
        Notify(data, pre, percent, bk);
        log('red' ,`${data.data.code} ${data.data.name} ${percent} ${bk}`);

      }
      setTimeout(() => {
        process.send({status: 'free', pid: process.pid});
      }, 10)
  }catch (e){
      console.log(e)
      setTimeout(() => {
        process.send({status: 'free', pid: process.pid});
      }, 10)
  }
});

function Notify(data,stpre=0, percent='-', bk= '') {
  fetch(dingding, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify({
      "msgtype": "markdown",
      "markdown": {
        "title":`股票推送持仓:${data.data.code} ${data.data.name} 涨幅:${percent}`,
        "text": `
        股票推送持仓:${data.data.code} ${data.data.name} ${bk} 涨幅:${percent}\n![](http://webquotepic.eastmoney.com/GetPic.aspx?nid=${stpre}.${data.data.code}&imageType=r)![](http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=${stpre}.${data.data.code}&UnitWidth=-6&imageType=KXL&EF=&AT=0&&type=&_=0.7980233069043414)
        `
      }
    })
      // {"content": `股票推送 ${data.data.code} ${data.data.name} 涨幅${percent} 板块${bk} ${moment().format('HH:mm:ss')} `}})
  })
}
process.send({status: 'free', pid: process.pid});
