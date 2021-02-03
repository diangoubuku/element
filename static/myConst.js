var myConst={
  // api请求地址前缀
  apiUrl:'http://192.168.2.237:9770',
  // websocket连接url
  socketUrl:'ws://192.168.2.237:9765',
}
if(window.location.hostname==='192.168.104.237'){
  myConst.apiUrl='http://192.168.104.237:9770'
  myConst.socketUrl='ws://192.168.104.237:9765'
}
