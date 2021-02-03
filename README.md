# 账房系统pc端

> 请求url配置: static/myConst.js

``` javascript
var myConst={
  // api请求地址前缀
  apiUrl:myConst.apiUrl,           //'http://192.168.2.237:9770',
  // websocket连接url
  socketUrl:myConst.socketUrl,                      //'ws://192.168.2.237:9765',
}

```

> 消息推送数据解释

```
// 现场操作员
{
    "userId": 1,
    "messageData": {
        "eventType": "DeskLogEvent",						// DeskLogEvent=>加减彩,开台		CheckLogEvent=>收盘切帐
        "content": "您的【加彩申请】已经审核通过",			// 消息内容
        "key": "AddChip",									// 具体操作参数: AddChip=>加减彩,ReduceChip=>减彩,OpenDesk=>开台,		NormalCheck=>点码,FinalCheck=>收盘切帐
        "keyParams": "15"									// 数据记录ID
    }
}


// 账房操作员
{
    "userId": 12,
    "messageData": {
        "eventType": "DeskLogEvent",						// DeskLogEvent=>加减彩,开台		CheckLogEvent=>收盘切帐
        "content": "台面【G01】提交了一条新的【加彩申请】",	// 消息内容
        "key": "AddChip",									// 具体操作参数: AddChip=>加减彩,ReduceChip=>减彩,OpenDesk=>开台,		NormalCheck=>点码,FinalCheck=>收盘切帐
        "keyParams": "15"									// 数据记录ID
    }
}
```

> 测试推送
```
地址: 服务域名+端口/websocket-server/Push/multipleUser
参数：
    userMessage: [{"userId":6,"messageEvent":"DeskLogEvent","messageData":{"content":"您的【加彩申请】已经审核通过","key":"AddChip","keyParams":"15"}}]
    userType: staff
```
