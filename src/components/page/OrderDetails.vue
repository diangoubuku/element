<template>
    <div class="oxchange">
        <div class="titleBox d_flex">
            <p class="w_50 t_left"><span>{{TableData.value.deskNumber}}</span><span>{{TableData.value.deskShoeNumber}}靴</span><span>{{TableData.value.deskShoeGameNumber}}局</span><span class="c_blue">【{{TableData.value.gameType ? TableData.value.gameType.name : '-'}}】</span></p>
            <p class="w_50 t_right"><span>入账日期：</span><span>{{TableData.value.createdAt}}</span></p>
        </div>
        <div class="tabBox">
            <!-- 百家乐，龙虎详情 表格 -->
            <el-table :data="TableData.title" border size="mini" :show-header="false" :span-method="arraySpanMethod" :cell-style="setCellBg" style="width: 100%;border:1px solid #9d9d9d" v-if="TableData.value.gameType && (TableData.value.gameType.id == 'BaijialeSuper6' || TableData.value.gameType.id == 'Longhu')">
                <el-table-column prop="name" align="right" width="160"></el-table-column>
                <el-table-column align="left">
                    <template slot-scope="scope">
                        <span class="tableSpan" v-if="scope.row.id != 'drawResult' && scope.row.id != 'betList' && scope.row.id != 'currency'">{{TableData.value[scope.row.id]}}</span>
                        <span class="tableSpan" v-if="scope.row.id == 'currency'">{{TableData.value[scope.row.id].id}}</span>
                        <p v-if="scope.row.id == 'drawResult'">
                            <el-tag size="small" v-if="TableData.value.drawResult && TableData.value.drawResult.result">{{TableData.value.drawResult.result}}</el-tag>
                            <el-tag type="success" size="small" v-if="TableData.value.drawResult && TableData.value.drawResult.duiResult">{{TableData.value.drawResult.duiResult}}</el-tag>
                            <el-tag type="warning" size="small" v-if="TableData.value.drawResult && TableData.value.drawResult.superResult">{{TableData.value.drawResult.superResult}}</el-tag>
                        </p>
                        <div v-if="scope.row.id == 'betList' && TableData.value.betList">
                            <div class="d_iblock t_center betDrawBox v_top" v-if="scope.row.id == 'betList'" v-for="item in TableData.value.betList">
                                <p>{{item.name}}</p>
                                <p><span>押注：</span><span>{{item.betMoney.toFixed(2)}}</span></p>
                                <p><span>输赢：</span><span :class="item.drawMoney > 0 ? 'c_red' : item.drawMoney < 0 ? 'c_green' : ''">{{item.drawMoney | showMoney}}</span></p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="right" width="160">
                    <template slot-scope="scope">
                        <span class="tableSpan">{{scope.row.subs.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left">
                    <template slot-scope="scope">
                        <span class="tableSpan">{{TableData.value[scope.row.subs.id]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 牛牛，三公，推筒子 表格 -->
            <el-table :data="TableData.title" border size="mini" :show-header="false" :span-method="arraySpanMethod" :cell-style="setCellBg" style="width: 100%;border:1px solid #9d9d9d" v-else>
                <el-table-column prop="name" align="right" width="160"></el-table-column>
                <el-table-column align="left">
                    <template slot-scope="scope">
                        <span class="tableSpan" v-if="scope.row.id != 'drawResult' && scope.row.id != 'betList'">{{TableData.value[scope.row.id]}}</span>
                        <!-- <p v-if="scope.row.id == 'drawResult'">
                            <el-tag size="small" v-if="TableData.value.drawResult && TableData.value.drawResult.result">{{TableData.value.drawResult.result}}</el-tag>
                            <el-tag type="success" size="small" v-if="TableData.value.drawResult && TableData.value.drawResult.duiResult">{{TableData.value.drawResult.duiResult}}</el-tag>
                            <el-tag type="warning" size="small" v-if="TableData.value.drawResult && TableData.value.drawResult.superResult">{{TableData.value.drawResult.superResult}}</el-tag>
                        </p> -->
                        <div v-if="scope.row.id == 'drawResult'" class="d_iblock NiuDrawBox t_center" v-for="(items,index) of Niulist" :key="index">
                            <p class='NiuDrawTitle'>{{items}}</p>
                            <div class="NiuDrawBody">{{items | showNiuDrawResult(TableData.value.drawResult)}}</div>
                        </div>
                        <div v-if="scope.row.id == 'betList' && TableData.value.betList">
                            <div class="d_iblock t_center betDrawBox v_top" v-if="scope.row.id == 'betList'" v-for="item in getBetList(TableData.value.betList)">
                                <!-- <p>{{item.name}}</p>
                                <p v-for="(val,keys) of NiuniuBetOptionList"><span>{{val}}：</span><span>{{item.betMoney[keys].toFixed(2)}}</span><span>{{item.drawMoney[keys] | showMoney}}</span></p> -->
                                <table class="NiuBetBox">
                                    <tr>
                                        <td colspan="3" class="t_center">{{item.name}}</td>
                                    </tr>
                                    <tr v-for="(val,keys) of NiuniuBetOptionList">
                                        <td>{{val}}：</td>
                                        <td>{{item.betMoney[keys].toFixed(2)}}</td>
                                        <td>{{item.drawMoney[keys] | showMoney}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="right" width="160">
                    <template slot-scope="scope">
                        <span class="tableSpan">{{scope.row.subs.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left">
                    <template slot-scope="scope">
                        <span class="tableSpan">{{TableData.value[scope.row.subs.id]}}</span>
                    </template>
                </el-table-column>
            </el-table>
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
                title:[{id:"drawResult",name:"开奖结果"},{id:"memberUsername",name:"洗码号"},{id:"currency",name:"货币类型"},{id:"betMoney",name:"押注总额"},{id:"allSystemProfitMoney",name:"系统输赢"},{id:"playMoney",name:"洗码量"},{id:"memberCommissionRate",name:"佣金率",subs:{id:"memberCommissionMoney",name:"佣金"}},{id:"betList",name:"押注&开奖"},{id:"id",name:"押注位",subs:{id:"updatedAt",name:"录入时间"}},{id:"staffNumber",name:"录入员工编号",subs:{id:"staffOperationIp",name:"录入员工IP"}},{id:"info",name:"更改日志"}],
                value:{}
            },
            betList:[],
            NiuniuBetOptionList:[],
            Niulist:[]
        }
    },
    computed:{
        allConst(){
            return this.$store.state.allConst
        },
    },
    created(){
        this.setAllConstData()
        console.log(77777)
        var obj = sessionStorage.getItem("oderdetailsObj")
        if(obj == "" || obj === null || obj ===undefined){
            this.$router.push("/SupervisionOrder")
        }else{
            var list = JSON.parse(obj)
            this.TableData.value = {...list}
            console.log("数据",list)
        }
    },
    mounted(){

    },
    watch:{
        allConst(){
            this.setAllConstData()
        },
    },
    methods:{
        setAllConstData(){
            if(this.allConst.NiuniuBetOptionList){
                this.NiuniuBetOptionList = this.allConst.NiuniuBetOptionList;
            }
            if(this.allConst.NiuniuBetList){
                this.Niulist = ["庄"]
                this.Niulist.push(...this.allConst.NiuniuBetList)

            }
        },
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (rowIndex !== 6 && rowIndex !== 8 && rowIndex !== 9) {
                if (columnIndex === 1) {
                    return [1, 3];
                } else if (columnIndex === 2 || columnIndex === 3) {
                    return [0, 0]
                }
            }
        },
        setCellBg({row, column, rowIndex, columnIndex}){
            if(columnIndex === 0 || columnIndex === 2){
                return 'background:rgb(235, 235, 235,1);color:#000;border-color:#9d9d9d'
            }else{
                return 'border-color:#9d9d9d'
            }
        },
        getBetList(val){
            var arr = []
            val.forEach((item)=>{
                var obj = {name:item.name,betMoney:[0,0,0],drawMoney:[0,0,0]};
                obj.betMoney[item.multiple] = item.betMoney;
                obj.drawMoney[item.multiple] = item.drawMoney;
                var hasNoPush = true;
                arr.forEach((str)=>{
                    if(str.name == item.name){
                        hasNoPush = false;
                        str.betMoney[item.multiple] = item.betMoney;
                        str.drawMoney[item.multiple] = item.drawMoney;
                    }
                })
                if(hasNoPush){
                    arr.push(obj)
                }
            })
            return arr;
        }
    },
    filters:{
        showMoney(num){
            var str = num.toFixed(2);
            if(num > 0){
                str = '+' + str;
            }
            return str;
        },
        showNiuDrawResult(str,val){
            var returnStr = '未开牌'
            val.forEach((item)=>{
                if(item.name == str){
                    returnStr = item.result
                }
            })
            return returnStr;
        }
    },
    beforeDestroy(){
        sessionStorage.removeItem("oderdetailsObj")
    }
}
</script>
<style scoped>
.leftTabZero{background-color:#fff;font-size:14px}
.leftTabZero td{height: 36px;line-height: 36px;border: 1px solid #EBEEF5;padding: 0 0.5rem;}
.leftTabZero>tr>td:nth-child(1){width:8rem;background-color: rgba(220,223,230,1);color:#000}
.leftTabZero table td{height: 100%;border: 0;border-right: 1px solid #EBEEF5;width: 33%;}
.betDrawBox{background-color:rgba(220,223,230,1);padding:0.25rem 0.5rem;border:1px solid #9d9d9d;margin-right:1rem}
.betDrawBox .NiuBetBox tr,.betDrawBox .NiuBetBox td{background-color:rgba(0,0,0,0);border:0}
.betDrawBox .NiuBetBox td{padding: 0 0.24rem;}
.betDrawBox .NiuBetBox .t_center{text-align: center;}
.c_red{color:#b00}
.c_green{color:#57a957}
.c_blue{color:#409EFF}
/* .tabBox{width:800px;margin:0 auto;} */
.titleBox{background-color:rgba(230,230,230,1);padding: 0.42rem;margin-bottom:0.63rem}
.titleBox p:nth-child(1) span{margin-right: 1rem;}
.NiuDrawBox{margin-right:1rem;width: 4.6rem;}
.NiuDrawTitle{background-color:rgba(230,230,230,1);margin-bottom:1px;padding: 0.1rem 0.64rem;font-size:14px}
.NiuDrawBody{background-color:rgba(240,240,240,1);padding: 0.1rem 0.64rem;font-size: 12px;}
</style>