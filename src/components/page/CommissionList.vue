<template>
    <div class="commissionList t_left">
        <div class="d_iblock v_top typeBox form_box">
            <span>上级会员账号</span>
            <div class="box">
                <el-input v-model="formData.parentUsername" size="mini" @input="formData.parentUsername = formData.parentUsername.toUpperCase()" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>当前会员账号</span>
            <div class="box">
                <el-input v-model="formData.memberUsername" size="mini" @input="formData.memberUsername = formData.memberUsername.toUpperCase()" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>当前会员姓名</span>
            <div class="box">
                <el-input v-model="formData.memberName" size="mini" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>货币类型</span>
            <div class="box">
                <el-select v-model="formData.currency" size="mini" clearable>
                    <el-option v-for="(item,index) of CurrencyTypeMap" :value="item" :key="index"></el-option>
                </el-select>
            </div>
        </div><br>
        <div class="d_iblock v_top typeBox form_box">
            <span>操作月份</span>
            <div class="d_iblock changeWidth">
                <el-date-picker v-model="formData.month" type="month" placeholder="选择日期" size="mini" value-format="yyyy-MM"></el-date-picker>
            </div>
        </div>
        <el-button type="primary" @click="searchCli" icon="el-icon-search" class="mt_01" size="mini" v-if="showSearchBtn">搜 索</el-button>
        <el-button type="primary" size="mini" icon="el-icon-loading" class="mt_01" v-else>搜 索</el-button>
        <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" style="width: 100%">
            <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center" :width="item.id | filterWidth">
                <template slot-scope="scope">
                    <template v-if="item.id!=='isCancel'">
                      <span>{{scope.row[item.id] === "" ? '-' : scope.row[item.id]}}</span>
                    </template>
                    <template v-if="item.id==='isCancel'">
                      <el-tag
                        :type="scope.row[item.id]==1?'info':'success'"
                        effect="dark">
                        {{ scope.row[item.id]==1?'已注销':'正常' }}
                      </el-tag>
                    </template>
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
                parentUsername:"",
                memberUsername:"",
                memberName:"",
                month:"",
                currency:""
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
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数
            CurrencyTypeMap:[],
            showSearchBtn:true,
            TableData:{
                title:[{id:"id",name:"ID"},{id:"month",name:"操作月份"},{id:"parentUsername",name:"上级代理账号"},{id:"memberUsername",name:"会员账号"},{id:"memberName",name:"会员姓名"},{id:"currency",name:"货币类型"},{id:"playMoney",name:"洗码量"},{id:"isCancel",name:"是否注销"},{id:"beforePlayMoney",name:"变化前-洗码量"},{id:"createdAt",name:"操作时间"}],
                value:[]
            },
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
    },
    methods:{
        setAllConstData(){
            if(this.allConst.CurrencyTypeMap){
                this.CurrencyTypeMap = Object.keys(this.allConst.CurrencyTypeMap)
            }
        },
        searchCli(){
            var params = {}
            Object.keys(this.formData).forEach((item)=>{
                if(this.formData[item] !== ""){
                    params[item] = this.formData[item]
                }
            })
            this.$http.post(this.$Api.accountMemberCommissionCommissionListApi,params).then(
                (res)=>{
                    if(res.data.code == 0){
                        this.TableData.value = res.data.data.list;
                        this.totalCount = res.data.data.count;
                    }
                    console.log("佣金列表",res.data)
                },
                (error)=>{
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
    },
    filters:{
        filterWidth(val){
            if(val == 'createdAt'){
                return '160px'
            }else if(val == 'parentUsername' || val == "beforeCommission"){
                return "100px"
            }
        }
    }
}
</script>
<style scoped>
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
.typeBox .d_iblock.changeWidth>div{width:9rem}
.mt_01{margin-top:0.1rem}
.w_10{width:10rem}
</style>
