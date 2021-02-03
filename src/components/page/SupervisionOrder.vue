<template>
    <div class="supervisionOrder t_left">
        <div class="d_iblock v_top typeBox form_box">
            <span>游戏类型</span>
            <div class="box">
                <el-select v-model="gameTypeClone" size="mini">
                    <el-option v-for="(item,index) of Object.keys(GameTypeMap)" :value="GameTypeMap[item]" :key="index"></el-option>
                </el-select>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>台面编号</span>
            <div class="box">
                <el-input v-model="formData.deskNumber" size="mini" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>游戏局口</span>
            <div class="box">
                <el-input v-model="formData.deskShoeGameNumber" size="mini" clearable></el-input>
            </div>
        </div>
        <div class="d_iblock v_top typeBox form_box">
            <span>开盘时间</span>
            <div class="d_iblock changeWidth">
                <el-date-picker v-model="formData.deskStartDate" type="date" placeholder="选择日期" size="mini" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
        </div><br>
        <div class="d_iblock v_top typeBox form_box">
            <span>操作时间</span>
            <el-date-picker v-model="startEndDate" clearable size="mini" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
        </div>
        <el-button type="primary" @click="searchCli" icon="el-icon-search" class="mt_01" size="mini" v-if="showSearchBtn">搜 索</el-button>
        <el-button type="primary" size="mini" icon="el-icon-loading" class="mt_01" v-else>搜 索</el-button>
        <!-- 百家乐列表 -->
        <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" style="width: 100%" :key="formData.gameType" v-if="formData.gameType == 'BaijialeSuper6'">
            <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center" :width="item.id | BaijialeFilterWidth">
                <template slot-scope="scope">
                    <span class="tableSpan" v-if="item.id != 'drawResult'">{{item.id | BaijialeShowText(scope.row[item.id])}}</span>
                    <p v-if="item.id == 'drawResult'">
                        <el-tag size="small" v-if="scope.row.drawResult.result">{{scope.row.drawResult.result}}</el-tag>
                        <el-tag type="success" size="small" v-if="scope.row.drawResult.duiResult">{{scope.row.drawResult.duiResult}}</el-tag>
                        <el-tag type="warning" size="small" v-if="scope.row.drawResult.superResult">{{scope.row.drawResult.superResult}}</el-tag>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="routerToDetails(scope.row)">详 情</el-button>
                    <el-button type="danger" size="mini">修 改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 龙虎列表 -->
        <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" style="width: 100%" :key="formData.gameType" v-else-if="formData.gameType == 'Longhu'">
            <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center" :width="item.id | LonguhFilterWidth">
                <template slot-scope="scope">
                    <span class="tableSpan" v-if="item.id != 'drawResult'">{{item.id | BaijialeShowText(scope.row[item.id])}}</span>
                    <el-tag size="samll" :type="scope.row.drawResult | showTagType(LonghuBetList)" v-if="item.id == 'drawResult'">{{scope.row.drawResult}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="routerToDetails(scope.row)">详 情</el-button>
                    <el-button type="danger" size="mini">修 改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 牛牛，三公，推筒子列表 -->
        <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" style="width: 100%" :key="formData.gameType" v-else>
            <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center" :width="item.id | LonguhFilterWidth">
                <template slot-scope="scope" v-if="item.id != 'drawResult'">
                    <span class="tableSpan">{{item.id | NiuniushowText(scope.row[item.id])}}</span>
                </template>
                <el-table-column :label="val" v-for="(val,keys) of NiuniuBetList" :key="keys" align="center" width="80px" v-if="item.id == 'drawResult'">
                    <template slot-scope="scope">
                        <span>{{item.id | NiuniushowText(scope.row[item.id],val)}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="routerToDetails(scope.row)">详 情</el-button>
                    <el-button type="danger" size="mini">修 改</el-button>
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
                timeField:"createdAt",
                startTime:"",
                endTime:"",
                deskStartDate:"",
                gameType:"BaijialeSuper6",
                deskShoeGameNumber:"",
                deskShoeNumber:"",
                deskNumber:""
            },
            TableData:{
                title:[{id:"id",name:"ID"},{id:"memberUsername",name:"会员-用户名"},{id:"gameType",name:"游戏类型"},{id:"currency",name:"货币类型"},{id:"allBetMoney",name:"押注总额"},{id:"allSystemProfitMoney",name:"系统输赢"},{id:"playMoney",name:"洗码量"},{id:"memberCommissionRate",name:"佣金率"},{id:"memberCommissionMoney",name:"佣金"},{id:"drawResult",name:"开奖结果"},{id:"betList",name:"押注位"},{id:"updatedAt",name:"录入时间"},{id:"staffNumber",name:"员工编号"},{id:"staffOperationIp",name:"操作IP"},{id:"deskStartTime",name:"开盘时间"}],
                value:[]
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
            GameTypeMap:{},
            gameTypeClone:"超六百家乐",
            startEndDate:[],
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数 
            showSearchBtn:true,
            LonghuBetList:[],
            NiuniuBetList:[]
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
    },
    methods:{
        setAllConstData(){
            if(this.allConst.GameTypeMap){
                this.GameTypeMap = {...this.allConst.GameTypeMap}
            }
            if(this.allConst.LonghuBetList){
                this.LonghuBetList = [...this.allConst.LonghuBetList]
            }
            if(this.allConst.NiuniuBetList){
                this.NiuniuBetList = this.allConst.NiuniuBetList;
            }
        },
        searchCli(){
            this.showSearchBtn = false;
            Object.keys(this.GameTypeMap).forEach((val)=>{
                if(this.GameTypeMap[val] == this.gameTypeClone){
                    this.formData.gameType = val;
                }
            })
            var params = {};
            Object.keys(this.formData).forEach((item)=>{
                if(this.formData[item] !== ""){
                    params[item] = this.formData[item]
                }
            })
            this.$http.post(this.$Api.supervisionOrderGetListApi,params).then(
                (res)=>{
                    this.showSearchBtn = true;
                    if(res.data.code == 0){
                        this.TableData.value = res.data.data.list;
                        this.totalCount = res.data.data.count;
                    }
                    console.log("交易单列表",res.data.data)
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
        routerToDetails(val){
            var obj = JSON.stringify(val)
            sessionStorage.setItem("oderdetailsObj",obj)
            this.$router.push("/OrderDetails")
        }
    },
    filters:{
        BaijialeFilterWidth(str){
            if(str == "id"){
                return "60"
            }else if(str == "deskStartTime"){
                return "140"
            }else if(str == "drawResult"){
                return "180"
            }else{
                return "100"
            }
        },
        LonguhFilterWidth(str){
            if(str == "id"){
                return "60"
            }else if(str == "deskStartTime"){
                return "140"
            }else{
                return "100"
            }
        },
        BaijialeShowText(str,val){
            if(str == 'gameType'){
                return val.name
            }else if(str == 'betList'){
                return val.length
            }else if(str == 'currency'){
                return val.id
            }else{
                return val
            }
        },
        showTagType(str,val){
            var i = val.indexOf(str);
            if(i == 0){
                return "warning"
            }else if(i == 1){
                return ""
            }else if(i == 2){
                return "success"
            }
        },
        NiuniushowText(str,val,item){
            if(str == 'gameType'){
                return val.name
            }else if(str == 'betList'){
                return val.length
            }else if(str == 'drawResult'){
                var drawStr = "-"
                if(Array.isArray(val)){
                    val.forEach((cur)=>{
                        if(cur.name == item){
                            drawStr = cur.result
                        }
                    })
                }
                return drawStr;
            }else{
                return val
            }
        },
    },
}
</script>
<style scoped>
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
.typeBox .d_iblock.changeWidth>div{width:9rem}
.mt_01{margin-top:0.1rem}
.w_10{width:10rem}
</style>