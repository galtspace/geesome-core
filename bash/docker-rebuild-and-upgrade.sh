#!/bin/bash

# TODO: ask user if there is uncomitted changes
git checkout -- .
git pull

sudo chmod +x bash/*.sh && ./bash/docker-build.sh && ./bash/docker-prune.sh

systemctl daemon-reload
systemctl restart geesome-docker