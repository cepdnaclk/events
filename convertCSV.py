import csv
import json

# csv file name
csvPath = 'FormResponses.csv'


keys = ["tags", "date", "time", "description", "additional_info", "registration", "link"]

  
def makeJSON(csvPath):
    
    data = {} 

    # initializing the titles and rows list
    fields = []
    rows = []
    
    # reading csv file
    with open(csvPath, 'r', encoding='utf-8') as csvfile:
        # creating a csv reader object
        csvreader = list(csv.DictReader(csvfile))
        print(len(csvreader))
      
        for j in range(len(csvreader)):
            for i in range(1,8):
                key = keys[i-1]
                data[key] = list(csvreader[j].values())[i]
            
            jsonPath = str(hash(list(csvreader[j].values())[0]))
            jsonfile = jsonPath + ".json"
            # print(jsonfile)
            with open(jsonfile, 'w', encoding='utf-8') as jsonf:
                jsonf.write(json.dumps(data))



     
        # print(csvreader)
    

makeJSON(csvPath)
    

 

