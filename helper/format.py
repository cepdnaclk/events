# open the file
f = open("data.html",  "r")

data = ''

# read the html file
for line in f:
    if not line == '\n':
        data += line.rstrip('\n')

print(data.replace('"', '\''))