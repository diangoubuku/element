<template>
    <div class="desklog">
        <ul class="d_flex titleBox">
            <li>加彩</li>
            <li><span>台面：G50</span><span>入账日期：{{startDate}}</span></li>
        </ul>
        <div class="searchBox t_right pr_036">
            <div class="d_iblock mx_1 v_top">
                <span>货币类型：</span>
                <div class="d_iblock w_5">
                    <el-select v-model="formData.currency" size="mini">
                        <el-option v-for="(item,index) of Object.keys(CurrencyTypeMap)" :value="item" :key="index"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="d_iblock v_top">
                <span>总需货币：</span>
                <div class="d_iblock">
                    <el-checkbox-group v-model="formData.actChipParams" size="small">
                        <el-checkbox v-for="chip in Object.keys(CurrencyTypeMap)" :label="chip" :key="chip">{{chip}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <el-table :data="tableData1.value" border size="mini" style="width: 100%" :header-cell-style="{background:'#DCDFE6',color:'#000'}">
            <el-table-column v-for="(item,index) of tableData1.title" :key="item.id" :label="item.name" align="center">
                <template slot-scope="scope">
                    <span v-if="(item.id != 'Cash' && item.id != 'CashChip' && item.id != 'SignChip') || !scope.row.showNum">{{scope.row[item.id] | showMoney(item.id)}}</span>
                    <input type="text" style="text-align:center" v-if="(item.id == 'Cash' || item.id == 'CashChip' || item.id == 'SignChip') && scope.row.showNum" v-model="tableData1.value[scope.$index][item.id]" @input="getNum(scope.$index,item.id)" class="numInput">
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
            formData:{
                actType:"OpenDesk",
                currency:"",
                actChipParams:["CNY","USD"],
                info:""
            },


            lockAct:{},
            startDate:"",
            ChipNumsList:[],
            ChipTypeMap:{},
            CurrencyTypeMap:{},
            curChosen:"",
            baseNumber:""
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
        this.addChipNumsList()
    },
    watch:{
        baseInfo(){
            this.setBaseInfoData()
        },
        allConst(){
            this.setAllConstData()
        },
        curChosen(){
            if(this.lockAct.name == 'OpenDesk' && this.lockAct.needSubmit != 'HaveNot' && this.lockAct.needSubmit !='Complete'){
                this.formData.currency = this.lockAct.needSubmit
            }else{
                this.formData.currency = this.curChosen;
            }
        },
        lockAct(){
            if(this.lockAct.name == 'OpenDesk' && this.lockAct.needSubmit != 'HaveNot' && this.lockAct.needSubmit !='Complete'){
                this.formData.currency = this.lockAct.needSubmit
            }else{
                this.formData.currency = this.curChosen;
            }
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
            if(this.baseInfo.lockAct){
                this.lockAct = this.baseInfo.lockAct;
                if(this.lockAct.name == 'OpenDesk' && this.lockAct.needSubmit != 'HaveNot' && this.lockAct.needSubmit !='Complete'){
                    this.formData.currency = this.lockAct.needSubmit
                }else{
                    this.formData.currency = this.curChosen;
                }
            }
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
            this.tableData1.value[i][keyNum] = this.tableData1.value[i].money * 10 * this.tableData1.value[i][key] / 10;
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
                        var obj = {chipType:val,money:item.money,nums:item[val]};
                        arr.push(obj);
                    }
                })
            })
            if(arr.length > 0){
                var chipData = JSON.stringify(arr)
                var actChipParams = this.formData.actChipParams.toLocaleString()
                var params={chipData,actType:"OpenDesk",currency:_this.formData.currency,actChipParams,info:""}
                this.$http.post(this.$Api.deskLogSubmitApi,params).then(
                    (res)=>{
                        if(res.data.code == 0){
                            this.$message({
                                message: "提交成功",
                                type: 'success'
                            });
                        }
                        this.$emit("getBaseInfo")
                        this.addChipNumsList()
                    },
                    (error)=>{
                        console.log(error)
                    }
                )
            }else{
                this.$message({
                    message: "请输入有效数量",
                    type: 'warning'
                });
            }
        }
    },
    filters:{
        showMoney(num,str){
            if(str == 'Cash' || str == 'CashChip' || str == 'SignChip'){
                return num;
            }else if(!isNaN(num)){
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
.desklog{background-color:#f5f7fa;text-align: center;padding:0 0 0.6rem}
.titleBox{display:flex;justify-content: space-between;}
.titleBox li{display:flex;width:26rem;justify-content: space-between;padding:0.24rem 0.6rem;background-color:#9d9d9d;margin-bottom:0.48rem}

.searchBox{margin-bottom:0.48rem;line-height:28px}
.mx_1{margin:0 1rem}
.typeBox .box{width:8rem;display:inline-block}

.numInput{text-align: center;padding:0.12rem 0rem;width:5rem}
.my_036{margin:0.36rem 0}
.pr_036{padding-right:0.36rem}
.w_5{width:5rem}
.confirm{padding:9px 15px;color: #FFF;background-color: #409EFF;border-radius:3px;width:8rem}
.confirm:focus,.confirm:hover{background-color: #66b1ff;}
</style>