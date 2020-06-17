import pymongo
import pandas as pd

client = pymongo.MongoClient('localhost', 27017)
db = client['stocks']
single = db['singles']

data = pd.DataFrame(list(single.find()))

print(data)