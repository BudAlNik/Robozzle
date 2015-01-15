#!/usr/bin/python
import os
print("Content-type:application/json\n\n")
#print("Content-type:text/html\n\n")


req = os.getenv("QUERY_STRING")
if (req == "levels"):
    lvls = os.listdir("levels")
    lvls.sort()
    s = "["   
    for num in lvls:
        s += '"' + str(num) + '",'
    s = s[:-1]
    s += "]"
    print(s)
    exit()
log = open("log", "a")
log.write(req + "\n")
num_of_map = -1
num_of_lvl = -1
try:
    num_of_map = int(req);
except:
    num_of_map = 1

if (num_of_map > 99 or num_of_map < 0):
    num_of_map = 0

num_of_lvl
try:
    inp = open("levels/" + "0" * (2 - len(str(num_of_map))) + str(num_of_map))
    num_of_lvl = num_of_map
except:
    inp = open("levels/01")
    num_of_lvl = 1

red = []
green = []
blue = []
apples = []


n, m = map(int, inp.readline().strip().split())
for i in xrange(n):
    s = inp.readline().strip().lower()
    for j in xrange(m):
        if (s[j] == "r"):
            red.append([i, j])
        elif (s[j] == "g"):
            green.append([i, j])
        elif (s[j] == "b"):
            blue.append([i, j])

hedgehog_pos = [0, 0]
hedgehog_dir = -1
for i in xrange(n):
    s = inp.readline().strip();
    for j in xrange(m):
        if (s[j] == "*"):
            apples.append([i, j])
        elif (s[j] in "URDL"):
            hedgehog_pos = [i, j]
            hedgehog_dir = "URDL".index(s[j])
nf = int(inp.readline())
funcs = map(int, inp.readline().strip().split())
#log.write(str(funcs))

sred = '"red":[ '
for pos in red:
    sred += "[" + str(pos[0]) + "," + str(pos[1]) + "],"
sred = sred[:-1]
sred += "]"

sblue = ',"blue":[ '
for pos in blue:
    sblue += "[" + str(pos[0]) + "," + str(pos[1]) + "],"
sblue = sblue[:-1]
sblue += "]"

sgreen = ',"green":[ '
for pos in green:
    sgreen += "[" + str(pos[0]) + "," + str(pos[1]) + "],"
sgreen = sgreen[:-1]
sgreen += "]"

sapples = ',"apples":[ '
for pos in apples:
    sapples += "[" + str(pos[0]) + "," + str(pos[1]) + "],"
sapples = sapples[:-1]
sapples += "]"

log.write("@\n")
sfuncs = '"funcs":['
for num in funcs:
    sfuncs += str(num) + ","
sfuncs = sfuncs[:-1]
sfuncs += "]"
log.write(sfuncs + "#\n")
#log.write('{"hedgehog":{"pos":[' + str(hedgehog_pos[0]) + "," + str(hedgehog_pos[1]) + '],"dir":' + str(hedgehog_dir) + '},"cells":{' + sred + sgreen + sblue + '}' + sapples + "," + sfuncs + ',"lvl_num":' + str(num_of_lvl) + '}\n')
print('{"hedgehog":{"pos":[' + str(hedgehog_pos[0]) + "," + str(hedgehog_pos[1]) + '],"dir":' + str(hedgehog_dir) + '},"cells":{' + sred + sgreen + sblue + '}' + sapples + "," + sfuncs + ',"lvl_num":' + str(num_of_lvl) + '}')