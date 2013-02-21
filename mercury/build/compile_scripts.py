#!/usr/bin/env python

import glob, os, sys, shutil

directories = ["../src/js/src/"]

tmpdir = "temp_js"
compiled = "%s/*.js" % tmpdir
output = "../compiled/main.js"

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
	print "Compiling Js "
	
	for directory in directories:
		for root,dir,files in os.walk(directory): 
			# this list has the files in all directories and subdirectories 
			filelist = [ os.path.join(root,fi) for fi in files if 
			fi.endswith(".js")] 
			for fi in filelist: 	
				fo = os.path.join(tmpdir, os.path.split(fi)[1])
				print "    %s -> %s" % (fi, fo)
				os.system("uglifyjs -o %s %s" % (fo, fi))

def assemble():
	print "Copying js to target %s" % output
	a = open(output, 'w')
	a.write("// COMPILED TEMPLATES\n\n")
	for fi in glob.glob(compiled):
		f = open(fi, 'r')
		a.write("// Original file: %s\n" % os.path.split(fi)[1])
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