<template>
    <div id="login" class="p_relative">
        <div class="box d_iblock p_absolute">
            <h3 class="t_center mb_14">{{gText}}</h3>
            <el-input placeholder="请输入用户名" v-model="username" size="small" class="mb_14" @input="username = username.toUpperCase()" @keydown="aaa" id="userNameInput">
                <i slot="prefix" class="el-input__icon el-icon-user-solid"></i> 
            </el-input>
            <el-input placeholder="请输入密码" v-model="password" size="small" class="mb_14" type="password" id="passwordInput">
                <i slot="prefix" class="el-input__icon el-icon-lock"></i> 
            </el-input>
            <el-button size="small" class="logBtn" id="logBtn" v-if="showloginBtn" @click="login">登陆</el-button>
            <el-button size="small" icon="el-icon-loading" class="logBtn" v-else>登陆</el-button>
            <p class="logoText">{{logoText}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            username:"",
            password:"",
            gText:"账房系统",
            logoText:"Version: 3.2.4 Develop",
            showloginBtn:true,
        }
    },
    mounted(){
        var _this = this;
        userNameInput.addEventListener("keydown",function(event){
            if(event.keyCode == '13'){
                $("#passwordInput").focus()
            }
        })
        passwordInput.addEventListener("keydown",function(event){
            if(event.keyCode == '13'){
                _this.login()
            }
        })
    },
    methods:{
        login(){
            $("#userNameInput").focus()
            this.showloginBtn = false
            var deviceId = localStorage.getItem("deviceId")
            if(deviceId == null || deviceId == "" || deviceId === undefined || deviceId.length < 20 || deviceId.length > 30){
                var str = this.randomString(20,30);
                localStorage.setItem("deviceId",str);
                deviceId = str;
            }
            var params = {username:this.username,password:this.password}
            this.$http.post(this.$Api.userLoginApi,params).then(
                (res)=>{
                    this.showloginBtn = true;
                    console.log("测试登陆",res)
                    if(res.data.code == 0){
                        var logdata = res.data.data.tokenType + res.data.data.token
                        localStorage.setItem("logdata",logdata)
                        localStorage.setItem("userRole",res.data.data.role)
                        this.$emit("showList")
                        var hashStr = "";
                        var indexI;
                        if(res.data.data.role === '现场操作员'){
                            // hashStr = "/AddC"
                            indexI = "1"
                        }else if(res.data.data.role === '现场经理'){
                            indexI = "8"
                        }else if(res.data.data.role === '账房操作员' || res.data.data.role === '账房经理' || res.data.data.role === '查账组操作员'){
                            // hashStr = "/AccAlRecord"
                            indexI = "5"
                        }
                        // this.$router.push(hashStr)
                        this.$emit("changeRoutes",indexI,0)
                        history.go(0)
                        // window.location.href="/"
                        console.log("登陆成功",res)
                    }
                },
                (error)=>{
                    console.log(error)
                }
            )
        },
        randomString(min,max){
            var arr = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
            var str ="";
            // 随机生成随机数位数
            var num = min + Math.ceil(Math.random() * Math.floor(max - min));
            for(var i=num;i>0;i--){
                var n = Math.ceil(Math.random() * (arr.length - 1))
                str += arr[n]
            }
            return str;
        },
        aaa(){
            console.log(3325)
        }
    },
    watch:{},
}
</script>
<style scoped>
#login{width:100%;height:100%;font-size: 14px;}
.box{width:360px;background-color:rgba(255,255,255,1);padding:36px;left:0;right:0;margin: auto;top: 30%;}
.logBtn{width:100%;height:32px;padding:5px 15px 6px;background-color:#2d8cf0;border: 1px solid transparent;border-radius:4px;color:#fff;margin-bottom:24px}
.logoText{color:rgba(88,88,88,.8);font-size:12px}
.mb_14{margin-bottom:14px}
</style>