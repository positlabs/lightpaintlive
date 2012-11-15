#!/usr/bin/env python

import glob, os, sys, shutil

directories = ["../css/"]

tmpdir = "temp_css"
compiled = "%s/*.css" % tmpdir
output = "../compiled/compiled.css"

def clean():
	print "Cleaning the tmp directory"
	try:
		shutil.rmtree(tmpdir)
		os.rmdir(tmpdir)
	except Exception,e:
		pass

def prepare():
	print "Creating the temp directory"
	os.mkdir(tmpdir)

def compile():
	print "Compiling CSS "
	
	#for directory in [directory_1, directory_2, directory_3]:
	for directory in directories:
		for root,dir,files in os.walk(directory):
			filelist = [ os.path.join(root,fi) for fi in files if 
			fi.endswith(".css")] 
			for fi in filelist: 	
				fo = os.path.join(tmpdir, os.path.split(fi)[1])
				print "    %s -> %s" % (fi, fo)
				os.system("cleancss -o %s %s" % (fo, fi))

def assemble():
	print "Copying CSS to target %s" % output
	a = open(output, 'w')
	a.write("/* COMPILED TEMPLATES */\n\n")
	for fi in glob.glob(compiled):
		f = open(fi, 'r')
		a.write("/* Original file: %s */\n" % os.path.split(fi)[1])
		a.write(f.read())
		a.write("\n")
	a.close()
	
	
def build():
	prepare()
	compile()
	assemble()
	clean()

if(__name__ == '__main__'):
	build()
	print "Done!"