import pandas as pd 
from pymongo import MongoClient 
from itertools import groupby
import json 
import datetime 
from datetime import date 
from datetime import datetime
import os  
def trade_history():
    folder_path = r"C:\Users\Administrator\Desktop\trade_history_files"
    file_list = os.listdir(folder_path)  
    dates = []
    for file in file_list: 
            file_path = os.path.join(folder_path, file)  
            date_str = str(file_path[-13:-5])
            date_str = datetime.strptime(date_str,"%d%m%Y").date() 
            dates.append(date_str)        
    max_date = max(dates).strftime("%d%m%Y")        
    trade_history_file2= rf"C:\Users\Administrator\Desktop\trade_history_files\Compliance{max_date}.xlsx"    
    trade_history_file  =pd.read_excel(trade_history_file2)
    df = pd.DataFrame(trade_history_file)  

    column_maping = { 
        df.columns[0]:"name",
        df.columns[1]:"strategy_type",
        df.columns[2]:"strategy_name",
        df.columns[3]:"abbr",
        df.columns[4]:"inst_name", 
        df.columns[5]:"cluster",
        df.columns[6]:"quantity"
    } 

    df.rename(columns=column_maping, inplace=True) 

    constant_file = pd.read_excel(r"C:\Users\Administrator\Desktop\backend_files\GREEK_FILE.xlsx") 
    constant_df = pd.DataFrame(constant_file) 
    constant_df["name"] = constant_df["name"].str.title()    

    #getting traders with no strategies from greek file
    traders_with_no_strategies = []
    for person in constant_df["name"].unique():
        if person not in df["name"].unique():
            traders_with_no_strategies.append(person)
    traders_with_no_strategies = pd.DataFrame(traders_with_no_strategies, columns=["name"]) 
    ###apeending those names in compliance df
    j=0
    for i in range(len(df)+1,len(df)+len(traders_with_no_strategies)+1):
        df.loc[i,"name"] = traders_with_no_strategies.loc[j,"name"]
        j = j+1

    ###### Team Names fetched that to be assigned to compliance df
    constant_file2 = pd.read_excel(r"C:\Users\Administrator\Desktop\backend_files\team_name.xlsx") 
    constant_df2 = pd.DataFrame(constant_file2) 
    constant_df2["team_name"] = constant_df2["team_name"].str.title()   

    #### to give userIDs corresponding to names
    merged_df  = pd.merge(df,constant_df,on = "name", how = "left") 

    ### to give team name corresponding to userID
    merged_df2  = pd.merge(merged_df,constant_df2,on = "userID", how = "left") 

    merged_df2.drop(merged_df2.columns[merged_df2.columns.str.contains('^Unnamed')], axis=1, inplace=True) 
   
    merged_df2["userID2"] = merged_df2["userID"]

    current_date = date.today() 

    merged_df2['date']= current_date.strftime("%Y-%m-%d") 
    json_data = merged_df2.to_json(orient='records')   
    data =json.loads(json_data)
    grouped_data = {}   
    for item in data:   
        user_id = item['userID'] 
        if user_id is not None:
            if user_id in grouped_data: 
                grouped_data[user_id].append(item)
            else:
                grouped_data[user_id] = [item]   
      
    def append_to_mongo(collection_name, data_to_be_appended):  
        """
        This function uploads data (Compliance strategies, along with, team name, userID) to MongoDB server
        """
        client = MongoClient('mongodb://localhost:27017') 
        db = client['pacefin'] 
        collection = db[collection_name]                                                                         
        collection.drop()  
        collection = db[collection_name]

        for key, value in data_to_be_appended.items():

            for item in value:
                t_n = item["team_name"]
                n = item["name"] 
                q = item["quantity"]
            if q is None:
                document = {'userID': key,'name':n,'team_name':t_n,}
            else:
                #items bole to strategies, items ==strategies.
                document = {'userID': key,'name':n,'team_name':t_n,'items': value,}
            collection.insert_one(document) 
        client.close()


    append_to_mongo('tradehistories',grouped_data)     

    print(f"trade_histories_updated_with_file_path {trade_history_file2}") 

    
    return max_date