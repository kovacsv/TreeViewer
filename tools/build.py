import os
import sys
import re

mergedFileName = 'treeviewer_merged.js'
resultFileName = '../build/treeviewer.js'

def MergeFiles (inputFileNames, outputFileName):
	for fileName in inputFileNames:
		if (not os.path.exists (fileName)):
			return False
		
	outputFile = open (outputFileName, 'w')
	for fileName in inputFileNames:
		inputFile = open (fileName, 'r')
		for line in inputFile:
			outputFile.write (line)
		outputFile.write ('\n')
		inputFile.close ()

	outputFile.close ()
	return True

def CompileFile (inputFileName, outputFileName):
	result = os.system ('java -jar compiler/compiler.jar --language_in=ECMASCRIPT5_STRICT --warning_level=VERBOSE --jscomp_off=globalThis --jscomp_off=checkTypes --js ' + inputFileName + ' --js_output_file ' + outputFileName)
	if result != 0:
		return False
	return True

def Main (argv):
	currentPath = os.path.dirname (os.path.abspath (__file__))
	os.chdir (currentPath)

	files = [
		'../src/core.js',
		'../src/treenode.js',
		'../src/treelayout.js',
		'../src/treeviewer.js',
		'../src/drawstyle.js',
		'../src/svgdrawer.js',
		'../src/canvasdrawer.js',
		'../src/createviewer.js'
	]
	
	MergeFiles (files, mergedFileName)
	CompileFile (mergedFileName, resultFileName)
	os.remove (mergedFileName)
	return 0
	
sys.exit (Main (sys.argv))
