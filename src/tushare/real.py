import tushare as ts

df = ts.get_realtime_quotes('300583') #Single stock symbol
ds = df[['code','name','price','bid','ask','volume','amount','time']]
print(ds)