<template>
    <div class="accountMemberDeposit t_left">
        <el-dialog :title="dialogList.title" :visible.sync="dialogSync" width="600px">
            <div class="d_flex">
                <el-form ref="form" :model="dialogList" label-width="100px" class="w_50" size="mini">
                    <el-form-item label="会员账号：">
                        <div class="w_8">
                            <el-input size="mini" width="100px" v-model="dialogList.username" @input="getUser"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="货币类型：">
                        <div class="w_8">
                            <el-select v-model="dialogList.currency" size="mini">
                                <el-option v-for="(item,index) of CurrencyTypeMap" :value="item" :key="index"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="注码类型：">
                        <div class="w_8">
                            <el-select v-model="chipTypeForm" size="mini">
                                <el-option v-for="(item,index) of Object.keys(ChipTypeMap)" :value="ChipTypeMap[item]" :key="index"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="preSubmit" label-width="100px" class="w_50 rightForm" size="mini">
                    <el-form-item label="会员姓名：">
                        <div class="w_8">
                            <el-input size="mini" width="100px" :value="preSubmit.name" :readonly="true"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="历史存入：">
                        <div class="w_8">
                            <el-input size="mini" width="100px" :value="dialogList.chipType | showpreNum(dialogList.currency,preSubmit)" :readonly="true"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="hrBox t_center">
                <span class="d_iblock"></span>
            </div>
            <div class="d_iblock w_68">
                <el-form ref="form" :model="dialogList" label-width="160px" size="mini">
                    <el-form-item label="会员安全密码：">
                        <div class="w_8">
                            <el-input size="mini" width="100px"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="新增存入：">
                        <div class="w_8">
                            <el-input size="mini" width="100px" v-model="dialogList.money"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <el-button type="primary" size="mini" class="mt_01 v-bottom" v-if="dialogList.actType == 'TakeOut'" @click="confirmCli">提交取出</el-button>
            <el-button type="primary" size="mini" class="mt_01 v-bottom" v-else @click="confirmCli">提交存入</el-button>
        </el-dialog>
        <div class="d_iblock v_top typeBox form_box">
            <span>会员账号</span>
            <div class="box">
                <el-input v-model="formData.memberUsername" size="mini" @input="formData.memberUsername = formData.memberUsername.toUpperCase()" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>会员姓名</span>
            <div class="box">
                <el-input v-model="formData.memberName" size="mini" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>操作类型</span>
            <div class="box">
                <el-select v-model="actTypeClone" size="mini" clearable>
                    <el-option v-for="(item,index) of Object.keys(MemberDepositActTypeMap)" :value="MemberDepositActTypeMap[item]" :key="index"></el-option>
                </el-select>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>注码类型</span>
            <div class="box">
                <el-select v-model="chipTypeClone" size="mini" clearable>
                    <el-option v-for="(item,index) of Object.keys(ChipTypeMap)" :value="ChipTypeMap[item]" :key="index"></el-option>
                </el-select>
            </div>
        </div><br>
        <div class="d_iblock v_top typeBox form_box">
            <span>货币类型</span>
            <div class="box">
                <el-select v-model="formData.currency" size="mini" clearable>
                    <el-option v-for="(item,index) of CurrencyTypeMap" :value="item" :key="index"></el-option>
                </el-select>
            </div>
        </div>
        <el-button type="primary" @click="searchCli" icon="el-icon-search" class="mt_01" size="mini" v-if="showSearchBtn">搜 索</el-button>
        <el-button type="primary" size="mini" icon="el-icon-loading" class="mt_01" v-else>搜 索</el-button>
        <el-button type="primary" size="mini" class="mt_01 f_right" @click="openDialog(1)">会员取款</el-button>
        <el-button type="primary" size="mini" class="mt_01 f_right" @click="openDialog(2)">会员存款</el-button>
        <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" style="width: 100%">
            <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center" :width="item.id | filterWidth">
                <template slot-scope="scope">
                    <span class="tableSpan">{{item.id | showText(scope.row[item.id])}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="t_right">
            <el-pagination background layout="sizes, total, prev, pager, next" :page-sizes="[10,15,20,25,30]" :page-size="formData.rows" :total="totalCount" :current-page="pageCurr"  @size-change="changeSize" @current-change="changeCurr"></el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            formData:{
                offset:0,
                rows:10,
                memberUsername:"",
                memberName:"",
                actType:"",
                chipType:"",
                currency:"",
                month:"",
                info:"",
            },
            TableData:{
                title:[{id:"id",name:"ID"},{id:"memberUsername",name:"会员账号"},{id:"memberName",name:"会员姓名"},{id:"actType",name:"操作类型"},{id:"currency",name:"货币类型"},{id:"chipType",name:"注码类型"},{id:"beforeMoney",name:"操作前-金额"},{id:"money",name:"操作金额"},{id:"info",name:"备注"},{id:"staffNumber",name:"职员编号"},{id:"staffOperationIp",name:"操作IP"},{id:"createdAt",name:"操作时间"}],
                value:[]
            },
            showSearchBtn:true,
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数 
            CurrencyTypeMap:[],
            MemberDepositActTypeMap:{},
            ChipTypeMap:{},
            actTypeClone:"",
            chipTypeClone:"",
            dialogSync:false,
            dialogList:{title:"",actType:"",username:"",actType:"",chipType:"SignChip",currency:"CNY",money:"",info:""},
            preSubmit:{},    //预提交信息
            chipTypeForm:"签单码"
        }
    },
    computed:{
        allConst(){
            return this.$store.state.allConst
        },
    },
    created(){
        this.setAllConstData()
    },
    mounted(){
        this.searchCli()
    },
    watch:{
        allConst(){
            this.setAllConstData()
        },
        actTypeClone(){
            Object.keys(this.MemberDepositActTypeMap).forEach((val)=>{
                if(this.MemberDepositActTypeMap[val] == this.actTypeClone){
                    this.formData.actType = val;
                }
            })
        },
        chipTypeClone(){
            Object.keys(this.ChipTypeMap).forEach((val)=>{
                if(this.ChipTypeMap[val] == this.chipTypeClone){
                    this.formData.chipType = val;
                }
            })
        },
        chipTypeForm(){
            Object.keys(this.ChipTypeMap).forEach((val)=>{
                if(this.ChipTypeMap[val] == this.chipTypeForm){
                    this.dialogList.chipType = val;
                }
            })
        }
    },
    methods:{
        setAllConstData(){
            if(this.allConst.CurrencyTypeMap){
                this.CurrencyTypeMap = Object.keys(this.allConst.CurrencyTypeMap)
            }
            if(this.allConst.MemberDepositActTypeMap){
                this.MemberDepositActTypeMap = this.allConst.MemberDepositActTypeMap
            }
            if(this.allConst.ChipTypeMap){
                this.ChipTypeMap = this.allConst.ChipTypeMap
            }
        },
        searchCli(){
            var params = {};
            this.showSearchBtn = false;
            Object.keys(this.formData).forEach((item)=>{
                if(this.formData[item] !== ""){
                    params[item] = this.formData[item]
                }
            })
            this.$http.post(this.$Api.accountMemberDepositGetListApi,params).then(
                (res)=>{
                    this.showSearchBtn = true;
                    if(res.data.code == 0){
                        this.TableData.value = res.data.data.list;
                        this.totalCount = res.data.data.count;
                    }
                },
                (error)=>{
                    this.showSearchBtn = true;
                    console.log(error)
                }
            )
        },
        changeSize(i){       //切换每页显示条数
            this.formData.rows = i;
            this.formData.offset = 0;
            this.pageCurr = 1;
            this.searchCli();
        },
        changeCurr(i){       //换页
            this.pageCurr = i;
            this.formData.offset = (i - 1) * this.formData.rows;
            this.searchCli();
        },
        openDialog(i){
            this.dialogList = {title:"",actType:"",username:"",actType:"",chipType:"SignChip",currency:"CNY",money:"",info:""};
            this.preSubmit = {}
            if(i == 1){
                this.dialogList.title = "会员取出"
                this.dialogList.actType = "TakeOut"
            }else if(i == 2){
                this.dialogList.title = "会员存入"
                this.dialogList.actType = "Save"
            }
            this.dialogSync = true
        },
        getUser(){
            this.dialogList.username = this.dialogList.username.toUpperCase()
            if(this.dialogList.username.length > 3){
                this.getPreSubmit()
            }
        },
        getPreSubmit(){
            var params = {username:this.dialogList.username}
            this.$http.post(this.$Api.accountMemberDepositPreSubmitApi,params).then(
                (res)=>{
                    if(res.data.code == 0){
                        this.preSubmit = {...res.data.data}
                    }else{
                        this.preSubmit = {}
                    }
                    console.log("预提交信息",res.data.data)
                },
                (error)=>{
                    console.log(error)
                }
            )
        },
        confirmCli(){
            if(this.dialogList.actType == 'TakeOut'){   //取出
                var num; 
                if(this.dialogList.currency == "CNY"){
                    if(this.dialogList.chipType == "SignChip"){
                        num = this.preSubmit.depositSignChipCny
                    }else if(this.dialogList.chipType == "Cash"){
                        num = this.preSubmit.depositCashCny
                    }else if(this.dialogList.chipType == "CashChip"){
                        num = this.preSubmit.depositCashChipCny
                    }
                }else if(this.dialogList.currency == "USD"){
                    if(this.dialogList.chipType == "SignChip"){
                        num = this.preSubmit.depositSignChipUsd
                    }else if(this.dialogList.chipType == "Cash"){
                        num = this.preSubmit.depositCashChipUsd
                    }else if(this.dialogList.chipType == "CashChip"){
                        num = this.preSubmit.depositCashUsd
                    }
                }
                if(this.dialogList.username.length < 3 || Object.keys(this.preSubmit).length < 1){       //会员不存在
                    this.$message({
                        message: `会员不存在！`,
                        type: 'warning',
                        center: true
                    });
                }else if(isNaN(this.dialogList.money) || this.dialogList.money <= 0){     //金额输入不正确
                    this.$message({
                        message: `金额输入不正确！`,
                        type: 'warning',
                        center: true
                    });
                }else if(this.dialogList.money > num){              //余额不足
                    this.$message({
                        message: `余额不足！`,
                        type: 'warning',
                        center: true
                    });
                }else{
                    this.submit()
                }
            }else{      //存入
                if(this.dialogList.username.length < 3 || Object.keys(this.preSubmit).length <1){       //会员不存在
                    this.$message({
                        message: `会员不存在！`,
                        type: 'warning',
                        center: true
                    });
                }else if(isNaN(this.dialogList.money) || this.dialogList.money <= 0){     //金额输入不正确
                    this.$message({
                        message: `金额输入不正确！`,
                        type: 'warning',
                        center: true
                    });
                }else{
                    this.submit()
                }
            }
        },
        submit(){
            var params = {username:this.dialogList.username,actType:this.dialogList.actType,chipType:this.dialogList.chipType,currency:this.dialogList.currency,money:this.dialogList.money,info:this.dialogList.info}
            this.$http.post(this.$Api.accountMemberDepositSubmitApi,params).then(
                (res)=>{
                    if(res.data.code == 0){
                        this.$message({
                            message: `提交成功`,
                            type: 'success',
                            center: true
                        });
                        this.dialogSync = false;
                        this.searchCli()
                    }
                },
                (error)=>{
                    cosnoel.log(error)
                }
            )
        }
    },
    filters:{
        showText(str,val){
            if(val === ""){
                return "-"
            }else if(str == "actType" || str == "chipType"){
                if(val.name === "" || val.name === null){
                    return "-"
                }else{
                    return val.name
                }
            }else{
                return val
            }
        },
        filterWidth(str){
            if(str == "beforeMoney"){
                return "120"
            }else if(str == "id"){
                return "60"
            }else if(str == "createdAt"){
                return "140"
            }else{
                return "100"
            }
        },
        showpreNum(str,cur,val){
            if(cur == "CNY"){
                if(str == "SignChip"){
                    return val.depositSignChipCny
                }else if(str == "Cash"){
                    return val.depositCashCny
                }else if(str == "CashChip"){
                    return val.depositCashChipCny
                }
            }else if(cur == "USD"){
                if(str == "SignChip"){
                    return val.depositSignChipUsd
                }else if(str == "Cash"){
                    return val.depositCashChipUsd
                }else if(str == "CashChip"){
                    return val.depositCashUsd
                }
            }
        }
    }
}
</script>
<style scoped>
.tableSpan{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
.typeBox .d_iblock.changeWidth>div{width:9rem}
.mt_01{margin-top:0.1rem}
.rightForm{background-color: rgba(246,246,246,1);}
.accountMemberDeposit .rightForm{padding-top:14px}
.mt_06{margin-top: 0.6rem;}
.w_8{width:8rem}
.hrBox{padding:1.5rem 0;font-size:0}
.hrBox span{height: 1px;width:78%;background-color:#DCDFE6}
.w_68{width:68%}
</style>