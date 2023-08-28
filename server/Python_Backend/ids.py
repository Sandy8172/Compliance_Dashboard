##To add new members just update the df2 file and run this code

import json  
import pandas as pd 
from pymongo import MongoClient

def ids():
    df2 = pd.read_excel(r"C:\Users\Administrator\Desktop\backend_files\user_id_password.xlsx")
    json_ids =df2.to_json(orient='records')
    client = MongoClient('mongodb://localhost:27017') 
    db =client['pacefin']
    collection = db['ids']   
    collection.drop()
    collection = db['ids']   
    collection.insert_many(json.loads(json_ids)) 
    client.close() 
    print("User Id's updated")