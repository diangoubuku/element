<template>
    <div class="order t_left">
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
                <el-input v-model="formData.deskNumber" size="mini"></el-input>
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
        <div class='ox_auto d_iblock w_100'>
            <el-table :data="BaccTableData.value" border :key="formData.gameType" size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" v-if="formData.gameType == 'BaijialeSuper6'">
                <el-table-column :label="item.name" v-for="(item,index) in BaccTableData.title" :key="index" align="center" :width="item.id == 'createdAt' ? '160px' : '100px'">
                    <template slot-scope="scope" v-if="item.id != 'drawResult'">
                        <span>{{item.id | BaccshowText(scope.row[item.id],item.name)}}</span>
                    </template>
                    <el-table-column :label="val.name" v-for="(val,keys) of BaccBetList" :key="keys" align="center" width="120px" v-if="item.id == 'drawResult'">
                        <template slot-scope="scope">
                            <span>{{item.id | BaccshowText(scope.row[item.id],val)}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table :data="LonghuTableData.value" border :key="formData.gameType" size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" v-else-if="formData.gameType == 'Longhu'">
                <el-table-column :label="item.name" v-for="(item,index) in LonghuTableData.title" :key="index" align="center" :width="item.id == 'createdAt' ? '160px' : '100px'">
                    <template slot-scope="scope" v-if="item.id != 'betList'">
                        <span>{{item.id | LonghushowText(scope.row[item.id])}}</span>
                    </template>
                    <el-table-column :label="val" v-for="(val,keys) of LonghuBetList" :key="keys" align="center" width="120px" v-if="item.id == 'betList'">
                        <template slot-scope="scope">
                            <span>{{item.id | LonghushowText(scope.row[item.id],val)}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table :data="NiuniuTableData.value" border :key="formData.gameType" size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" v-else>
                <el-table-column :label="item.name" v-for="(item,index) in NiuniuTableData.title" :key="index" align="center" :width="item.id == 'createdAt' ? '160px' : '100px'">
                    <template slot-scope="scope" v-if="item.id != 'drawResult' && item.id != 'betList'">
                        <span>{{item.id | NiuniushowText(scope.row[item.id])}}</span>
                    </template>
                    <el-table-column :label="val" v-for="(val,keys) in NiuniuBetList" :key="val + keys" align="center" width="120px" v-if="item.id == 'drawResult'">
                        <template slot-scope="scope">
                            <span>{{item.id | NiuniushowText(scope.row[item.id],val)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="val" v-for="(val,keys) in NiuniuBetOptionList" :key="val + keys" align="center" width="120px" v-if="item.id == 'betList'">
                        <template slot-scope="scope">
                            <span>{{item.id | NiuniushowText(scope.row[item.id],item.name,allConst.NiuniuBetList,NiuniuBetOptionList,keys)}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <div class="t_right">
                <el-pagination background layout="sizes, total, prev, pager, next" :page-sizes="[10,15,20,25,30]" :page-size="formData.rows" :total="totalCount" :current-page="pageCurr"  @size-change="changeSize" @current-change="changeCurr"></el-pagination>
            </div>
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
                gameType:"Longhu",
                deskShoeGameNumber:"",
                deskShoeNumber:"",
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
            GameTypeMap:{},
            gameTypeClone:"龙虎",
            NiuniuBetList:[],
            BaccBetList:[{id:"result",name:"主结果"},{id:"duiResult",name:"对子"},{id:"superResult",name:"幸运六"}],
            LonghuBetList:[],
            NiuniuBetOptionList:[],
            NiuniuTableData:{       //表格数据
                title:[],
                value:[]
            },
            BaccTableData:{
                title:[],
                value:[]
            },
            LonghuTableData:{
                title:[],
                value:[]
            },
            showSearchBtn:true,
            startEndDate:[],
            pageCurr:1,         //当前页
            totalCount:0,       //总数据数 
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
            var arr = [{id:"id",name:"交易单ID"},{id:"deskStartDate",name:"开盘日期"},{id:"currency",name:"货币类型"},{id:"deskShoeGameNumber",name:"游戏局口"},{id:"seatNumber",name:"座位号"},{id:"gameType",name:"游戏类型"},{id:"deskNumber",name:"台面编号"},{id:"memberUsername",name:"用户名"},{id:"deskStartDate",name:"用户姓名"},{id:"allSystemProfitMoney",name:"平台总输赢"},{id:"drawResult",name:"开奖结果"}]
            var arr1 = [{id:"isCancel",name:"是否取消"},{id:"updatedAt",name:"修改时间"},{id:"createdAt",name:"创建时间"}]
            if(this.allConst.NiuniuBetList){        //用户姓名 平台总输赢 状态 修改时间 "oddsName": "闲2|翻倍"
                var arrClone = JSON.parse(JSON.stringify(arr))
                this.allConst.NiuniuBetList.forEach((val,index)=>{
                    var obj={id:"betList",name:val};
                    arrClone.push(obj)
                })
                arrClone.push(...arr1)
                this.NiuniuTableData.title = [...arrClone]
                var listArr = ["庄"]
                listArr.push(...this.allConst.NiuniuBetList)
                this.NiuniuBetList = listArr
            }
            if(this.allConst.BaijialeSuper6BetList){
                var arrClone = JSON.parse(JSON.stringify(arr))
                this.allConst.BaijialeSuper6BetList.forEach((val,index)=>{
                    var obj={id:"betList",name:val};
                    // obj.id = "betMoney" + (index + 1);
                    arrClone.push(obj)
                })
                arrClone.push(...arr1)
                this.BaccTableData.title = [...arrClone]
            }
            if(this.allConst.LonghuBetList){
                var arrClone = JSON.parse(JSON.stringify(arr))
                arrClone.push({id:"betList",name:"押注结果"},...arr1)
                this.LonghuTableData.title = [...arrClone]
                this.LonghuBetList = [...this.allConst.LonghuBetList]
            }
            if(this.allConst.NiuniuBetOptionList){
                this.NiuniuBetOptionList = this.allConst.NiuniuBetOptionList
            }
            if(this.allConst.GameTypeMap){
                this.GameTypeMap = {...this.allConst.GameTypeMap}
            }
        },
        searchCli(){
            var _this = this;
            this.showSearchBtn = false;
            var params = {};
            Object.keys(this.GameTypeMap).forEach((val)=>{
                if(this.GameTypeMap[val] == this.gameTypeClone){
                    this.formData.gameType = val;
                }
            })
            Object.keys(this.formData).forEach((val)=>{
                if(this.formData[val] !== ""){
                    params[val] = this.formData[val]
                }
            })
            this.$http.post(this.$Api.orderGetListApi,params).then(
                (res)=>{
                    this.showSearchBtn = true;
                    if(res.data.code == 0){
                        if(_this.formData.gameType == "BaijialeSuper6"){
                            _this.BaccTableData.value = [...res.data.data.list]
                        }else if(_this.formData.gameType == "Longhu"){
                            _this.LonghuTableData.value = [...res.data.data.list]
                        }else{
                            _this.NiuniuTableData.value = [...res.data.data.list]
                        }
                        this.totalCount = res.data.data.count;
                    }
                    console.log("交易单",res.data.data)
                },
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
        NiuniushowText(str,val,item,arr1,arr2,i){
            if(str == "gameType"){
                return val.name
            }else if(str == "drawResult"){
                var results="未开牌";
                val.forEach((items)=>{
                    if(items.name == item){
                        results = items.result
                    }
                })
                return results
            }else if(str == "isCancel"){
                if(val == 0){
                    return "否"
                }else{
                    return "是"
                }
            }else if(str == "betList"){
                var num = "-";
                val.forEach((cur)=>{
                    console.log(cur.name)
                    if(cur.name == item && cur.multiple == i){
                        if(cur.drawMoney > 0){
                            num = cur.betMoney.toString() + "\u3000+" + cur.drawMoney.toString()
                        }else{
                            num = cur.betMoney.toString() + "\u3000" + cur.drawMoney.toString()
                        }
                    }
                })
                return num
            }else{
                return val
            }
        },
        BaccshowText(str,val,item,arr1){
            if(str == "gameType"){
                return val.name
            }else if(str == "drawResult"){
                if(val[item.id] == ""){
                    return "-"
                }else{
                    return val[item.id]
                }
            }else if(str == "betList"){
                var num = "-";
                val.forEach((cur)=>{
                    console.log(cur.name)
                    if(cur.name == item){
                        if(cur.drawMoney > 0){
                            num = cur.betMoney.toString() + "\u3000+" + cur.drawMoney.toString()
                        }else{
                            num = cur.betMoney.toString() + "\u3000" + cur.drawMoney.toString()
                        }
                    }
                })
                return num
            }else if(str == "isCancel"){
                if(val == 0){
                    return "否"
                }else{
                    return "是"
                }
            }else{
                return val
            }
        },
        LonghushowText(str,val,item){
            if(str == "gameType"){
                return val.name
            }else if(str == "isCancel"){
                if(val == 0){
                    return "否"
                }else{
                    return "是"
                }
            }else if(str == "betList"){
                var num = "-";
                val.forEach((cur)=>{
                    console.log(cur.name)
                    if(cur.name == item){
                        if(cur.drawMoney > 0){
                            num = cur.betMoney.toString() + "\u3000+" + cur.drawMoney.toString()
                        }else{
                            num = cur.betMoney.toString() + "\u3000" + cur.drawMoney.toString()
                        }
                    }
                })
                return num
            }else{
                return val
            }
        },
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