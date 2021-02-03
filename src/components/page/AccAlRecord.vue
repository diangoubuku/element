<template>
    <div class="alrecord t_left">
        <el-dialog :title="dialogList | filterTitle" :visible.sync="dialogSync" width="800px" top="2vh">   <!--:before-close="beforeClose"-->
            <TabDetails :actType="dialogList.actType" :baseNumber="baseNumber" :startDate="dialogList.deskStartDate" :ChipNumsList="ChipNumsList" :ChipTypeMap="ChipTypeMap" :CurrencyTypeMap="CurrencyTypeMap" :curChosen="dialogList.currency ? dialogList.currency.id : ''" :typeDisabled="true" :chipDisabled="true" :tabMaxHeight="hasAccept ? '350' : '550'" :detail="dialogList.detail" :inputDisabled="true"></TabDetails>
            <div v-if="dialogList.status && (dialogList.status.id === '0' || dialogList.status.id === '1')">
                <el-form ref="form" :model="formData" label-width="85px" label-position="left" size="mini">
                    <el-form-item label="现场备注：">
                        <p>{{dialogList.info}}</p>
                    </el-form-item>
                    <el-form-item label="审核备注：">
                        <el-input type="textarea" v-model="formData.handlerInfo" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
                    </el-form-item>
                </el-form>
                <div class="t_right">
                    <el-button class="bg_red c_white" @click="audits(3)" size="small" v-if="showAuditBtn">审核不通过</el-button>
                    <el-button class="bg_red c_white" icon="el-icon-loading" size="small" v-else>审核不通过</el-button>
                    <el-button class="bg_green c_white" @click="audits(2)" size="small" v-if="showAuditBtn">审核通过</el-button>
                    <el-button class="bg_green c_white" icon="el-icon-loading" size="small" v-else>审核通过</el-button>
                </div>
            </div>
        </el-dialog>
        <div class="titleBox">
            <div class="d_iblock v_top typeBox form_box">
                <span>操作类型</span>
                <div class="box">
                    <el-select v-model="formData.actType" size="mini" clearable>
                        <el-option v-for="(item,index) of Object.keys(DeskLogActTypeMap)" :value="item" :key="index"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="d_iblock v_top typeBox form_box">
                <span>操作状态</span>
                <div class="box">
                    <el-select v-model="actStatus" size="mini" clearable>
                        <el-option v-for="(item,index) of DeskCheckLogStatusArr" :value="item" :key="index"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="d_iblock v_top typeBox form_box">
                <span>货币类型：</span>
                <div class="box">
                    <el-select v-model="formData.currency" size="mini" clearable>
                        <el-option v-for="(item,index) of Object.keys(CurrencyTypeMap)" :value="item" :key="index"></el-option>
                    </el-select>
                </div>
            </div><br>
            <div class="d_iblock v_top dataBox form_box">
                <span>操作时间</span>
                <el-date-picker v-model="startEndDate" clearable size="mini" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <el-button type="primary" class="mx_2" icon="el-icon-search" size="mini" @click="searchCli">搜索</el-button>
        </div>
        <div class="tabBox">
            <el-table :data="tableData.value" border size="mini" style="width: 100%" :header-cell-style="{background:'#DCDFE6',color:'#000'}" :fit="true">
                <el-table-column v-for="(item,index) of tableData.title" :key="item.id" :label="item.name" align="center" :width="item.id | filterWidth">
                    <template slot-scope="scope">
                        <el-tag v-if="item.id == 'status'" :type="scope.row[item.id].name == '审核通过' ? 'success' : 'info'" size="small">{{scope.row[item.id].name}}</el-tag>
                        <span class="w_nowrap" v-if="item.id == 'actType'">{{scope.row[item.id].name}}</span>
                        <span class="w_nowrap" v-else-if="item.id == 'currency'">{{scope.row[item.id].id}}</span>
                        <span class="w_nowrap" v-else-if="item.id == 'opera'">
                            <el-button size="mini" type="success" v-if="scope.row.status.id == '0' && showDetailsBtn" @click="showDetails(scope.row,0)">受理</el-button>
                            <el-button size="mini" type="success" icon="el-icon-loading" v-if="scope.row.status.id == '0' && !showDetailsBtn">受理</el-button>
                            <el-button size="mini" type="primary" @click="showDetails(scope.row,1)">详情</el-button>
                        </span>
                        <span class="w_nowrap" v-else-if="item.id != 'status'">{{scope.row[item.id]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="t_right">
            <el-pagination background layout="sizes, total, prev, pager, next" :page-sizes="[10,15,20,25,30]" :page-size="formData.rows" :total="totalCount" :current-page="pageCurr" :hide-on-single-page="totalCount < formData.rows" @size-change="changeSize" @current-change="changeCurr"></el-pagination>
        </div>
    </div>
</template>
<script>
import TabDetails from "../boxs/common/TabDetails"
export default {
    props:[],
    components:{
        TabDetails
    },
    data(){
        return{
            actStatus:"",
            startEndDate:[],
            formData:{
                offset:0,       //查询下标
                rows:10,         //查询条数
                timeField:'createdAt',
                startTime:"",            //起始时间
                endTime:"",              //结束时间
                status:"",              //操作状态
                deskStartDate:"",   //固定入账日期
                actType:"",
                currency:"",     //货币类型
                handlerInfo:""      //账房备注
            },
            pickerOptions: {        
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            tableData: {
                title:[{id:"id",name:"ID"},{id:"deskNumber",name:"台面编号"},{id:"actType",name:"操作类型"},{id:"cashChipMoney",name:"现金码"},{id:"cashMoney",name:"现金"},{id:"signChipMoney",name:"签单码"},{id:"currency",name:"币种"},{id:"money",name:"合计"},{id:"status",name:"状态"},{id:"opera",name:"操作"},{id:"createdAt",name:"修改时间"},{id:"deskStartDate",name:"入账日期"}],
                value:[]
            },
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数
            dialogList:{},       //弹窗数据
            dialogSync:false,
            hasAccept:false,     //受理弹窗显示

            baseNumber:"",
            DeskLogActTypeMap:{},
            CurrencyTypeMap:[],
            DeskCheckLogStatusArr:[],
            ChipNumsList:[],
            ChipTypeMap:{},
            showDetailsBtn:true,
            showAuditBtn:true
        }
    },
    computed:{
        allConst(){
            return this.$store.state.allConst
        },
        accrecord(){
            return this.$store.state.accrecord
        }
    },
    created(){
        this.searchCli()
    },
    mounted(){
        this.setAllConstData()
    },
    methods:{
        setAllConstData(){
            if(this.allConst.DeskLogActTypeMap){
                this.DeskLogActTypeMap = this.allConst.DeskLogActTypeMap    
            }
            if(this.allConst.ChipTypeMap){
                this.ChipTypeMap = this.allConst.ChipTypeMap    
            }
            if(this.allConst.ChipNumsList){
                this.ChipNumsList = this.allConst.ChipNumsList
            }
            if(this.allConst.CurrencyTypeMap){
                this.CurrencyTypeMap = this.allConst.CurrencyTypeMap    
            }
            if(this.allConst.DeskCheckLogStatusArr){
                this.DeskCheckLogStatusArr = this.allConst.DeskCheckLogStatusArr    
            }
        },
        // addTableData(){
            
        // },
        searchCli(){
            Object.keys(this.formData).forEach((val)=>{
                if(this.formData[val] === "" || this.formData[val] === undefined || this.formData[val] == null){
                console.log(this.formData[val],this.formData,222)
                    // delete this.formData[val]
                }
            })
            this.$http.post(this.$Api.accountDeskLogGetListApi,this.formData).then(
                (res)=>{
                    console.log("账房加减彩记录",res.data.data)
                    this.baseNumber = res.data.data.list.deskNumber;
                    this.tableData.value = [...res.data.data.list];
                    this.totalCount = res.data.data.count;
                },
                (error)=>{}
            )
        },
        changeSize(i){
            this.formData.rows = i;
            this.formData.offset = 0;
            this.pageCurr = 1;
            this.searchCli();
            console.log(this.formData)
        },
        changeCurr(i){
            this.pageCurr = i;
            this.formData.offset = (i - 1) * this.formData.rows;
            this.searchCli();
        },
        showDetails(obj,i){
            this.dialogList = obj;
            if(i == 0){
                this.showDetailsBtn = false
                this.audits(1)
                this.hasAccept = true;
            }else{
                this.dialogSync = true;
                this.hasAccept = false;
            }
        },
        beforeClose(){

        },
        audits(i){
            this.showAuditBtn = false;
            console.log(this.dialogList)
            var params = {deskLogId:this.dialogList.id,status:i,handlerInfo:this.formData.handlerInfo};
            this.$http.post(this.$Api.accountDeskLogHandlerApi,params).then(
                (res)=>{
                    this.showDetailsBtn = true
                    this.showAuditBtn = true
                    if(res.data.code == 0){
                        this.$message({
                            type: 'success',
                            message: '受理成功！'
                        });
                    }
                    this.dialogSync = false;
                    this.searchCli()
                },
                (error)=>{

                }
            )
        },
    },
    watch:{
        allConst(){
            this.setAllConstData()
        },

        startEndDate(){
            console.log(this.formData)
            if(this.startEndDate && this.startEndDate.length > 0){
                this.formData.startTime = this.startEndDate[0]
                this.formData.endTime = this.startEndDate[1]
            }else{
                this.formData.startTime = ""
                this.formData.endTime = ""
            }
        },
        actStatus(){
            if(this.actStatus){
                this.formData.status = this.DeskCheckLogStatusArr.indexOf(this.actStatus)
            }else{
                this.formData.status = ""
            }
        },
        // $route: {
        //     handler: function(val, oldVal){
        //         if(val.query.id="1"){
        //             this.searchCli()
        //             this.$router.replace({query:null})
        //         }
        //         console.log("路由变化",val);
        //     },
        //     // 深度观察监听
        //     deep: true
        // },
        accrecord(){
            if(this.accrecord == 1){
                this.searchCli();
                this.$store.commit("accrecord","")
            }
        }
    },
    filters:{
        filterWidth(val){
            [{id:"actType",name:"操作类型"},{id:"cashChipMoney",name:"现金码"},{id:"cashMoney",name:"现金"},{id:"signChipMoney",name:"签单码"},{id:"currency",name:"币种"},{id:"money",name:"合计"},{id:"status",name:"状态"},{id:"opera",name:"操作"},{id:"createdAt",name:"修改时间"},{id:"deskStartDate",name:"入账日期"}]
             switch(val){
                case 'actType':
                    return '80'
                    break;
                case 'currency':
                    return '60'
                    break;
                case 'opera':
                    return '160'
                    break;
                case 'createdAt':
                    return '140'
                    break;
                case 'deskStartDate':
                    return '100'
                    break;
                case 'status':
                    return '100'
                    break;    
             }
        },
        filterTitle(val){
            if(val.actType){
                return val.actType.name + '详情'
            }else{
                return ''
            }
        }
    }
}
</script>
<style scoped>
/* .titleBox{margin-bottom:0.48rem} */
.mx_2{margin:0 2rem}
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
.bg_red{background-color:#d01c1c}
.bg_green{background-color:#08aa24;}
.c_white{color:rgba(225,225,225,1)}
</style>