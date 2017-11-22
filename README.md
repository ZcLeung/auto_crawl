## http爬虫练习
---
### 本demo使用node的request模块通过在服务器定时向ithome和cnbeta发出http请求进行爬虫

### 依赖
1. 运行本demo的环境必须安装mongodb
2. node.js的cheerio模块（负责解析http请求返回的数据）
3. node.js的mongodb模块（负责与mongodb数据库进行数据交互）
4. node.js的schedule模块（提供定时功能）

### 使用
> 1.克隆本demo到本地
```shell
git clone https://github.com/ZcLeung/auto_crawl.git
```
> 2.执行爬虫任务
```shell
node show.js
```

> 3.监听8082端口的本地访问
```shell 
node server.js
```

> 此时浏览器访问http://localhost:8082即可查看渲染好的html页面
