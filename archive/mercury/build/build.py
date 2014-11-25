#!/usr/bin/env python

import sys
import os
import json

sys.path.append("build-o-matic")
sys.path.append("build-o-matic/modules")
import compile_styles
import compile_js
import deploy
import optimg
import buildOmatic

configFilePath = "config.json"
args = sys.argv

json_data = open(configFilePath)
config = json.load(json_data)
json_data.close()
compile_js.config = compile_styles.config = deploy.config = config

if '-D' in args:
    #hard deploy, don't build project
    deploy.upload()

elif '-O' in args:
    #hard img optim, don't build project
    optimg.run(os.path.join(config["root"], config["images"]))
else:

    doDeploy = False
    doOptimg = False
    if "--deploy" in sys.argv or "-d" in sys.argv:
        doDeploy = True

    if "--optimg" in sys.argv or "-o" in sys.argv:
        doOptimg = True

    # @arg1 - path to config json
    # @arg2 - deploy boolean
    buildOmatic.execute(config, doDeploy, doOptimg)

