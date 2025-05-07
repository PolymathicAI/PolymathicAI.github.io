#!/usr/bin/env python

# To update team list:
# 1) Run jeckyll locally: bundle exec jekyll serve --livereload --trace 
# 2) Run this script
# 3) Deploy / run locally
import os
import shutil

PATH = "_site/team-members"
PATH2 = "_site/collaborator-members"
FINAL_PATH = "members"
FINAL_PATH2 = "collaborators"
shutil.rmtree(FINAL_PATH)
shutil.rmtree(FINAL_PATH2)
os.makedirs(FINAL_PATH)
os.makedirs(FINAL_PATH2)
for f in os.listdir(PATH):
    with open(f"{PATH}/{f}", "r") as file:
        content = file.read()
    # remove <pre> html tags
    content = content.replace("<pre>", "").replace("</pre>", "")
    # remove initial empty lines
    content = content[2:]
    with open(f"{FINAL_PATH}/{f.replace('html','md')}", "w") as file:
        file.write(content)

for f in os.listdir(PATH2):
    with open(f"{PATH2}/{f}", "r") as file:
        content = file.read()
    # remove <pre> html tags
    content = content.replace("<pre>", "").replace("</pre>", "")
    # remove initial empty lines
    content = content[2:]
    with open(f"{FINAL_PATH2}/{f.replace('html','md')}", "w") as file:
        file.write(content)