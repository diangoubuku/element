<template>
    <div class="tabmanage t_left">
        <el-dialog :title="titleText" :visible.sync="dialogSync" width="400px">   <!--:before-close="beforeClose"-->
                <!-- <el-dialog :title="innerTitleText" :visible.sync="innerSync" width="300px" append-to-body top="30vh" center>
                    <p class="t_center">
                        <el-button @click="innerSync = false" size="small">取 消</el-button>
                        <el-button type="primary" @click="confirmCli" size="small">确 定</el-button>
                    </p>
                </el-dialog> -->
            <el-form ref="form" :model="dialogData" label-width="100px" label-position="right" size="mini">
                <el-form-item label="台面编号:">
                    <div class="w_10">
                        <el-input v-model="dialogData.number"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="游戏类型:">
                    <el-select v-model="dialogData.gameType" size="mini" clearable>
                        <el-option v-for="(item,index) of Object.keys(GameTypeMap)" :value="GameTypeMap[item]" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属厅:">
                    <el-select v-model="dialogData.area" size="mini" clearable>
                        <el-option v-for="(item,index) of DeskAreaList" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="绑定-录数IP:">
                    <div class="w_10">
                        <el-input v-model="dialogData.bindingIp"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="启用状态:">
                    <el-select v-model="enable" size="mini" clearable>
                        <el-option v-for="(item,index) of DeskEnableArr" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSync = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmCli" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <div class="t_left">
            <div class="d_iblock v_top typeBox form_box">
                <span>游戏类型</span>
                <div class="box">
                    <el-select v-model="gameTypeClone" size="mini" clearable>
                        <el-option v-for="(item,index) of Object.keys(GameTypeMap)" :value="GameTypeMap[item]" :key="index"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="d_iblock v_top typeBox form_box">
                <span>运行状态</span>
                <div class="box">
                    <el-select v-model="statusClone" size="mini" clearable>
                        <el-option v-for="(item,index) of DeskStatusArr" :value="item" :key="index"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="d_iblock v_top typeBox form_box">
                <span>所属厅</span>
                <div class="box">
                    <el-select v-model="form.area" size="mini" clearable>
                        <el-option v-for="(item,index) of DeskAreaList" :value="item" :key="index"></el-option>
                    </el-select>
                </div>
            </div>
            <el-button type="primary" class="mt_01 v_top m" icon="el-icon-search" size="mini" @click="searchCli" v-if="!searchDisabled">搜索</el-button>
            <el-button type="primary" class="mt_01 v_top m" icon="el-icon-loading" size="mini" v-else>搜索</el-button>
            <el-button type="primary" class="mx_01 v_top f_right" icon="el-icon-plus" size="mini" @click="openDialog(1)">新增台面</el-button>
        </div>
        <el-table :data="formData.value" border style="width: 100%" size="small" :header-cell-style="{background:'#DCDFE6',color:'#000'}">
            <el-table-column :label="item.name" v-for="(item,index) in formData.title" :key="index" align="center" :min-width="item.id == 'startTime' ? '120' : item.id == 'bindingIp' ? '100' : ''">
                <template slot-scope="scope">
                    <span v-if="item.id != 'opera' && item.id != 'status' && item.id != 'enable'">{{scope.row[item.id]}}</span>
                    <el-tag v-if="item.id == 'status'" :type="scope.row[item.id] == '运行中' ? 'success' : 'info'" size="small">{{scope.row[item.id]}}</el-tag>
                    <el-tag v-if="item.id == 'enable'" :type="scope.row[item.id].id == '1' ? 'success' : 'info'" size="small">{{scope.row[item.id].name}}</el-tag>
                    <el-button size="mini" v-if="item.id == 'opera'" @click="openDialog(scope.row,0)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="t_right">
            <el-pagination background layout="sizes, total, prev, pager, next" :page-sizes="[10,15,20,25,30]" :page-size="form.rows" :total="totalCount" :current-page="pageCurr"  @size-change="changeSize" @current-change="changeCurr"></el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            formData:{
                title:[{id:"id",name:"ID"},{id:"number",name:"台面编号"},{id:"gameType",name:"游戏类型"},{id:"area",name:"所属厅"},{id:"bindingIp",name:"绑定员工-ip"},{id:"status",name:"运行状态"},{id:"startTime",name:"开盘时间"},{id:"startDate",name:"入账日期"},{id:"enable",name:"是否禁用"},{id:"opera",name:"操作"}],
                value: []
            }, 
            form:{
                offset:0,
                rows:10,
                timeField:"createdAt",
                startTime:"",
                endTime:"",
                status:"",
                enable:"",
                area:"",
                gameType:""
            },
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数  
            GameTypeMap:{},     //游戏类型
            DeskStatusArr:[],   //运行状态 
            DeskAreaList:[],        //所属厅
            DeskEnableArr:[],
            gameTypeClone:"",
            statusClone:"",
            searchDisabled:false,
            dialogData:{
                number:"",
                gameType:"",
                area:"",
                bindingIp:"",
                enable:""
            },
            titleText:"新增台面",
            dialogSync:false,
            // innerTitleText:"",
            // innerSync:false,
            enable:"",
            upDateId:"",
            // showCloseDia:false
        }
    },
    created(){
        this.setAllConstData()
    },
    computed:{
        allConst(){
            return this.$store.state.allConst
        },
    },
    mounted(){
        this.searchCli()
    },
    watch:{
        allConst(){
            this.setAllConstData()
        },
        gameTypeClone(){
            if(this.gameTypeClone == ""){
                this.form.gameType = ""
            }else{
                Object.keys(this.GameTypeMap).forEach((item)=>{
                    if(this.GameTypeMap[item] == this.gameTypeClone){
                        this.form.gameType = item
                    }
                })
            }
        },
        statusClone(){
            if(this.statusClone == ""){
                this.form.status = ""
            }else{
                if(this.DeskStatusArr.indexOf(this.statusClone) >= 0){
                    this.form.status = this.DeskStatusArr.indexOf(this.statusClone)
                }
            }
        },
        enable(){
            if(this.DeskEnableArr.indexOf(this.enable) >= 0){
                this.dialogData.enable = this.DeskEnableArr.indexOf(this.enable).toString()
            }
        }
    },
    methods:{
        setAllConstData(){
            if(this.allConst.GameTypeMap){
                this.GameTypeMap = {...this.allConst.GameTypeMap};
            }
            if(this.allConst.DeskStatusArr){
                this.DeskStatusArr = [...this.allConst.DeskStatusArr]
            }
            if(this.allConst.DeskAreaList){
                this.DeskAreaList = [...this.allConst.DeskAreaList]
            }
            if(this.allConst.DeskEnableArr){
                this.DeskEnableArr = [...this.allConst.DeskEnableArr]
            }
        },
        searchCli(){
            this.searchDisabled = true;
            var params = {...this.form}
            Object.keys(params).forEach((val)=>{
                if(params[val] === ""){
                    delete params[val]
                }
            })
            console.log(params,2222)
            this.$http.post(this.$Api.deskManagerGetListApi,params).then(
                (res)=>{
                    this.searchDisabled = false;
                    console.log("台面列表11",res.data.data)
                    var cloneRes = JSON.parse(JSON.stringify(res.data.data))
                    var arr = []
                    res.data.data.list.forEach((val)=>{
                        var obj={}
                        Object.keys(val).forEach((item)=>{
                            if(item == "gameType" || item == "status"){
                                obj[item] = val[item].name
                            }else{
                                obj[item] = val[item]
                            }
                        })
                        arr.push(obj)
                    })
                    this.formData.value = [...arr]
                    this.totalCount = res.data.data.count;
                    console.log(this.formData.value)
                },
                (error)=>{
                    console.log(error)
                }
            )
        },
        changeSize(i){       //切换每页显示条数
            this.form.rows = i;
            this.form.offset = 0;
            this.pageCurr = 1;
            this.searchCli();
        },
        changeCurr(i){       //换页
        console.log(i)
            this.pageCurr = i;
            this.form.offset = (i - 1) * this.form.rows;
            this.searchCli();
        },
        openDialog(val,str){
            // this.showCloseDia = false;
            if(str === undefined){
                Object.keys(this.dialogData).forEach((items)=>{
                    this.dialogData[items] = ""
                })
                this.upDateId = "";
                this.titleText = "新增台面";
                this.enable = "";
            }else{
                Object.keys(this.dialogData).forEach((items)=>{
                    this.dialogData[items] = val[items]
                })
                this.upDateId = val.id;
                this.enable = val.enable.name
                this.titleText = "修改台面";
            }
            this.dialogSync = true;
            console.log(888,this.upDateId)
        },
        // confirm(){
            // this.innerTitleText = "是否确认提交？"
            // this.innerSync = true;
        // },
        confirmCli(){
            // if(this.showCloseDia){
                // this.dialogSync = false;
                // this.innerSync = false;
            // }else{
                var hasNull = false;
                Object.keys(this.dialogData).forEach((val)=>{
                    if(this.dialogData[val] === "" && val != 'bindingIp'){
                        hasNull = true
                    }
                })
                if(!hasNull){
                    var params = JSON.parse(JSON.stringify(this.dialogData));
                    Object.keys(this.GameTypeMap).forEach((item)=>{
                        if(this.GameTypeMap[item] == params.gameType){
                            params.gameType = item
                        }
                    })
                    this.dialogSync = false;
                    // this.innerSync = false;
                    if(this.upDateId === ""){       //新增台面
                        this.$http.post(this.$Api.deskManagerCreateApi,params).then(
                            (res)=>{
                                if(res.data.code == 0){
                                    this.$message({
                                        message: `新增台面成功！`,
                                        type: 'success',
                                        center: true
                                    });
                                    this.searchCli()
                                }
                                console.log("台面新增",res.data.data)
                            },(error)=>{
                                console.log(error)
                            }
                        )
                    }else{                      //修改台面
                        params.id = this.upDateId;
                        this.$http.post(this.$Api.deskManagerUpdateApi,params).then(
                            (res)=>{
                                if(res.data.code == 0){
                                    this.$message({
                                        message: `台面修改成功！`,
                                        type: 'success',
                                        center: true
                                    });
                                    this.searchCli()
                                }
                                console.log("台面修改",res.data.data)
                            },(error)=>{
                                console.log(error)
                            }
                        )
                    }
                    this.searchCli();
                }else{
                    // this.innerSync = false;
                    this.$message({
                        message: `请补全台面信息！`,
                        type: 'warning',
                        center: true
                    });
                }
            // }
        },
        // handleClose(){
            // this.showCloseDia = true;
            // this.innerTitleText = `是否退出【${this.titleText}】`;
            // this.innerSync = true
        // },
    }
}
</script>
<style scoped>
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
.mt_01{margin-top:0.1rem}
.w_10{width:10rem}
</style>