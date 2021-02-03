<template>
    <div class="addc">
        <ul class="d_flex titleBox">
            <li>减彩</li>
            <li><span>台面：{{baseNumber}}</span><span>入账日期：{{startDate}}</span></li>
        </ul>
        <div class="t_right my_036">
            <span>当前货币：</span>
            <div class="d_iblock w_5">
                <el-select v-model="temCurChosen" size="mini">
                    <el-option v-for="(item,index) of Object.keys(CurrencyTypeMap)" :value="item" :key="index"></el-option>
                </el-select>
            </div>
        </div>
        <el-table :data="tableData1.value" border size="mini" style="width: 100%" :header-cell-style="{background:'#DCDFE6',color:'#000'}">
            <el-table-column v-for="(item,index) of tableData1.title" :key="item.id" :label="item.name" align="center">
                <template slot-scope="scope">
                    <span v-if="(item.id != 'Cash' && item.id != 'CashChip' && item.id != 'SignChip') || !scope.row.showNum">{{scope.row[item.id] | showMoney}}</span>
                    <span class="mr_016" v-if="(item.id == 'Cash' || item.id == 'CashChip' || item.id == 'SignChip') && scope.row.showNum" v-model="tableData1.value[scope.$index][item.id]">-</span><input type="text" style="text-align:center" v-if="(item.id == 'Cash' || item.id == 'CashChip' || item.id == 'SignChip') && scope.row.showNum" v-model="tableData1.value[scope.$index][item.id]" @input="getNum(scope.$index,item.id)" class="numInput">
                </template>
            </el-table-column>
        </el-table>
        <button class="confirm my_036" @click="submit">提交</button>
    </div>
</template>
<script>
export default {
    props:[],
    data(){
        return{
            tableData1: {
                title:[],
                value:[]
            },
            temCurChosen:"",


            baseNumber:"",
            startDate:"",
            ChipNumsList:[],
            ChipTypeMap:{},
            curChosen:"",
            CurrencyTypeMap:{}
        }
    },
    computed:{
        baseInfo(){
            return this.$store.state.baseInfo
        },
        allConst(){
            return this.$store.state.allConst
        },
    },
    created(){
        this.$emit("getBaseInfo")
    },
    mounted(){
        this.setBaseInfoData()
        this.setAllConstData()
        this.addChipNumsList();
    },
    watch:{
        baseInfo(){
            this.setBaseInfoData()
        },
        allConst(){
            this.setAllConstData()
        },
        curChosen(){
            this.temCurChosen = this.curChosen
        },
        ChipNumsList(){
            this.addChipNumsList()
        },
        ChipTypeMap(){
            this.addChipNumsList()
        }
    },
    methods:{
        setBaseInfoData(){
            if(this.baseInfo.number){
                this.baseNumber = this.baseInfo.number;
            }
            if(this.baseInfo.startDate){
                this.startDate = this.baseInfo.startDate
            }
        },
        setAllConstData(){
            if(this.allConst.ChipNumsList){
                this.ChipNumsList = this.allConst.ChipNumsList
            }
            if(this.allConst.ChipTypeMap){
                this.ChipTypeMap = this.allConst.ChipTypeMap
            }
            if(this.allConst.curChosen){
                this.curChosen = this.allConst.curChosen.id
                this.temCurChosen = this.curChosen
            }
            if(this.allConst.CurrencyTypeMap){
                this.CurrencyTypeMap = this.allConst.CurrencyTypeMap
            }
        },
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
        setCellBg1({row, column, rowIndex, columnIndex}){
            if(rowIndex === 0){
                return 'background:#DCDFE6;color:#000'
            }
        },
        getNum(i,key){
            var keysObj = {};
            Object.keys(this.ChipTypeMap).forEach((val)=>{
                var str = val + "Num";
                keysObj[val] = 0;
                keysObj[str] = 0;
            })
            this.tableData1.value[i][key] = Number(this.tableData1.value[i][key].match(/^\d{1,7}/g));
            var keyNum = key + "Num";
            this.tableData1.value[i][keyNum] = 0 - (this.tableData1.value[i].money * 10 * this.tableData1.value[i][key] / 10);
            this.tableData1.value.forEach((val)=>{
                if(val.showNum){
                    Object.keys(keysObj).forEach((item)=>{
                        keysObj[item] += val[item];
                    })
                }else if(val.statis){
                    Object.keys(keysObj).forEach((item)=>{
                        val[item] = keysObj[item];
                    })
                }
            })
        },
        submit(){
            var _this = this;
            var arr = [];
            Object.keys(this.ChipTypeMap).forEach((val)=>{
                this.tableData1.value.forEach((item)=>{
                    if(item[val] != 0 && item.showNum){
                        var nums = 0 - item[val];
                        var obj = {chipType:val,money:item.money,nums};
                        arr.push(obj);
                    }
                })
            })
            var chipData = JSON.stringify(arr)
            var params={chipData,actType:"ReduceChip",currency:_this.temCurChosen,info:""}
            this.$http.post(this.$Api.deskLogSubmitApi,params).then(
                (res)=>{
                    console.log("提交加彩",res)
                },
                (error)=>{
                    console.log(error)
                }
            )
        }
    },
    filters:{
        showMoney(num){
            if(!isNaN(num)){
                var fixedNum = num.toFixed(2);
                return fixedNum;
            }else{
                return num;
            }
        }
    }
}
</script>
<style scoped>
.addc{background-color:#f5f7fa;text-align: center;padding:0 0 0.6rem}
.titleBox{display:flex;justify-content: space-between;}
.titleBox li{display:flex;width:26rem;justify-content: space-between;padding:0.24rem 0.6rem;background-color:#9d9d9d;margin-bottom:0.24rem}
.numInput{text-align: center;padding:0.12rem 0rem;width:5rem}
.my_036{margin:0.36rem 0}
.mr_016{margin-right:0.16rem}
.w_5{width:5rem}
.confirm{padding:9px 15px;color: #FFF;background-color: #409EFF;border-radius:3px;width:8rem}
.confirm:focus,.confirm:hover{background-color: #66b1ff;}
</style>