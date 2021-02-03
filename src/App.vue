<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <Left :items="items" :onRoutes="onRoutes" @changeRoutes="changeRoutes" :roleId="roleId" :userRole="userRole" :FaIndex="FaIndex" v-if="isShowLeft"></Left>
    <div :class="'rightTab h_100' + (isShowLeft ? ' ml_200' : '')">
        <router-view @showList="showList" @getBaseInfo="getBaseInfo" @changeRoutes="changeRoutes" @printTab="printTab"/>  
    </div>
    <iframe src="http://192.168.1.166:8088/#/HelloWorld" frameborder="0" width="0" height="0" style="overflow:hidden" v-if="isPrintTab" @load="closeaaa"></iframe>
    <my-socket v-if="HasMysocketCiew"/>
  </div>
</template>

<script>
import MySocket from "./components/socket/MySocket";
import Left from "./components/boxs/common/Left";
export default {
  name: 'App',
  components: {MySocket,Left},
  data(){
      return{
        items:[
            {
                icon: 'fa  fa-id-card-o',
                index:"0",
                name:"清点-提交",
                routerTo:"/Credit",
                roleIdArr:["0"]
            },{
                icon: 'fa  fa-id-card-o',
                index:"1",
                name:"加彩",
                routerTo:"/AddC",
                roleIdArr:["0"]
            },{
                icon: 'fa  fa-id-card-o',
                index:"2",
                name:"减彩",  
                routerTo:"/ReduceC",         
                roleIdArr:["0"]
            },{
                icon: 'fa  fa-id-card-o',
                index:"3",
                name:"加减彩-记录",
                routerTo:"/AlRecord",
                roleIdArr:["0"]
            },{
                icon: 'fa  fa-id-card-o',
                index:"4",
                name:"开盘-提交", 
                routerTo:"/DeskLog",          
                roleIdArr:["0"]
            },{
                icon: 'fa  fa-id-card-o',
                index:"5",
                name:"加减彩-记录", 
                routerTo:"/AccAlRecord",          
                roleIdArr:["2","3"]
            },{
                icon: 'fa  fa-id-card-o',
                index:"6",
                name:"点码记录",  
                routerTo:"/CreditRecord",         
                roleIdArr:["0"],
            },{
                icon: 'fa  fa-id-card-o',
                index:"7",
                name:"清点记录",  
                routerTo:"/AccCredit",         
                roleIdArr:["2","3"],
            },{
                icon: 'fa  fa-id-card-o',
                index:"8",
                name:"台面管理",  
                routerTo:"/TabManage",         
                roleIdArr:["1"],
            },{
                icon: 'fa  fa-id-card-o',
                index:"9",
                name:"游戏局口",  
                routerTo:"/DeskShoeGame",         
                roleIdArr:["1"],
            },
            {
                icon: 'fa  fa-id-card-o',
                index:"10",
                name:"交易单",  
                routerTo:"/Order",         
                roleIdArr:["1"],
            },
            {
                icon: 'fa  fa-id-card-o',
                index:"11",
                name:"佣金出粮",  
                routerTo:"/Order",         
                roleIdArr:["2","3"],
                subs:[
                    {
                        icon: 'fa  fa-id-card-o',
                        index:"11-1",
                        name:"佣金列表",  
                        routerTo:"/CommissionList",         
                        roleIdArr:["2","3"],
                    },
                    {
                        icon: 'fa  fa-id-card-o',
                        index:"11-2",
                        name:"单月佣金",  
                        routerTo:"/CommissionMonthList",         
                        roleIdArr:["2","3"],
                    },
                    {
                        icon: 'fa  fa-id-card-o',
                        index:"11-3",
                        name:"佣金出粮",  
                        routerTo:"/CommissionCashBackList",         
                        roleIdArr:["2","3"],
                    }
                ]
            },
            {
                icon: 'fa  fa-id-card-o',
                index:"12",
                name:"会员存取",  
                routerTo:"/AccountMemberDeposit",         
                roleIdArr:["2","3"],
            },
            {
                icon: 'fa  fa-id-card-o',
                index:"13",
                name:"交易单列表",  
                routerTo:"/SupervisionOrder",         
                roleIdArr:["2","3"],
            },
            {
                icon: 'fa  fa-id-card-o',
                index:"14",
                name:"局口列表",  
                routerTo:"/SupervisionGame",         
                roleIdArr:["2","3"],
            },
            {
                icon: 'fa  fa-id-card-o',
                index:"999",
                name:"退出登录",  
                routerTo:"/login",         
                roleIdArr:["0","1","2","3"],
            }
          ],
          tabs:[{id:"home",index:"0",name:"百家乐录数",roleIdArr:["0"]}],
          ids:["home"],
          activeName:"tabName0",
          onRoutes:"0",
          isShowLeft:false,
          roleId:"0",
          // baseInfo:{},
          userRole:"",
          FaIndex:"",
          isPrintTab:false
      }
},
created() {
    console.log(this.$route)
    var str = this.$route.path
    this.getOnrouters(str)
    this.showList()
    if(this.$route.path == "/login" || this.$route.path == "/" || this.$route.path == "/HelloWorld"){
        this.isShowLeft = false
    }else{
        this.isShowLeft = true
    }
},
mounted(){
    this.$store.commit("allConst",window.allConst)
    console.log("后台数据",window.allConst)
    let self = this;
    document.addEventListener('touchstart', function (e) {
        self.moveY = e.targetTouches[0].pageY;
    })
    document.addEventListener('touchmove', function (e){
        e.preventDefault();
        let moveWidth = self.moveY - e.targetTouches[0].pageY;
        if (moveWidth !== 0) {
            document.body.scrollTop += moveWidth;
        }
    })
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    })
    if(!this.HasMysocketCiew()){
        this.$router.push("/")
    }
  },
