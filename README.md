JiaDingWaiMai
=============

## Introduction

上海同济大学嘉定校区附近外卖大全


## Setup

1. Ruby >= 1.9.3
2. ImageMagick
3. `git clone https://github.com/limbowang/JiaDingWaiMai`
4. `bundle install`


## Usage

1. 根据已有 JSON 数据，添加数据到 `data/json/` 目录下
2. 复制相对应的 JPG 格式原图片到 `data/img/` 目录下
3. 在项目根目录下执行 `./main.rb build`
4. 在浏览器中打开 `_site/index.html` 查看效果
5. 在项目根目录下进行 master 分支的 git 相关操作
6. 在 `_site/` 下进行相关 pages 分支的 git 操作（因为国内访问 Github Pages 缓慢，故使用 GitCafe Pages 来加快访问速度，所以需要把 `_site` 下最后生成的内容 push 到 GitCafe 相对应的分支上。)


## To do list

- ~~两种规格图片~~
- ~~图片点击以后的滚轮放大缩小，拖拽~~
- ~~重新生成静态页面，不用ejs前端载入数据~~
- ~~前端使用瀑布流算法重新排版~~
- ~~使用Ruby重新写压缩图片和合并JSON的工具~~


##  To be update

- GoMax（暂无照片数据，待更新，最近要更新）
- 豪大大照片更新，只是更新了手机 但是没有更新照片
- ~~迷彩餐厅~~
- ~~热火汉堡~~
- ...to be continue...


##  Log

- ~~jidong~~
- ~~Check 吉姆丽德 newest verson?(已更新最新版外卖单)~~
