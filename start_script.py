
'''
    AUTHORS:
        Dinindu Thilakarathna [dininduwm@gmail.com]
'''

from csv import writer
from os import walk
import json
import datetime, pytz

# path for the events
event_path = 'events/'

csv_file = 'data/data.csv'

# event list
event_list = []

# headers of the data
headers = ["date","time","description","link","registration","additional_info","tags"]

# format and validate data
def formatAndValidateData(data):
    dtobj1=datetime.datetime.utcnow()   #utcnow class method
    # print(dtobj1)
    dtobj3=dtobj1.replace(tzinfo=pytz.UTC) #replace method
    dtobj_sl=dtobj3.astimezone(pytz.timezone("Asia/Colombo")) #astimezone method

    if data[0] >= datetime.datetime.strftime(dtobj_sl, '%Y-%m-%d'):
        for index in range(len(data)):
            if (type(data[index]) == list):
                data[index] = ','.join(data[index])

            data[index] = f'"{data[index]}"' 
            # print(data[index])
        return data
    return False

# add to the data.csv fule
def genarateCSVFile(file_name):
    # Open file in append mode
    with open(file_name, 'w', newline='') as write_obj:
        # Create a writer object from csv module
        csv_writer = writer(write_obj)

        # add the headers to the csv
        csv_writer.writerow(headers)
        # Add contents to the csv file

        for event in event_list:
            csv_writer.writerow(event)

# get file list to read
def genarateEventList():
    filenames = next(walk(event_path), (None, None, []))[2]
    
    for file in filenames:
        # separating the json files
        if file.split('.')[-1] == 'json':
            file_path = event_path + file
            # opening the file
            f = open(file_path, "r")
            
            # try to pars json doc
            try:
                data = f.read()
                decodedData = json.loads(data)
                # print(decodedData)
                tmpList = []
                for title in headers:
                    if title in decodedData:
                        tmpList.append(decodedData[title])
                    else:
                        tmpList.append("")
            except Exception as e:
                print (e)

        # add to the event list
        validatedData = formatAndValidateData(tmpList)
        if (validatedData):
            event_list.append(validatedData)

# Append a list as new line to an old csv file
# append_list_as_row('data/data.csv', row_contents)
genarateEventList()
# print(event_list)
genarateCSVFile(csv_file)