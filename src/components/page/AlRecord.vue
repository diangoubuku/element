<template>
    <div class="alrecord t_left">
        <el-dialog :title="dialogList | filterTitle" :visible.sync="dialogSync" width="800px" top="2vh">   <!--:before-close="beforeClose"-->
            <TabDetails :actType="dialogList.actType" :baseNumber="baseNumber" :startDate="dialogList.deskStartDate" :ChipNumsList="ChipNumsList" :ChipTypeMap="ChipTypeMap" :CurrencyTypeMap="CurrencyTypeMap" :curChosen="dialogList.currency ? dialogList.currency.id : ''" :typeDisabled="true" :chipDisabled="true" tabMaxHeight="550" :detail="dialogList.detail" :inputDisabled="true"></TabDetails>
        </el-dialog>
        <el-dialog title="提示:" :visible.sync="dialogVisible.Isshow" width="400px">
            <p class="mb_2">{{dialogVisible.value}}</p>
            <div class="t_right">
                <el-button @click="dialogVisible.Isshow = false">取 消</el-button>
                <el-button type="primary" @click="deleteSub(dialogVisible.id)">确 定</el-button>
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
                            <el-button size="mini" type="danger" v-if="scope.row.status.id == '0' || scope.row.status.id == '3'" @click="openDia(scope.row.id)">删除</el-button>
                            <el-button size="mini" type="primary" @click="showDetails(scope.row)">详情</el-button>
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
                currency:""     //货币类型
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
                title:[{id:"actType",name:"操作类型"},{id:"cashChipMoney",name:"现金码"},{id:"cashMoney",name:"现金"},{id:"signChipMoney",name:"签单码"},{id:"currency",name:"币种"},{id:"money",name:"合计"},{id:"status",name:"状态"},{id:"opera",name:"操作"},{id:"createdAt",name:"修改时间"},{id:"deskStartDate",name:"入账日期"}],
                value:[]
            },
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数
            dialogList:{},       //弹窗数据
            dialogSync:false,
            dialogVisible:{value:"是否确认删除？",Isshow:false,id:""},

            baseNumber:"",
            DeskLogActTypeMap:{},
            CurrencyTypeMap:[],
            DeskCheckLogStatusArr:[],
            ChipNumsList:[],
            ChipTypeMap:{},
        }
    },
    computed:{
        baseInfo(){
            return this.$store.state.baseInfo
        },
        allConst(){
            return this.$store.state.allConst
        },
        accrecord(){
            return this.$store.state.accrecord
        }
    },
    created(){
        this.$emit("getBaseInfo")
        this.searchCli()
    },
    mounted(){
        this.setBaseInfoData()
        this.setAllConstData()
    },
    methods:{
        setBaseInfoData(){
            if(this.baseInfo.number){
                this.baseNumber = this.baseInfo.number;
            }
        },
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
            this.$http.post(this.$Api.deskLogGetListApi,this.formData).then(
                (res)=>{
                    console.log("开盘记录",res.data.data)
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
        showDetails(obj){
            this.dialogList = obj;
            this.dialogSync = true;
        },
        beforeClose(){

        },
        openDia(i){
            this.dialogVisible.id = i
            this.dialogVisible.Isshow = true;
        },
        deleteSub(i){
            var params = {id:i}
            this.$http.post(this.$Api.deskLogDelete,params).then(
                (res)=>{
                    if(res.data.code == 0){
                        this.$message({
                            message: `删除成功`,
                            type: 'success',
                            center: true
                        });
                    }
                    this.dialogVisible.Isshow = false;
                    this.searchCli()
                },
                (error)=>{
                    console.log(error)
                }
            )
        }
    },
    watch:{
        // chipData(){
        //     this.addTableData()
        // },
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
.mb_2{margin-bottom:2rem}
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
</style>