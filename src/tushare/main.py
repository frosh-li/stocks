import tushare as ts
import pymongo
import json
stock_lists = ts.get_stock_basics() #获取所有股票列表

conn = pymongo.MongoClient('127.0.0.1', port=27017)
conn.db.tickdata.insert_many(json.loads(stock_lists.to_json(orient='records')))
print(stock_lists)
