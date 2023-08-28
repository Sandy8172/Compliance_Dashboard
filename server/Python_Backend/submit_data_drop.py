#dropping_submitted_datas
import pymongo 
from pymongo import MongoClient 
def submit_data_drop():
    client = pymongo.MongoClient('mongodb://localhost:27017')
    database = client['pacefin']
    collection = database['submitdatas'] 
    data = collection.find() 
    new_data = list(data)   
    collection.drop() 
    print("Submit_data_dropped")
