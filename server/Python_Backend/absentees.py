import pandas as pd 
from pymongo import MongoClient
import json

def absentees():
    df1 = pd.read_excel(r"C:\Users\Administrator\Desktop\backend_files\master_sheet.xlsx",sheet_name='Sheet1')
    df2 = pd.read_excel(r"C:\Users\Administrator\Desktop\backend_files\master_sheet.xlsx",sheet_name='Sheet2')

    merged_df = pd.merge(df2, df1[['userID', 'name']], on='userID', how='left')

    json_attendance =merged_df.to_json(orient='records')
    client = MongoClient('mongodb://localhost:27017') 
    db =client['pacefin']
    collection = db['attendances']   
    collection.drop() 
    collection = db['attendances']  
    collection.insert_many(json.loads(json_attendance))  
    client.close() 
    # print("attendance_updated")    
# absentees()