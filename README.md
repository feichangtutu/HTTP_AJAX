# HTTP_AJAX 

study full stack basic knowledge

>需求参考：https://insights.stackoverflow.com/survey/2018

## 技术栈

[前端]
+ HTML(5)
+ CSS(3) 
+ (JQ, VUE, REACT)

[后端]
- JAVA (jsp)
- Python
- Php
- C# (.net) (ASP.NET)
- C
- ...

[数据库]

- mysql
- sql server
- oracle
- mongodb (和node紧密结合)
- ...

[自动化]

- git/svn
- webpack(基于node运行)
- 服务器部署工具 IIS/Apache/nginx
- Linux操作系统

### 前端和后端如何通信的？
> 前端： 客户端
> 后端： 服务器端
> 全栈： 两端程序编写及实现通信

#### 客户端与服务端如何通信
*经典面试题：当我们在浏览器地址栏输入一个URl地址，到最后看到页面，中间都经历了哪些事情？*

eg，访问`www.baidu.com`

1. 百度页面m没有在客户端本地,是输入地址后才请求过来的
2. 不同的域名 不同的页面
3. https http ftp
4. 需要客户端联网
    
- 内网ip <br/>
内网(限定在一定区域内访问的) ;
局域网 (具备相同的dns 网关 由相同的路由器下发的ip) <br/>
自测-> 内测（内网） ->  公测
- 外网，什么事外网ip？<br/>
（不管是不是在同一个网段，用户都可以通过w外网ip访问到你的服务器；一般我们会在服务器上做处理,禁止直接通过ip访问）
- 上传本地文件到阿里云：filezilla
- DNS解析：域名和服务器关联在一起，通过dns解析完成，即：在dns服务器上生成一条解析记录，标注域名和对应的服务器的外网ip地址