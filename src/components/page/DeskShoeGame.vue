<template>
    <div class="deskshoegame t_left">
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
                <el-input v-model="formData.number" size="mini" clearable></el-input>
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
        <el-table :data="TableData.value" border style="width: 100%" :key="TableData.showWhichTab" size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}">
            <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center" :min-width="item.id == 'createdAt' ? '160px' : (item.id == 'betMoney' || item.id == 'drawMoney' || item.id == 'deskStartDate' || item.id == 'gameType') ? '100px' : ''">
                <template slot-scope="scope" v-if="item.id != 'drawResult' || TableData.showWhichTab == 'Longhu'">
                    <span v-if="item.id != 'drawResult' && item.id != 'drawMoney'">{{item.id | showText(scope.row[item.id])}}</span>
                    <el-tag :type="scope.row[item.id] >= 0 ? 'danger' : 'success'" v-if="item.id == 'drawMoney'">{{scope.row[item.id]}}</el-tag>
                    <span v-if="item.id == 'drawResult'">{{scope.row[item.id]}}</span>
                </template>
                <el-table-column v-if="item.id == 'drawResult' && (TableData.showWhichTab == 'Niuniu' || TableData.showWhichTab == 'Sangong' || TableData.showWhichTab == 'Tuitongzi')" :label="val" v-for="(val,keys) of NiuniuBetList" :key="TableData.showWhichTab + keys" align="center">
                    <template slot-scope="scope">
                        <span>{{val | showDrawText(scope.row.drawResult,TableData.showWhichTab)}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.id == 'drawResult' && TableData.showWhichTab == 'BaijialeSuper6'" :label="BaijialeBetList[val]" v-for="(val,keys) of Object.keys(BaijialeBetList)" :key="TableData.showWhichTab + keys" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.drawResult[val] ? scope.row.drawResult[val] : '-'}}</span>
                    </template>
                </el-table-column>
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
                gameType:"Niuniu",
                number:"",
                deskNumber:""
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
            startEndDate:[],
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数 
            NiuniuBetList:[],
            GameTypeMap:{},
            BaijialeBetList:{result:"主结果",duiResult:"对子",superResult:"幸运六"},
            // NiubetListClone:[{id:"",name:"庄"},{id:"",name:"闲1"},{id:"",name:"闲2"},{id:"",name:"闲3"},{id:"",name:"闲4"},{id:"",name:"闲6"}],
            TableData:{       //表格数据
                showWhichTab:"Niuniu",
                title:[{id:"id",name:"ID"},{id:"deskStartDate",name:"开台日期"},{id:"number",name:"游戏局口"},{id:"gameType",name:"游戏类型"},{id:"deskNumber",name:"台面编号"},{id:"betMoney",name:"用户总押注"},{id:"drawMoney",name:"平台总输赢"},{id:"drawResult",name:"开奖结果"},{id:"createdAt",name:"创建时间"}],
                value:[]
            },
            gameTypeClone:"牛牛",
            showSearchBtn:true,
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
        gameTypeClone(){
            Object.keys(this.GameTypeMap).forEach((val)=>{
                if(this.GameTypeMap[val] == this.gameTypeClone){
                    this.formData.gameType = val;
                }
            })
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
            if(this.allConst.NiuniuBetList){
                var arr = ["庄"]
                arr.push(...this.allConst.NiuniuBetList)
                this.NiuniuBetList = arr
            }
            if(this.allConst.GameTypeMap){
                this.GameTypeMap = {...this.allConst.GameTypeMap}
            }
        },
        searchCli(){
            this.showSearchBtn = false;
            var params = {}
            Object.keys(this.formData).forEach((val)=>{
                if(this.formData[val] !== ""){
                    params[val] = this.formData[val]
                }
            })
            this.$http.post(this.$Api.deskShoeGameGetListApi,params).then(
                (res)=>{
                    this.showSearchBtn = true;
                    if(res.data.code == 0){
                        var cloneNiuniuTableData = JSON.parse(JSON.stringify(this.TableData))
                        cloneNiuniuTableData.showWhichTab = this.formData.gameType;
                        cloneNiuniuTableData.value = [...res.data.data.list]
                        this.TableData = {...cloneNiuniuTableData}
                        this.totalCount = res.data.data.count;
                    }
                    console.log("现场局口数据",res.data.data.list,this.TableData.showWhichTab)
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
    },
    filters:{
        showText(str,val){
            if(str == "gameType"){
                return val.name
            }else{
                return val
            }
        },
        showDrawText(str,val,gameType){
            var strText = "未开牌"
            if(gameType == "BaijialeSuper6"){
                strText = str 
            }else{
                val.forEach((item)=>{
                    if(item.name == str){
                        strText = item.result
                    }
                })
            }
            return strText;
        }
    }
}
</script>
<style scoped>
.deskshoegame{}
.typeBox .box{width:8rem;display:inline-block}
.form_box{margin:0 0.48rem 0.48rem 0;height:2rem;line-height:2rem}
.typeBox .d_iblock.changeWidth>div{width:9rem}
.mt_01{margin-top:0.1rem}
.w_10{width:10rem}
</style>