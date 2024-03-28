---
title: "Redis scan命令學習"
date: 2022-11-30T15:55:23+08:00
lastmod: 2022-11-30T15:55:23+08:00
author: ["Sulv"]
keywords: 
- Redis
categories: 
- Redis
tags: 
- Redis
- tech
description: "scan命令詳解"
weight:
slug: ""
draft: false # 是否爲草稿
comments: true
reward: true # 打賞
mermaid: false # 是否開啓mermaid
showToc: true # 顯示目錄
TocOpen: true # 自動展開目錄
hidemeta: false # 是否隱藏文章的元信息，如發佈日期、作者等
disableShare: true # 底部不顯示分享欄
showbreadcrumbs: true # 頂部顯示路徑
cover:
    image: "" # 圖片路徑：posts/tech/123/123.png
    caption: "" # 圖片底部描述
    alt: ""
    relative: false
---



## 1. 介紹

`scan`命令的作用和`keys *`的作用類似，主要用於查找redis中的鍵，但是在正式的生產環境中一般不會直接使用`keys *`這個命令，因爲他會返回所有的鍵，如果鍵的數量很多會導致查詢時間很長，進而導致服務器阻塞，所以需要scan來進行更細緻的查找

`scan`總共有這幾種命令：`scan`、`sscan`、`hscan`、`zscan`，分別用於迭代數據庫中的：數據庫中所有鍵、集合鍵、哈希鍵、有序集合鍵，命令具體結構如下：

```bash
scan cursor [MATCH pattern] [COUNT count] [TYPE type]
sscan key cursor [MATCH pattern] [COUNT count]
hscan key cursor [MATCH pattern] [COUNT count]
zscan key cursor [MATCH pattern] [COUNT count]
```

## 2. scan

`scan cursor [MATCH pattern] [COUNT count] [TYPE type]`，cursor表示遊標，指查詢開始的位置，count默認爲10，查詢完後會返回下一個開始的遊標，當返回0的時候表示所有鍵查詢完了

```bash
127.0.0.1:6379[2]> scan 0
1) "3"
2)  1) "mystring"
    2) "myzadd"
    3) "myhset"
    4) "mylist"
    5) "myset2"
    6) "myset1"
    7) "mystring1"
    8) "mystring3"
    9) "mystring4"
   10) "myset"
127.0.0.1:6379[2]> scan 3
1) "0"
2) 1) "myzadd1"
   2) "mystring2"
   3) "mylist2"
   4) "myhset1"
   5) "mylist1"
```

MATCH可以採用模糊匹配找出自己想要查找的鍵，這裏的邏輯是先查出20個，再匹配，而不是先匹配再查詢，這裏加上count 20是因爲默認查出的10個數中可能不能包含所有的相關項，所以把範圍擴大到查20個，我這裏測試的鍵總共有15個

```bash
127.0.0.1:6379[2]> scan 0 match mylist* count 20
1) "0"
2) 1) "mylist"
   2) "mylist2"
   3) "mylist1"
```

TYPE可以根據具體的結構類型來匹配該類型的鍵

```bash
127.0.0.1:6379[2]> scan 0 count 20 type list
1) "0"
2) 1) "mylist"
   2) "mylist2"
   3) "mylist1"
```

## 3. sscan

`sscan key cursor [MATCH pattern] [COUNT count]`，sscan的第一個參數總是集合類型的key

```bash
127.0.0.1:6379[2]> sadd myset1 a b c d
(integer) 4
127.0.0.1:6379[2]> smembers myset1
1) "d"
2) "a"
3) "c"
4) "b"
127.0.0.1:6379[2]> sscan myset1 0
1) "0"
2) 1) "d"
   2) "c"
   3) "b"
   4) "a"
127.0.0.1:6379[2]> sscan myset1 0 match a
1) "0"
2) 1) "a"
```

## 4. hscan

`hscan key cursor [MATCH pattern] [COUNT count]`，sscan的第一個參數總是哈希類型的key

```bash
127.0.0.1:6379[2]> hset myhset1 kk1 vv1 kk2 vv2 kk3 vv3
(integer) 3
127.0.0.1:6379[2]> hgetall myhset1
1) "kk1"
2) "vv1"
3) "kk2"
4) "vv2"
5) "kk3"
6) "vv3"
127.0.0.1:6379[2]> hscan myhset1 0
1) "0"
2) 1) "kk1"
   2) "vv1"
   3) "kk2"
   4) "vv2"
   5) "kk3"
   6) "vv3"
```

## 5. zscan

`zscan key cursor [MATCH pattern] [COUNT count]`，sscan的第一個參數總是有序集合類型的key

```bash
127.0.0.1:6379[2]> zadd myzadd1 1 zz1 2 zz2 3 zz3
(integer) 3
127.0.0.1:6379[2]> zrange myzadd1 0 -1 withscores
1) "zz1"
2) "1"
3) "zz2"
4) "2"
5) "zz3"
6) "3"
127.0.0.1:6379[2]> zscan myzadd1 0
1) "0"
2) 1) "zz1"
   2) "1"
   3) "zz2"
   4) "2"
   5) "zz3"
   6) "3"
```