methods:{
    HasMysocketCiew:function(){
        return localStorage.getItem("logdata") && localStorage.getItem("logdata").length>10
    },
    showList(){
        this.userRole = localStorage.getItem("userRole")
        if(localStorage.getItem("userRole") === "现场操作员"){
            this.roleId = "0"
        }else if(localStorage.getItem("userRole") === "现场经理"){
            this.roleId = "1"
        }else if(localStorage.getItem("userRole") === "账房操作员"){
            this.roleId = "2"
        }else if(localStorage.getItem("userRole") === "账房经理"){
            this.roleId = "3"
        }else if(localStorage.getItem("userRole") === "查账组操作员"){
            this.roleId = "3"
        }
    },
    getBaseInfo(){
        this.$http.post(this.$Api.baseInfo).then(
            (res)=>{
                console.log("台面基本信息",res.data.data)
                // this.baseInfo = res.data.data
                this.$store.commit("baseInfo",res.data.data)
            },
            (error)=>{
                console.log(error)
            }
        )
    },
    // removeTab(i){
    //     this.tabs.splice(i,1);
    //     var num = this.tabs.length - 1
    //     this.activeName = "tabName" + num;
    //     this.onRoutes = this.tabs[num].index;
    // },
    changeRoutes(i,indexType){
        // localStorage.setItem("onRoutes",i)
        if(i == "999"){
            this.logout()
            // this.onRoutes = "0"
        }else{
            // this.onRoutes = i;
            this.items.forEach((val,key)=>{
                if(val.subs){
                    val.subs.forEach((item)=>{
                        if(item.index == i){
                            this.$router.push(item.routerTo)
                        }
                    })
                }else{
                    if(val.index == i){
                        this.$router.push(val.routerTo)
                    }
                }
            })
        }
    },
    logout(){
        if(window.confirm('您是否退出登录?')){
            this.$http.post(this.$Api.logoutApi).then(
                (res)=>{
                    localStorage.clear("userRole")
                    localStorage.clear("logdata")
                    location.reload()
                },
                (error)=>{
                    console.log("error")
                }
            )
        }
        
    },
    // routeTab(val){
    //     var hasType = false;
    //     var activeI = "";
    //     var i = "";
    //     this.tabs.forEach((item,key)=>{
    //         if(item.id == val){
    //             hasType = true;
    //             activeI = key;
    //             i = item.index;
    //         }
    //     })
    //     if(hasType){
    //         this.activeName = "tabName" + activeI;
    //     }else{
    //         this.items.forEach((item)=>{
    //             if(item.subs){
    //                 item.subs.forEach((obj)=>{
    //                     if(obj.id == val){
    //                         this.tabs.push(obj)
    //                         i = obj.index;
    //                     }
    //                 })
    //             }else{
    //                 this.tabs.push(item)
    //                 i = item.index;
    //             }
    //         })
    //         this.activeName = "tabName" + (this.tabs.length - 1);
    //     }
    //     this.onRoutes = i;
    // },
    getOnrouters(str){
        this.items.forEach((val,key)=>{
            if(val.subs){
                var routeI = "-1";
                var FaI = "-1";
                val.subs.forEach((item)=>{
                    if(item.routerTo == str){
                        routeI = item.index;
                        FaI = val.index;
                    }
                })
                this.onRoutes = routeI;
                this.FaIndex = FaI;
            }else{
                if(val.routerTo == str){
                    this.onRoutes = val.index;
                    this.FaIndex = "";
                }
            }
        })
    },
    printTab(){
        this.isPrintTab = true
    },
    closeaaa(){
        setTimeout(()=>{
            this.isPrintTab = false
        },2000)
    }
},
watch:{
    $route: {
        handler: function(val, oldVal){
            if(val.path == "/login" || val.path == "/"){
                this.isShowLeft = false
            }else{
                this.isShowLeft = true
            }
            this.getOnrouters(val.path)
        },
        // 深度观察监听
        deep: true
    }
}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
  /* margin-top: 60px; */
  background-color:rgba(245,245,245,1)
}
.rightTab{min-width:1000px;padding: 15px;height:100%}
.ml_200{margin-left:200px}
</style>
