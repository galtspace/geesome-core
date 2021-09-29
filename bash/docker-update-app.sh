#!/bin/bash

docker cp index.ts geesome:/geesome-node/
docker cp publish-docs.ts geesome:/geesome-node/
docker cp package.json geesome:/geesome-node/
docker cp yarn.lock geesome:/geesome-node/
docker cp components/. geesome:/geesome-node/components/

docker cp frontend/index.html geesome:/geesome-node/frontend/
docker cp frontend/.babelrc geesome:/geesome-node/frontend/
docker cp frontend/yarn.lock geesome:/geesome-node/frontend/
docker cp frontend/*.json geesome:/geesome-node/frontend/
docker cp frontend/*.js geesome:/geesome-node/frontend/
docker cp frontend/src/. geesome:/geesome-node/frontend/src/
docker cp frontend/locale/. geesome:/geesome-node/frontend/locale/
docker cp frontend/assets/. geesome:/geesome-node/frontend/assets/
