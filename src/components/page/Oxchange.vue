<template>
    <div class="oxchange">
        <div class="titleBox d_flex">
            <p class="w_50"><span>G08</span><span>8靴</span><span>06局</span><span>【超六百家乐】</span></p>
            <p class="w_50 t_right"><span>入账日期</span><span>2020/5/20</span></p>
        </div>
        <div class="tabBox d_flex" style="height:30rem">
            <div class="w_50">
                <table cellspacing="0" class="w_100 leftTabZero" v-if="TableData.value.length > 0">
                    <tr v-for="(item,index) of TableData.title" class="t_left">
                        <td class='t_right'>{{item.name}}</td>
                        <td v-if="!item.subs">
                            <p v-if="item.id != 'drawResult'">
                                {{TableData.value[0][item.id]}}
                            </p>
                            <p v-else>
                                <span v-for="val in Object.keys(TableData.value[0].drawResult)" v-if="TableData.value[0].drawResult[val] != ''">{{TableData.value[0].drawResult[val]}}</span>
                            </p>
                        </td>
                        <td v-if="item.subs">
                            <table  class="w_100 h_100" cellspacing="0">
                                <tr>
                                    <td>{{TableData.value[0][item.id]}}</td>
                                    <td>{{item.subs.name}}</td>
                                    <td>{{TableData.value[0][item.subs.id]}}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="h_100" style="width:1px;min-width:1px;margin:0 10px;background-color:#333"></div>
            <div class="w_50">
                <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}" style="width: 100%">
                    <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center">
                        <template slot-scope="scope">
                            <span class="tableSpan">{{scope.row[item.id]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
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
                gameType:"BaijialeSuper6",
                deskShoeGameNumber:"",
                deskShoeNumber:"",
                deskNumber:""
            },
            TableData:{
                title:[{id:"drawResult",name:"开奖结果"},{id:"memberUsername",name:"洗码号"},{id:"currency",name:"货币类型"},{id:"betMoney",name:"押注总额"},{id:"allSystemProfitMoney",name:"系统输赢"},{id:"playMoney",name:"洗码量"},{id:"memberCommissionRate",name:"佣金率",subs:{id:"memberCommissionMoney",name:"佣金"}},{id:"betMoney",name:"押注&开奖"},{id:"id",name:"押注位",subs:{id:"updatedAt",name:"录入时间"}},{id:"staffNumber",name:"录入员工编号",subs:{id:"staffOperationIp",name:"录入员工IP"}}],
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
        setAllConstData(){},
        searchCli(){
            var params = {};
            Object.keys(this.formData).forEach((item)=>{
                if(this.formData[item] !== ""){
                    params[item] = this.formData[item]
                }
            })
            this.$http.post(this.$Api.supervisionOrderGetListApi,params).then(
                (res)=>{
                    if(res.data.code == 0){
                        this.TableData.value = res.data.data.list;
                        this.totalCount = res.data.data.count;
                    }
                    console.log("交易单列表",res.data.data)
                },
                (error)=>{
                    console.log(error)
                }
            )
        }
    }

}
</script>
<style scoped>
.leftTabZero{background-color:#fff;font-size:14px}
.leftTabZero td{height: 36px;line-height: 36px;border: 1px solid #EBEEF5;padding: 0 0.5rem;}
.leftTabZero>tr>td:nth-child(1){width:8rem;background-color: rgba(220,223,230,1);color:#000}
.leftTabZero table td{height: 100%;border: 0;border-right: 1px solid #EBEEF5;width: 33%;}
</style>