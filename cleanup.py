'''
cleanup up TRBB csv file
'''

import csv
import json
import random
import string

def rs():
	'''
	Generates a random string
	'''
	digits = "".join( [random.choice(string.digits) for i in xrange(8)] )
	chars = "".join( [random.choice(string.letters) for i in xrange(15)] )
	return digits + chars


def sc(data):
	'''
	removes all non numeric characters
	'''
	print data
	newdata = ''
	for c in data:
		if c in '1234567890. ':
		
			newdata = newdata + c
	newdata = newdata.lstrip()
	newdata = newdata.rstrip()
	newdata = newdata.replace('  ', ' ')
	
	return newdata


def todec(coord):
	'''
	convert latlong in format dd mm.mmm to dd.ddddd
	
	'''
	try:
		
		data = coord.split(' ')
		degree = data[0]
		minutes = float(data[1])/60.0
		minutes = int(minutes *10000.0)
		minutes = minutes/10000.0
		return float(degree) + minutes
	except Exception, ex:
		raise ex

doname = True
idcol = 0
if doname:
	namecol = 1
else:
	namecol = 0
latcol  = namecol + 1
longcol = namecol + 2
idcol1  = namecol + 3
idcol2  = namecol + 4



dataarray = []
success = open('success.txt', 'w')
failure = open('failure.txt', 'w')
with open('success.csv', 'rb') as csvfile:
	mapreader = csv.reader(csvfile, delimiter=',', quotechar='|')
	for row in mapreader:
		print row
		#ll data should be in this format
		#N 51 31.295,W 9 13.145
		#might be missing a comma
		
		if row[latcol].find('W')>0:
			lat = row[latcol][:11]
			long = row[latcol][11:]
		else:
			lat = row[latcol]
			long = row[longcol]
		
		#check if they are numeric
		try:
			if doname == False:
				lat = todec(sc(lat))
				long = todec(sc(long))
			else:
				pass
			data = {}
			data['id'] = row[idcol]
			
			if doname:
				data['name'] = row[namecol]
			else:
				data['name'] = rs()
			data['lat'] = lat
			data['long'] = long
			
			if doname:
				data['data1'] = row[idcol1]
				data['data2'] = row[idcol2]
			else:
				data['data1'] = random.randrange(0,2)
				data['data2'] = random.randrange(0,2)
			dataarray.append(data)
			print  row[0], data['name'], lat, long, data['data1'], data['data2']
			success.write('%s,%s,%s,%s,%s,%s\n'%(row[0], data['name'], lat, long, data['data1'], data['data2'] ))
		except Exception, ex:
			print ex
			failure.write(''.join(row))
			failure.write('\n')
failure.close()
success.close()
mdataarray = {}
mdataarray['markers'] = dataarray

f = open('markers.json', 'w')
f.write(json.dumps(mdataarray))
f.close()
