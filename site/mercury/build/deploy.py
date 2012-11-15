#!/usr/bin/env python

"""deploy.py

Uploads the contents of the bin folder to a server via ftp.
If no parameters are provided, uses the default settings:

remoteRoot = 'lightpaintlive.com'
server = 'positlabs.com'
user = 'c204230'
password = 'Password2133'

Otherwise, possible options are:

-h print this message
-u user
-p password
-s server
-f remote folder
-r server root folder
"""

import os, sys, getopt, getpass, datetime, fileinput
from ftplib import FTP
from calendar import timegm

binfolder = "../"

remoteRoot = 'lightpaintlive.com'
server = 'positlabs.com'
user = 'c204230'
password = 'Password2133'

stdout = sys.stdout

def mdtmToDate(mdmt):
	yy = int(mdmt[:4])
	mm = int(mdmt[4:6])
	dd = int(mdmt[6:8])
	hh = int(mdmt[8:10])
	mn = int(mdmt[10:12])
	ss = int(mdmt[12:14])
	dttm = datetime.datetime(yy,mm,dd,hh,mn,ss)
	return timegm(dttm.utctimetuple())

def deploy(params):
	rmtdir = params[3]

	ftp = FTP(params[0])
	ftp.login(params[1], params[2])

	try:
		ftp.cwd(rmtdir)
	except Exception,e:
		print """Remote directory not found on server %s. Aborting upload.""" % params[3]

	print "Key: S skipped, U uploaded"

	for root, dirs, files in os.walk(binfolder):
		for name in files:
			ftp.cwd(rmtdir)

			fname = os.path.join(root, name)
			fds = root.split(binfolder)[-1:]
			for fd in fds:
				try:
					ftp.cwd("./%s" % fd)
				except Exception:
					ftp.mkd("./%s" % fd)
					ftp.cwd("./%s" % fd)

			# Modification time different between server and local file. If < 0, remote file needs update
			td = -1
			try:
				mdtm = ftp.sendcmd("MDTM %s" % name)[3:].strip()
				td = mdtmToDate(mdtm) - int(os.stat(fname).st_mtime)
			except Exception,e:
				pass

			if name.endswith('swf.cache') or td >= 0:
				print "S\t%s" % fname
			else:
				print "U\t%s -> %s" % (fname, ftp.pwd())
				ftp.storbinary('STOR ' + name, open(fname, 'rb'))

	ftp.quit()

def log(m):
	stdout.write(m)
	stdout.write("\n")

def upload():

	_user = None
	_password = None
	_server = None
	_remoteRoot = None
	_remoteFolder = None

	try:
		opts, args = getopt.getopt(sys.argv[1:], "hu:p:s:f:r:")
	except getopt.GetoptError, err:
		print str(err)
		usage()
		sys.exit(2)

	for o, a in opts:
		if o in ("-h"):
			print __doc__
			sys.exit()
		elif o in ("-u"):
			_user = a
		elif o in ("-p"):
			_password = a
		elif o in ("-s"):
			_server = a
		elif o in ("-f"):
			_remoteFolder = a
		elif o in ("-r"):
			_remoteRoot = a

	if _user == None:
		_user = user
	if _server == None:
		_server = server
	if _remoteRoot == None:
		_remoteRoot = remoteRoot
	if _remoteFolder == None:
		print "ERROR. Please specify remote folder with -f flag"
		quit()
	if _password == None and _user != user:
		_password = getpass.getpass("Please enter password:")
	elif _password == None and _user == user:
		_password = password

	print "Connecting to %s@%s/%s" % (_server, _remoteFolder, _user) 	

	deploy([_server, _user, _password, "/%s/%s" % (_remoteRoot, _remoteFolder)])


def main():
	upload()

if __name__ == "__main__":
	main()






