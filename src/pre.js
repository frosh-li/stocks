/**
 * 提前一日获取股票相关信息
 */
const request = require('request-promise-native');
const redis = require('redis');
const { promisify } = require("util");

const moment = require('moment');
const year = moment().subtract(1, 'day').year();
const month = (moment().subtract(1, 'day').month() + 1).toString().padStart(2, '0');
let day = moment().date().toString().padStart(2, '0');
const keyword = encodeURIComponent(`${year}年${month}月${day}日并且沪深并且换手率>6`);
const LIST_BY_HUANSHOU = `http://searchapi.eastmoney.com/bussiness/Web/StockAnalysis?keyword=${keyword}&pi=1&ps=1000&sort=TurnoverRate%7C1&_=${Date.now()}`;
let client = redis.createClient(6379, '127.0.0.1');   // 监听消费者
const setAsync = promisify(client.set).bind(client);
console.log(year, month, day);
console.log(LIST_BY_HUANSHOU);
(async () => {
  try {
    const res = await request(LIST_BY_HUANSHOU, {
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": "em-quote-version=topspeed; intellpositionL=1492px; ct=TweEY9L5Ha5wEXu7KuDTfH05YWeWQzdV_7KyVgxy1Fygl18gbrbSkJQGXossE0eYSSogdTDR4mOrL6L8jpvObm28-MOySXS9hlJl0XwIZfL7Uqo_pLZeKOH7-C09M4M9adJobLba-V7Nn0ACLn22dn0KpNVKs70BxryoYTA2-OU; ut=FobyicMgeV5muwwBvHCVNyOtzx9P5Fn3Jai8REsEz_3_DtagvYE3kWBkM7U6WomG2yXfM3zTK8rZtsA_OxJkaoMmo5ba4gtE1UdXnT4_iscePIajS3sJ7_7zp8IVvBKewX-HAsPXke-hSHg1XQ5DTuuv2PxGKyB6oUJE5AZhVgPG-yHykfiOLrVSFPpv1p8ZU4v7gWmITJQNXVl922Go1pQCoGGwRCqmwINvsOr89Ef6K-6rqOIztNjYZRVFM3i4SCFfkiZoSqJrQE5UapnF7KCEx4vpA3Jl; pi=8548375522681702%3bd8548375522681702%3b%e7%82%92%e8%82%a1%e4%b8%8d%e4%ba%8f%e6%9c%ac%3boO7b%2bTuSiigXT%2byDckrbYAp6nSuLnLgFnEQ4ysitXwx8%2fYpSrLfoaDmCN2OItDBEYbORUOGKdozk9MG57qFxF361owjbQq8U7NYPi1WhkQspzIZXt6VgeX5%2b%2bj0SKoy9%2bD5JQsHlbJy8f2wjEGrfmCCWrC5pBEcncrBuqiz4ZexrGJprI2UaH7Ouf%2bHHor5AWH354kHl%3bKZGuDT2z6XrcKRt%2bMOV2QUbri%2f7uT4M0sTOjR0vnW2qUcjmAnEh%2fyYt48F4nLah0khRsAirxokaWB5sCe5dfsHb0viPUzaOfd4z0HwI%2bgUrB4YgAW%2f99mtAyYFX4rPOopuh%2fs0mTOuEcqBr%2bQ%2fhrAD8ydU5Uug%3d%3d; uidal=8548375522681702%e7%82%92%e8%82%a1%e4%b8%8d%e4%ba%8f%e6%9c%ac; sid=133019707; vtpst=%7c; _qddaz=QD.cg33yp.uvjfoh.ka8b4kgi; cowminicookie=true; pgv_pvi=8658766848; EMFUND1=null; EMFUND2=null; EMFUND3=null; EMFUND4=null; EMFUND5=null; EMFUND6=null; EMFUND7=null; EMFUND8=null; EMFUND0=null; EMFUND9=06-05 18:06:50@#$%u94F6%u6CB3%u521B%u65B0%u6210%u957F%u6DF7%u5408@%23%24519674; cowCookie=true; qgqp_b_id=8f8988e3153dbeacc8cae8e101720fcb; intellpositionT=455px; st_si=15505972165744; em_hq_fls=old; emshistory=%5B%22%E6%8D%A2%E6%89%8B%E7%8E%87%E5%A4%A7%E4%BA%8E6%252020%E5%B9%B406%E6%9C%8817%E6%97%A5%22%2C%22%E6%8D%A2%E6%89%8B%E7%8E%87%E5%A4%A7%E4%BA%8E6%25%22%2C%222020%E5%B9%B406%E6%9C%8817%E6%97%A5%E5%B9%B6%E4%B8%94%E6%B2%AA%E6%B7%B1%E5%B9%B6%E4%B8%94%E6%8D%A2%E6%89%8B%E7%8E%87%E5%A4%A7%E4%BA%8E6%22%2C%222020%E5%B9%B406%E6%9C%8817%E6%97%A5%E5%B9%B6%E4%B8%94%E6%B2%AA%E6%B7%B1%E5%B9%B6%E4%B8%94%E6%8D%A2%E6%89%8B%E7%8E%87%3E6%22%2C%222020%E5%B9%B406%E6%9C%8817%E6%97%A5%E6%B2%AA%E6%B7%B1%E5%B9%B6%E4%B8%94%E6%8D%A2%E6%89%8B%E7%8E%87%3E6%22%2C%22%E6%98%A8%E6%97%A5%E6%8D%A2%E6%89%8B%E7%8E%87%E5%A4%A7%E4%BA%8E6%25%E7%9A%84%E8%82%A1%E7%A5%A86%E6%9C%8810%E6%97%A5%22%2C%22%E6%98%A8%E6%97%A5%E6%8D%A2%E6%89%8B%E7%8E%87%E5%A4%A7%E4%BA%8E6%25%E7%9A%84%E8%82%A1%E7%A5%A8%22%2C%22%E4%B8%AD%E9%9D%92%E5%AE%9D6%E6%9C%8810%E6%97%A5%E8%B5%84%E9%87%91%E6%B5%81%E5%90%91%E5%9B%BE%22%2C%22%E9%B8%BF%E6%B3%89%E7%89%A9%E8%81%94%22%2C%22YDGF%22%2C%22%E7%9B%9B%E6%B4%8B%E7%A7%91%E6%8A%80%22%2C%22SYGF%22%2C%22FCGF%22%2C%22%E6%8A%96%E9%9F%B3%E6%A6%82%E5%BF%B5%22%2C%22688505%22%2C%22%E4%B8%AD%E8%8A%AF%E5%9B%BD%E9%99%85%22%2C%22%E6%B5%B7%E5%8D%97%E6%9D%BF%E5%9D%97%22%2C%22002498%22%2C%22%E7%AB%8B%E9%9C%B8%E8%82%A1%E4%BB%BD%22%2C%22%E4%B8%A4%E9%9D%A2%E9%92%88%22%5D; HAList=a-sz-300059-%u4E1C%u65B9%u8D22%u5BCC%2Ca-sz-300495-%u7F8E%u5C1A%u751F%u6001%2Ca-sz-002985-%u5317%u6469%u9AD8%u79D1%2Ca-sh-603823-%u767E%u5408%u82B1%2Ca-sh-603687-%u5927%u80DC%u8FBE%2Ca-sh-603917-%u5408%u529B%u79D1%u6280%2Ca-sh-600418-%u6C5F%u6DEE%u6C7D%u8F66%2Ca-sz-002079-%u82CF%u5DDE%u56FA%u951D%2Ca-sz-002980-%u534E%u76DB%u660C%2Ca-sz-002838-%u9053%u6069%u80A1%u4EFD%2Ca-sh-603937-%u4E3D%u5C9B%u65B0%u6750%2Ca-sz-002581-%u672A%u540D%u533B%u836F%2Ca-sh-603823-%u767E%u5408%u82B1; st_pvi=68851343250135; st_sp=2020-04-19%2017%3A52%3A19; st_inirUrl=https%3A%2F%2Fwww.baidu.com%2Fs; st_sn=100; st_psi=20200617174848998-118000300904-6227143155; st_asi=delete",
        "Host": "searchapi.eastmoney.com",
        "Pragma": "no-cache",
        "Referer": "http://so.eastmoney.com/web/s?keyword="+keyword,
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
      },
      gzip: true,
      json: true,
    });

    const stocks = res.Data.StockDatas;
    console.log('stocks', stocks)
    console.log('总数量为', stocks.length);

    stocks.forEach(async stock => {
      const code = stock.Code;
      const pre = code.toString()[0] === '6' ? 1 : 0;
      const realtimePrice = `http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f163,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f250,f251,f252,f253,f254,f255,f256,f257,f258,f266,f269,f270,f271,f273,f274,f275,f127,f199,f128,f193,f196,f194,f195,f197,f80,f280,f281,f282,f284,f285,f286,f287,f292&secid=${pre}.${code}&_=${+Date.now()}`
      console.log('获取股票市值', code);
      const cbody = await request(realtimePrice, {
        json: true,
        headers: {
          'keep-alive': true,
        }
      });
      percent = cbody.data.f170;
      bk = cbody.data.f127; // 板块信息
      ltsz = cbody.data.f117; // 流通市值
      await setAsync(`stock:${moment().format("YYYY-MM-DD")}:${code}:${stock.Name}`, JSON.stringify({
        bk,
        ltsz,
        percent,
      }))
      console.log('存储股票市值完成', code);
    })
  }catch(e) {
    console.log(e)
  }
})()
