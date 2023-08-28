import pymongo
from pymongo import MongoClient
import pandas as pd 
from datetime import date
current_date = date.today() 

client = pymongo.MongoClient('mongodb://localhost:27017')
database = client['pacefin']
collection = database['submitdatas'] 
data = collection.find() 
new_data = list(data)   
collection.drop() 
userID = []
Alloted_Abbr = [] 
Executed_Abbr = [] 
Alloted_Qty = [] 
Executed_Qty = [] 
MtoM = [] 
Name = [] 
Team = [] 
Strategy_type = [] 
Strategy_name = [] 
Instrument = [] 

for obj in new_data: 
    for item in obj['items']:
        userID.append(item['Id'])   
        Alloted_Abbr.append(item['Alloted_Abbr'])  
        Executed_Abbr.append(item['Executed_Abbr'])  
        Alloted_Qty.append(item['Alloted_Qty'])  
        Executed_Qty.append(item['Executed_Qty'])  
        MtoM.append(item['MtoM'])  
        Name.append(item['Name'])  
        Team.append(item['Team'])  
        Strategy_type.append(item['Strategy_type'])  
        Strategy_name.append(item['Strategy_name'])   
        Instrument.append(item['Instrument'])  

df0 = pd.DataFrame({'userID':userID})  
df1 = pd.DataFrame({'Alloted_Abbr':Alloted_Abbr}) 
df2 = pd.DataFrame({'Executed_Abbr':Executed_Abbr}) 
df3 = pd.DataFrame({'Alloted_Qty':Alloted_Qty})  
df4 = pd.DataFrame({'Executed_Qty':Executed_Qty}) 
df5 = pd.DataFrame({'MtoM':MtoM}) 
df6 = pd.DataFrame({'Name':Name}) 
df7 = pd.DataFrame({'Team':Team}) 
df8 = pd.DataFrame({'Strategy_type':Strategy_type}) 
df9 = pd.DataFrame({'Strategy_name':Strategy_name}) 
df10 = pd.DataFrame({'Instrument':Instrument}) 

df_combined = pd.concat([df0,df1,df2,df3,df4,df5,df6,df7,df8,df9,df10], axis=1) 
df_combined.to_excel(rf"{current_date}_trade_report.xlsx")   
file_path = (r"C:\Users\user1\Desktop\Amit\master_trade_report.xlsx") 
old_df = pd.read_excel(file_path) 
new_df_combined = pd.concat([df_combined,old_df],axis = 1) 
new_df_combined.to_excel(file_path)