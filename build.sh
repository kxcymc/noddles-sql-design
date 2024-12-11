#!/bin/zsh

# 打包到生产环境
cross-env NODE_ENV=production webpack --mode=production

# 复制根页面
cp public/index.html dist/

# 跳转至生产环境根目录
cd dist

# 启动根页面
export $(cat ../.env | xargs) && http-server -p $PORT --cors="http://localhost:$PORT"
