from flask import Flask,jsonify,request
from logging import exception
import pandas as pd
import numpy as np 
from absentees import absentees 
from trade_histories import trade_history
from submit_data_drop import submit_data_drop  
from ids import ids
from datetime import date 
# import xlwings as xw 
# import xlsxwriter
import warnings
from flask import Flask,jsonify
from flask_cors import CORS, cross_origin
from more_itertools import unique_everseen
warnings.filterwarnings('ignore')
from dateutil.relativedelta import relativedelta, TH , WE ,TU

today_date = date.today()
pd.set_option("display.max_columns",None)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route("/response",methods = ['POST'])
def button():
    data = request.get_json()
    max_date = trade_history() 
    submit_data_drop()  
    # ids()
    #absentees()
    print(f"data uploaded successfully for {today_date}")

    response_data = {
        'message': 'Success',
        'data': f'Successfully uploaded Compliance{max_date}'
    }
    return jsonify(response_data)
if __name__ == "__main__":
    from waitress import serve
    while True:
        try:
            serve(app,port = 4000, host="172.16.1.47")
            app.run(debug=True)
        except Exception as e:
            print(e)