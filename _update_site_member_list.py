#!/usr/bin/env python

# To update team list:
# 1) Run jeckyll locally: bundle exec jekyll serve --livereload --trace 
# 2) Run this script
# 3) Deploy / run locally
import os
import shutil

PATH = "_site/team-members"
FINAL_PATH = "members"
shutil.rmtree(FINAL_PATH)
os.makedirs(FINAL_PATH)
for f in os.listdir(PATH):
    with open(f"{PATH}/{f}", "r") as file:
        content = file.read()
    # remove <pre> html tags
    content = content.replace("<pre>", "").replace("</pre>", "")
    # remove initial empty lines
    content = content[2:]
    with open(f"{FINAL_PATH}/{f.replace('html','md')}", "w") as file:
        file.write(content)
