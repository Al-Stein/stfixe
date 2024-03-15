import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import json 

def tostr(dec,key):
    dec[key] = str(dec[key])


client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['mydatabase']  
collection = db['crtl_emails']  

# Path to the Excel file
excel_file = "C:/Users/AL-STEIN/Desktop/stage/dashboard/excel/DBBRISE.xlsx"

# Read Excel file into a pandas DataFrame
df = pd.read_excel(excel_file)

# =====================================================================
# ==== NOTE THAT I HAVE ERROR : NaTType does not support utcoffset ====
# =====================================================================

# Convert DataFrame to a list of dictionaries (each dictionary represents a row)
data = df.to_dict(orient='records')
for d in data:
    tostr(d, 'Date début ticket')
    tostr(d, 'Date création')
    tostr(d, 'Date rétablissement')
    tostr(d, 'Date clôture')
    tostr(d, 'DMS')

# Insert data into MongoDB collection
try:
    collection.insert_many(data)
    print("Data successfully inserted into MongoDB.")
except Exception as e:
    print("Error inserting data into MongoDB:", e)