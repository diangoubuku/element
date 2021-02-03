<template>
    <div class="loading h_100 w_100 p_absolute">
        <div class="box_auto t_center">
            <span class="mr_046">{{baseInfo.lockInfo}}</span>
            <el-button size="mini" @click="routeTab('desklog')" v-if="baseInfo.lockAct.name == 'OpenDesk' && baseInfo.lockAct.needSubmit == 'HaveNot'">开盘</el-button>
            <el-button size="mini" @click="routeTab('desklog')" v-else-if="baseInfo.lockAct.name == 'OpenDesk' && baseInfo.lockAct.needSubmit != 'Complete'">待补充开盘【{{baseInfo.lockAct.needSubmit}}】</el-button>
            <el-button size="mini" @click="routeTab('credit')" v-else-if="baseInfo.lockAct.name == 'FinalCheck' && baseInfo.lockAct.needSubmit != 'Complete'">待补充收盘【{{baseInfo.lockAct.needSubmit}}】</el-button>
        </div>
    </div>
</template>
<script>
export default {
    props:["baseInfo"],
    data(){
        return{

        }
    },
    methods:{
        routeTab(val){
            this.$emit("routeTab",val)
        }
    }
}
</script>
<style scoped>
.loading{background-color:rgba(33,33,33,0.8);z-index:100;font-size:14px}
.loading .box_auto{background-color:#fff;display:inline-block;width:50%;height:2.6rem;line-height:2.6rem}
.mr_046{margin-right:0.46rem}
</style>