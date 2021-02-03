<template>
  <div class="commissionList t_left">
    <div class="d_iblock v_top typeBox form_box">
      <span>上级会员账号</span>
      <div class="box">
        <el-input v-model="formData.parentUsername" size="mini"
                  @input="formData.parentUsername = formData.parentUsername.toUpperCase()" clearable></el-input>
      </div>
    </div>
    <div class="d_iblock v_top typeBox form_box">
      <span>会员账号</span>
      <div class="box">
        <el-input v-model="formData.memberUsername" size="mini"
                  @input="formData.memberUsername = formData.memberUsername.toUpperCase()" clearable></el-input>
      </div>
    </div>
    <div class="d_iblock v_top typeBox form_box">
      <span>会员姓名</span>
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
    </div>
    <br>
    <div class="d_iblock v_top typeBox form_box">
      <span>操作月份</span>
      <div class="d_iblock changeWidth">
        <el-date-picker v-model="formData.month" type="month" placeholder="选择日期" size="mini"
                        value-format="yyyy-MM"></el-date-picker>
      </div>
    </div>
    <el-button type="primary" @click="searchCli" icon="el-icon-search" class="mt_01" size="mini" v-if="showSearchBtn">搜
      索
    </el-button>
    <el-button type="primary" size="mini" icon="el-icon-loading" class="mt_01" v-else>搜 索</el-button>
    <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}"
              style="width: 100%">
      <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center"
                       :width="item.id | filterWidth">
        <template slot-scope="scope">
          <span class="tableSpan">{{scope.row[item.id] === "" ? '-' : scope.row[item.id]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="t_right">
      <el-pagination background layout="sizes, total, prev, pager, next" :page-sizes="[10,15,20,25,30]"
                     :page-size="formData.rows" :total="totalCount" :current-page="pageCurr" @size-change="changeSize"
                     @current-change="changeCurr"></el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formData: {
          offset: 0,
          rows: 10,
          parentUsername: "",
          memberUsername: "",
          memberName: "",
          currency: "",
          month: "",
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
        pageCurr: 1,         //当前页
        totalCount: 0,       //总数据数
        CurrencyTypeMap: [],
        showSearchBtn: true,
        TableData: {
          title: [{id: "id", name: "ID"}, {id: "month", name: "所属月份"}, {
            id: "parentUsername",
            name: "代理账号"
          }, {id: "memberUsername", name: "会员账号"}, {id: "memberName", name: "会员姓名"}, {
            id: "beforePlayMoney",
            name: "剩余-洗码量"
          }, {id: "cashBack", name: "出粮金额"}, {id: "currency", name: "货币类型"}, {
            id: "info",
            name: "备注"
          }, {id: "staffNumber", name: "职员编号"}, {id: "staffOperationIp", name: "操作IP"}, {
            id: "createdAt",
            name: "操作时间"
          }],
          value: []
        },
        form: {rows: 1, memberUsername: "", month: ""},
        currency: "CNY"
      }
    },
    computed: {
      allConst() {
        return this.$store.state.allConst
      },
    },
    created() {
      this.setAllConstData()
    },
    mounted() {
      this.searchCli()
    },
    watch: {
      allConst() {
        this.setAllConstData()
      },
    },
    methods: {
      setAllConstData() {
        if (this.allConst.CurrencyTypeMap) {
          this.CurrencyTypeMap = Object.keys(this.allConst.CurrencyTypeMap)
        }
      },
      searchCli() {
        var params = {}
        this.showSearchBtn = false;
        Object.keys(this.formData).forEach((item) => {
          if (this.formData[item] !== "") {
            params[item] = this.formData[item]
          }
        })
        this.$http.post(this.$Api.accountMemberCommissionCommissionCashBackListApi, params).then(
          (res) => {
            this.showSearchBtn = true;
            if (res.data.code == 0) {
              this.TableData.value = res.data.data.list;
              this.totalCount = res.data.data.count;
            }
          },
          (error) => {
            this.showSearchBtn = true;
            console.log(error)
          }
        )
      },
      changeSize(i) {       //切换每页显示条数
        this.formData.rows = i;
        this.formData.offset = 0;
        this.pageCurr = 1;
        this.searchCli();
      },
      changeCurr(i) {       //换页
        this.pageCurr = i;
        this.formData.offset = (i - 1) * this.formData.rows;
        this.searchCli();
      },
      // openDialog(val){

      // },
    },
    filters: {
      showCommNum(num1, num2, str) {
        if (!isNaN(num1) && !isNaN(num2)) {
          if (str == "CNY") {
            return num1
          } else {
            return num2
          }
        }
      },
      filterWidth(str) {
        if (str == "createdAt") {
          return "160"
        } else if (str == "id") {
          return "60"
        } else {
          return "100"
        }
      }
    }
  }
</script>
<style scoped>
  .typeBox .box {
    width: 8rem;
    display: inline-block
  }

  .form_box {
    margin: 0 0.48rem 0.48rem 0;
    height: 2rem;
    line-height: 2rem
  }

  .typeBox .d_iblock.changeWidth > div {
    width: 9rem
  }

  .mt_01 {
    margin-top: 0.1rem
  }

  .w_10 {
    width: 10rem
  }

  .w_8 {
    width: 8rem
  }

  .w_50 .mounthSelect > div {
    width: 8rem
  }

  .rightForm {
    background-color: rgba(216, 216, 216, 1);
  }

  .commissionList .rightForm {
    padding-top: 14px
  }

  .mt_06 {
    margin-top: 0.6rem;
  }

  .tableSpan {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
