<template>
  <div v-if="false"></div>
</template>
<script>
  import Base64 from 'js-base64'

  export default {
    name: 'MySocket',
    components: {Base64},
    data: function () {
      return {}
    },
    mounted: function () {
      // 用户登录后构建socket客户端
      var logData = localStorage.getItem("logdata");
      if (logData && logData.length > 10) {
        console.log("初始化socket")
        this.initSocket()
      }
    },
    methods: {
      initSocket: function () {
        var $this = this
        // 客户端链接成功
        $this.$socket.on('connect', () => {
          console.log('##########################')
          console.log(' socket 链接成功')
          console.log('##########################')

          // 执行登陆操作
          $this.$socket.emit('sendMessage', {
            messageEvent: 'login',
            messageData: {
              Platform: "WebPc",
              UserType: "staff",
              Authorization: localStorage.getItem("logdata"),
              DeviceId: localStorage.getItem("deviceId")
            }
          })
        })

        $this.$socket.on('disconnect', () => {
          console.log("断开连接")
          console.error('socket 链接断开')
        })

        // 收到消息后
        $this.sockets.subscribe('newMessage', (serverMessage) => {
          console.log("新消息打印",serverMessage)
          if(serverMessage.messageEvent == "LoginSuccess"){

          }else if(serverMessage.messageEvent == "LoginError"){
            this.$router.push("/login")
          }else{
              var hrefStr;
              var str;
              if(serverMessage.messageEvent==='CheckLogEvent'){
                  hrefStr = 'AccCredit';
                  str = "查看"
              }else if(serverMessage.messageEvent==='DeskLogEvent'){
                  hrefStr = 'AccAlRecord';
                  str = "查看"
              }else if(serverMessage.messageEvent==='DeskCheckLogEvent'){
                  
              }
              this.$store.commit("accrecord",1)
              this.$notify({
                // title: '新消息',
                customClass:"selfNotify d_iblock",
                message: serverMessage.messageData.content + (str ? `&nbsp<a style="font-weight: bold;color: #387cff;" href="/#/${hrefStr}">${str}</a>` : ''),
                dangerouslyUseHTMLString:true,
                position:'bottom-right',
                type: 'success',
                duration:0
              });
              // if (serverMessage.messageEvent==='CheckLogEvent' || serverMessage.messageEvent==='DeskLogEvent'){
              // }
          }

        })


      },
      turn:function () {
        console.log('测试')
      }
    }
  }
</script>
<style scoped>

</style>
