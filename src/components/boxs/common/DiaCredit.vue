<template>
    <div class="credit">
        <!-- 顶部当前台面 -->
        <div class="topBox f_0">
            <!-- 头部信息 -->
            <div class="titleBox c_both f_14">
                <p class="f_left"><span>当前台面：{{baseNumber}}&nbsp&nbsp&nbsp&nbsp<span class="f_12 c_blue">[{{gameType.name}}]</span></span><span>入账日期：2020-8-20</span></p>
                <div class="f_right">
                    <span>当前货币：</span>
                    <select v-model="form.currency" disabled><option v-for="(item,index) of Object.keys(CurrencyTypeMap)">{{item}}</option></select>
                </div>
            </div>
            <!-- 左侧表格 -->
            <div class="d_iblock leftBox v_top">
                <el-table :header-cell-style="{background:'#DCDFE6',color:'#000'}" :cell-style="setCellBg" :data="tableData.value" border size="mini" style="width: 100%">
                    <el-table-column v-for="(item,index) of tableData.title" :key="index" :label="item.name" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row[item.id] | filterSpanClass(scope.$index,tableData.value.length - 1)">{{scope.row[item.id] | showNumber}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="合计" align="center">
                        <template slot-scope="scope">
                            <span :class="scope.row.cashChip | addNum(scope.row.cash,scope.row.signChip,scope.row.allNum,1)">{{scope.row.cashChip | addNum(scope.row.cash,scope.row.signChip,scope.row.allNum)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <p class="t_right f_14"><span>总误差值：</span><span :class="form.difference | filteClass">{{form.difference | addNum}}</span></p>
            </div>
            <!-- 右侧异常信息 -->
            <div class="rightBox v_top">
                <div class="p_relative box mb_068">
                    <span class="cardTitle p_absolute">异常信息</span>
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="误差金额：">
                            <div class="w_8">
                                <el-input v-model="form.difference" size="mini" width="100px" :readonly="true"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="异常备注：">
                            <el-input type="textarea" :value="dialogList.info" :autosize="{ minRows: 1, maxRows: 6}" :readonly="true"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <p class="t_right f_14 mb_068" v-if="dialogList.status.id == '0' || dialogList.status.id == '1'">提交时间：{{dialogList.createdAt}}</p>
                <div class="d_flex f_14 mb_068">
                    <span class="w_nowrap">审核备注：</span> <el-input type="textarea" v-model="handlerInfo" :autosize="{ minRows: 1, maxRows: 6}"></el-input>
                </div>
                <p class="t_center" v-if="dialogList.status.id == '0' || dialogList.status.id == '1'"><el-button class="bg_red c_white" size="small" @click="submit(3)">审核不通过</el-button><el-button class="c_white bg_green" size="small" @click="submit(2)">审核通过</el-button></p>
            </div>
        </div>
        <!-- 底部台面剩余 -->
        <div class="bottomBox">
            <!-- 头部信息 -->
            <p>
                <span class="d_iblock titleText">实际台面剩余</span>
            </p>
            <!-- <el-table :data="tableData1.value" border size="mini" style="width: 100%" :header-cell-style="{background:'#DCDFE6',color:'#000'}" :cell-style="setCellBg1"> -->
            <el-table :data="tableData1.value" border size="mini" style="width: 100%" :header-cell-style="{background:'#DCDFE6',color:'#000'}" height="300">
                <el-table-column v-for="(item,index) of tableData1.title" :key="item.id" :label="item.name" align="center">
                    <template slot-scope="scope">
                        <span v-if="(item.id != 'Cash' && item.id != 'CashChip' && item.id != 'SignChip') || !scope.row.showNum" :class="scope.row[item.id] | filteClass(item.id)">{{scope.row[item.id] | showMoney(item.id)}}</span>
                        <input type="text" style="text-align:center" v-if="(item.id == 'Cash' || item.id == 'CashChip' || item.id == 'SignChip') && scope.row.showNum" v-model="tableData1.value[scope.$index][item.id]" @input="getNum(scope.$index,item.id)" :class="tableData1.value[scope.$index][item.id] | filteInputClass">
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogList","gameType","baseNumber","chipData","realChipData","ChipNumsList","ChipTypeMap","curChosen","CurrencyTypeMap"],
    data(){
        return{
            handlerInfo:"",
            tableData: {
                title:[{id:"stats",name:""},{id:"cashChip",name:"现金码"},{id:"cash",name:"现金"},{id:"signChip",name:"签单码"}],
                value:[
                    {
                        id:"openDesk",
                        stats: '开台',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },{
                        id:"addChip",
                        stats: '加彩',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },{
                        id:"reduceChip",
                        stats: '减彩',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },{
                        id:"order",
                        stats: '交易单',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },{
                        id:"total",
                        stats: '合计',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },{
                        stats: '实际合计',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },{
                        stats: '误差值',
                        cashChip: 0,
                        cash: 0,
                        signChip:0,
                        allNum:0
                    },
                ]
            },
            form:{
                type:"NormalCheck",
                difference:"-",
                // hasSolve:"否",
                info:"",
                currency:"",             //当前货币       
                chipData:{} 
            },
            tableData1: {
                title:[],
                value:[]
            }
        }
    },
    mounted(){
        this.form.currency = this.curChosen;
        this.addChipNumsList();
        this.pushChipdata();
    },
    watch:{
        curChosen(){
            this.form.currency = this.curChosen;
        },
        ChipNumsList(){
            this.addChipNumsList()
        },
        ChipTypeMap(){
            this.addChipNumsList()
        },
    },
    methods:{
        addChipNumsList(){
            if(this.ChipNumsList && this.ChipTypeMap){
                var arr = [{id:"money",name:"面值"}]
                Object.keys(this.ChipTypeMap).forEach((val)=>{
                    var objId = val + "Num";
                    var objName = this.ChipTypeMap[val] + "-金额"
                    var arr1 = [{id:val,name:this.ChipTypeMap[val]},{id:objId,name:objName}]
                    arr.push(...arr1);
                })
                var valueArr = [];
                var numObj = {showNum:true};
                var staObj = {statis:true};
                arr.forEach((val)=>{
                    numObj[val.id] = 0;
                    staObj[val.id] = 0;
                })
                this.ChipNumsList.forEach((item)=>{
                    var obj = {...numObj};
                    obj.money = item;
                    valueArr.push(obj);
                })
                staObj.money = "合计";
                valueArr.push(staObj);
                this.tableData1.title = [...arr];
                this.tableData1.value = [...valueArr]
            }
        },
        setCellBg({row, column, rowIndex, columnIndex}){
            if(columnIndex === 0){
                return 'background:#DCDFE6;color:#000'
            }
        },
        setCellBg1({row, column, rowIndex, columnIndex}){
            if(rowIndex === 0){
                return 'background:#DCDFE6;color:#000'
            }
        },
        getNum(i,key){
            // this.tableData1.value[i][key] = Number(this.tableData1.value[i][key].match(/^\d{1,7}/g))
            this.tableData.value[this.tableData.value.length - 1].allNum = 0 - Number(this.chipData.order);
            var keysObj = {};
            var chipData = [];
            Object.keys(this.ChipTypeMap).forEach((val)=>{
                var str = val + "Num";
                keysObj[val] = 0;
                keysObj[str] = 0;
            })
            this.tableData1.value[i][key] = Number(this.tableData1.value[i][key]);
            var keyNum = key + "Num"
            this.tableData1.value[i][keyNum] = this.tableData1.value[i].money * 100 * this.tableData1.value[i][key] / 100;
            this.tableData1.value.forEach((val)=>{
                if(val.showNum){
                    Object.keys(this.ChipTypeMap).forEach((item)=>{
                        if(val[item] > 0){
                            chipData.push({chipType:item,money:val.money,nums:val[item]})
                        }
                    })
                    Object.keys(keysObj).forEach((item)=>{
                        keysObj[item] += val[item];
                    })
                }else if(val.statis){
                    Object.keys(keysObj).forEach((item)=>{
                        val[item] = keysObj[item];
                    })
                    this.tableData.value[this.tableData.value.length - 2].cash = keysObj.CashNum;      //实际合计 现金
                    this.tableData.value[this.tableData.value.length - 2].cashChip = keysObj.CashChipNum;  //实际合计 现金码
                    this.tableData.value[this.tableData.value.length - 2].signChip = keysObj.SignChipNum;  //实际合计 签单码

                    this.tableData.value[this.tableData.value.length - 1].cashChip = keysObj.CashChipNum > this.tableData.value[this.tableData.value.length - 3].cashChip ? '+' + (keysObj.CashChipNum - this.tableData.value[this.tableData.value.length - 3].cashChip) : keysObj.CashChipNum - this.tableData.value[this.tableData.value.length - 3].cashChip;   //当前台面实际合计现金码误差值
                    this.tableData.value[this.tableData.value.length - 1].cash = keysObj.CashNum > this.tableData.value[this.tableData.value.length - 3].cash ? '+' + (keysObj.CashNum - this.tableData.value[this.tableData.value.length - 3].cash) : keysObj.CashNum - this.tableData.value[this.tableData.value.length - 3].cash;    //当前台面实际合计现金误差值
                    this.tableData.value[this.tableData.value.length - 1].signChip = keysObj.SignChipNum > this.tableData.value[this.tableData.value.length - 3].signChip ? '+' + (keysObj.SignChipNum - this.tableData.value[this.tableData.value.length - 3].signChip) : keysObj.SignChipNum - this.tableData.value[this.tableData.value.length - 3].signChip;    //当前台面实际合计签单码误差值
                    this.form.difference = keysObj.CashNum + keysObj.CashChipNum + keysObj.SignChipNum - this.tableData.value[this.tableData.value.length - 3].cashChip - this.tableData.value[this.tableData.value.length - 3].cash - this.tableData.value[this.tableData.value.length - 3].signChip - this.tableData.value[this.tableData.value.length - 1].allNum     //总误差值
                }
            })
            this.form.chipData = JSON.stringify(chipData);
        },
        pushChipdata(){
            if(this.chipData){
                var cashNum = 0;
                var cashChipNum = 0;
                var signChipNum = 0;
                console.log(this.chipData,this.form.currency)
                Object.keys(this.chipData).forEach((val)=>{
                    if(val != "order" && val != "sum"){
                        cashNum += this.chipData[val].cash;
                        cashChipNum += this.chipData[val].cashChip;
                        signChipNum += this.chipData[val].signChip;
                    }
                    console.log(333,this.tableData)
                    this.tableData.value.forEach((items)=>{
                        if(items.id == val){
                            if(val == "order"){
                                items.allNum = Number(this.chipData[val]);
                            }else{
                                Object.keys(this.chipData[val]).forEach((item)=>{
                                    items[item] = this.chipData[val][item];
                                })
                            }
                        }
                    })
                })
                console.log(this.tableData.value)
                this.tableData.value[this.tableData.value.length - 3].cash = cashNum;
                this.tableData.value[this.tableData.value.length - 3].cashChip = cashChipNum;
                this.tableData.value[this.tableData.value.length - 3].signChip = signChipNum;
                this.tableData.value[this.tableData.value.length - 3].allNum =  Number(this.chipData.order);
                this.realChipData.forEach((item)=>{
                    this.tableData1.value.forEach((val,index)=>{
                        if(item.money == val.money){
                            this.tableData1.value[index][item.chipType] = item.nums;
                            this.getNum(index,item.chipType)
                        }
                    })
                })
            }
        },
        submit(i){
            var params = {deskCheckLogId:this.dialogList.id,status:i,handlerInfo:this.handlerInfo};
            this.$http.post(this.$Api.accountDeskCheckLogHandlerApi,params).then(
                (res)=>{
                    if(res.data.code == 0){
                        this.$message({
                            message: `清点提交成功`,
                            type: 'success',
                            center: true
                        });
                    }
                    this.$emit("searchCli")
                    this.$emit("closeDia")
                    console.log("前台清点提交",res.data.data)
                },
                (error)=>{
                    console.log(error)
                },
            )
        }
    },
    filters:{
        addNum(num1,num2,num3,num4,isClass){
            var str;
            if(num1 || num2 || num3 || num4){
                var num = (num1 === undefined ? 0 : Number(num1)) + (num2 === undefined ? 0 : Number(num2)) + (num3 === undefined ? 0 : Number(num3)) + (num4 === undefined ? 0 : Number(num4));
                    if(num2 == "ssss"){
                        console.log(9999999,num)
                    }
                if(isClass == 1){
                    if(num > 0){
                        str = "c_red"
                    }else if(num < 0){
                        str = "c_green"
                    }
                }else{
                    if(num > 0){
                        str = "+" + num.toFixed(2)
                    }else{
                        str = num.toFixed(2)
                    }
                }
            }else{
                str = "-"
            }
            return str
        },
        showNumber(num){
            if(num == 0){
                return "-"
            }else if(isNaN(num)){
                return num
            }else{
                return Number(num).toFixed(2)
            }
        },
        showMoney(num,str){
            if(str == 'Cash' || str == 'CashChip' || str == 'SignChip'){
                return num;
            }else if(!isNaN(num)){
                var fixedNum = Number(num).toFixed(2);
                return fixedNum;
            }else{
                return num;
            }
        },
        filterSpanClass(num,i,j){
            if(i == j){
                if(!isNaN(num)){
                    if(num > 0){
                        return "c_red"
                    }else if(num < 0){
                        return "c_green"
                    }
                }
            }
        },
        filteClass(num,numId){
            if(numId == "money"){
                return ""
            }else{
                if(num > 0){
                    return "c_red"
                }else if(num < 0){
                    return "c_green"
                }
            }
        },
        filteInputClass(num){
            var str = "numInput "
            if(num > 0){
                str += "c_red"
            }else if(num < 0){
                str += "c_green"
            }
            return str
        }
    }
}
</script>
<style scoped>
.topBox,.bottomBox{background-color:#f5f7fa;margin-bottom:0.6rem}
.bottomBox{margin:0;padding-bottom:1rem}
.titleBox{margin-bottom:0.6rem;margin-right:4rem}
.titleBox .f_left{display:flex;width:30rem;justify-content: space-between;padding:0.24rem 0.9rem;background-color:#9d9d9d}
.leftBox{width:40%}
.leftBox p.t_right{padding:0.24rem 2rem}
.rightBox{width:60%;padding:0 4rem;display:inline-block}
.rightBox .box{border:1px solid #9d9d9d;box-sizing: border-box;border-radius:0.18rem;padding:1rem 3rem 1rem 0}
.cardTitle{top:-0.7rem;left:10%;padding:0 0.24rem;background-color:#fff}
.w_8{width:8rem}
.titleText{width:30rem;background-color:#9d9d9d;padding:0.24rem 0.9rem;}
.bottomBox p{margin-bottom:0.24rem}
.numInput{text-align: center;padding:0.12rem 0rem;width:5rem}
.f_0{font-size:0}
.f_14{font-size:14px}
.f_12{font-size:12px}
.mb_068{margin-bottom:0.68rem}
.my_068{margin:0.68rem 0}
.bg_red{background-color:#d01c1c}
.bg_green{background-color:#08aa24;}
.c_white{color:rgba(225,225,225,1)}

.c_red{color:#b00}
.c_green{color:#57a957}
</style>