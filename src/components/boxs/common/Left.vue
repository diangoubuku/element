<template>
    <aside class="t_left">
        <header>
            <div class="logo t_center f_0">
                <p class="f_16">账房系统</p>
                <p class="f_14"><span>用户:</span><span class="c_blue">{{userRole}}</span></p>
            </div>
            <el-dialog title="修改密码" :visible.sync="changePassdiasync" width="500px" :before-close="handleClose" append-to-body center>
                <el-form ref="form" :model="formData" label-width="100px">
                    <el-form-item label="原始密码:">
                        <div class="w_8">
                            <el-input v-model="formData.oldPassword" size="mini" width="100px"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="最新密码:">
                        <div class="w_8">
                            <el-input v-model="formData.password" size="mini" width="100px"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
                <el-dialog :title="titleText" :visible.sync="innerSync" width="300px" append-to-body top="18vh" center>
                    <p class="t_center">
                        <el-button @click="innerSync = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="confirmCli" size="small">确 定</el-button>
                    </p>
                </el-dialog>
                <p class="t_right">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </p>
            </el-dialog>
        </header>
        <ul class="w_100 f_14" style="user-select:none;background-color:rgba(0,0,0,.4)">
            <li v-for="item in items" :class="item.subs ? 'c_pointer' : (onRoutes === item.index ? 'noTab c_pointer c_blue' : 'noTab c_pointer')" v-if="checkRole(item.roleIdArr)">
                <span class="w_100 d_iblock " style="line-height:2.4rem;padding:0 20px" @click="openOrClose(item.index,item.subs)"><i :class="item.icon" style="margin-right:10px"></i>{{item.name}}<i :class="(activeI === item.index ? 'open' : 'close') + ' arrowIcon el-icon-arrow-up h_100 f_right f_14'" style="line-height:2.4rem;" v-if="item.subs"></i></span>
                <ul v-if="item.subs" :class="activeI === item.index ? 'o_hidden' : 'o_hidden h_0'">
                    <li v-for="val in item.subs" :class="onRoutes === val.index ? 'noTab c_pointer c_blue' : 'noTab c_pointer'" v-if="checkRole(item.roleIdArr)">
                        <span class="w_100 d_iblock " style="line-height:2.4rem;padding-left:40px" @click="changeRoutes(val.index)"><i :class="item.icon" style="margin-right:10px"></i>{{val.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <p style="position:absolute;bottom:1rem;font-size:14px;padding:0 20px" class="c_blue w_100 c_pointer" @click="changePassdiasync = true">更改密码</p>
    </aside>
</template>
<script>
export default {
    props:["items","onRoutes","roleId","userRole","FaIndex"],
    data(){
        return{
            // roleId:{role:"0"},
            activeI:"",
            changePassdiasync:false,
            innerSync:false,
            formData:{
                oldPassword:"",
                password:"",
            },
            titleText:"是否确认修改密码？"
        }
    },
    created(){
        if(this.FaIndex !== ""){
            this.activeI = this.FaIndex;
            console.log(4444,this.activeI)
        }
    },
    mounted(){
        this.$http.post(this.$Api.userInfoApi).then(
            (res)=>{
                console.log(res)
            },
            (error)=>{
                console.log(error)
            }
        )
    },
    methods:{
        checkRole(roleIdArr){
            if (!roleIdArr || roleIdArr.length===0){
                return true;
            }
            return roleIdArr.indexOf(this.roleId)>-1
        },
        changeRoutes(index,indexPath){
            this.$emit("changeRoutes",index,indexPath)
        },
        logout(){
            this.$http.post(this.$Api.logoutApi).then(
                (res)=>{
                    this.$router.push("/login")
                },
                (error)=>{
                    console.log("ddd")
                }
            )
        },
        openOrClose(i,obj){
            if(obj === undefined){
                this.changeRoutes(i)
            }else{
                if(this.activeI === ""){
                    this.activeI = i;
                }else{
                    this.activeI = "";
                }
                console.log(i,obj)
            }
        },
        handleClose(){
            this.titleText = "是否放弃修改密码？"
            this.innerSync = true
            // if(this.formData.oldPassword == "" || this.formData.password == ""){
            //     this.innerSync = true
            // }else{
            //     this.titleText = "是否确认修改密码？"
            //     this.innerSync = true
            // }
        },
        cancel(){
            this.changePassdiasync = false;
            this.$message({
                message: `放弃更改密码`,
                type: 'success',
                center: true
            });
        },
        confirm(){
            if(this.formData.oldPassword == ""){
                this.$message({
                    message: `请输入原始密码`,
                    type: 'warning',
                    center: true
                });
            }else if(this.formData.password == ""){
                this.$message({
                    message: `请输入最新密码`,
                    type: 'warning',
                    center: true
                });
            }else{
                this.innerSync = true
            }
        },
        confirmCli(){
            this.innerSync = false;
            this.$http.post(this.$Api.userChangePasswordApi,this.formData).then(
                (res)=>{
                    this.changePassdiasync = false;
                    if(res.data.message == ""){
                        console.log("修改密码",res.data.data)
                        this.$message({
                            message: res.data.data,
                            type: 'success',
                            center: true
                        });
                    }
                },
                (error)=>{
                    console.log(error)
                }
            )
        }
    },
}
</script>
<style scoped>
aside {
    position: fixed;
    width: 200px;
    background: url(../../../assets/images/line5.png) left top #1b1a1a;
    /* background-color:#4e73df; */
    height: 100vh;
    /* overflow: scroll; */
    /* color: #fff; */
    color:#7b7f8c;
    /* box-shadow: 0 0 20px rgb(0, 0, 0); */
}
.f_0{font-size:0}
.f_14{font-size:14px}
.f_16{font-size:16px}
.c_blue,.noTab.c_blue:hover{color:#409eff}
.h_0{height:0}
/* .noTab{color:#7b7f8c} */
.noTab:hover{background-color:rgba(204,204,204,.2);color:#409eff}
.arrowIcon{transition-duration: 200ms;}
.arrowIcon.open{transform: rotate(180deg);}
.logo{padding:2.4rem 0}
.logo p:nth-child(1){font-size:30px}
.c_blue{color:#409eff}
</style>