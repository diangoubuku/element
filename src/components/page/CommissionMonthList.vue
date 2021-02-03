<template>
  <div class="commissionList t_left">
    <el-dialog title="佣金转出粮" :visible.sync="dialogSync" width="800px">
      <div class="d_flex">
        <el-form ref="form" :model="form" label-width="100px" class="w_50" size="mini">
          <el-form-item label="会员账号：">
            <div class="w_8">
              <el-input size="mini" width="100px" v-model="form.memberUsername" @input="getUser"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="所属月份：">
            <div class="mounthSelect">
              <el-date-picker v-model="form.month" type="month" placeholder="选择日期" size="mini" value-format="yyyy-MM"
                              @change="getMonth"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="货币类型：">
            <div class="w_8">
              <el-select v-model="currency" size="mini">
                <el-option v-for="(item,index) of CurrencyTypeMap" :value="item" :key="index"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="会员密码：">
            <div class="w_8">
              <el-input v-model="form.memberPassword" type="password" placeholder="会员密码"></el-input>
            </div>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-button type="primary">确认查询</el-button>-->
          <!--          </el-form-item>-->
        </el-form>
        <el-form ref="form" :model="dialogList" v-if="dialogList.memberName && dialogList.memberName.length>0" label-width="140px" class="rightForm" size="mini" style="width: 60%">
          <el-form-item label="会员-姓名：">
            <div class="w_8">
              <el-input :value="dialogList.memberName" size="mini" width="100px" :readonly="true"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="总洗码量：">
            <div class="w_8">
              <el-input :value="dialogList.playMoneyCny | showCommNum(dialogList.playMoneyUsd,currency)" size="mini"
                        width="100px" :readonly="true"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="已出粮-洗码量：">
            <div class="w_8">
              <el-input :value="dialogList.cashBackPlayMoneyCny | showCommNum(dialogList.cashBackPlayMoneyUsd,currency)"
                        size="mini" width="100px" :readonly="true"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="可出粮-洗码量：">
            <div class="w_8" style="display: inline-block">
              <el-input
                :value="dialogList.playMoneyCny - dialogList.cashBackPlayMoneyCny | showCommNum(dialogList.playMoneyUsd - dialogList.cashBackPlayMoneyUsd,currency)"
                size="mini" width="100px" :readonly="true"></el-input>
            </div>
            <el-button type="danger"
                       @click="playMoney=((dialogList.playMoneyCny - dialogList.cashBackPlayMoneyCny).toFixed(2)-0)">
              全部提出
            </el-button>
          </el-form-item>
          <el-form-item label="已出粮：">
            <div class="w_8">
              <el-input :value="dialogList.cashBackCny | showCommNum(dialogList.cashBackUsd,currency)" size="mini"
                        width="100px" :readonly="true"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-form ref="form" label-width="140px" size="mini" style="margin-top: 20px">
        <el-form-item label="当前兑换-洗码量：">
          <div style="display: flex">
            <div style="flex: 1">
              <el-input style="width: 120px" v-model="playMoney" size="mini"></el-input>
            </div>

            <div style="flex: 1">
              佣金率:
              <el-select style="width: 110px" v-model="memberCommissionRate" placeholder="placeholder">
                <el-option
                  v-for="(item,index) in commissionRateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>

            <div style="flex: 1.3; text-align: center">
              实际出粮金额:
              <span v-text="(memberCommissionRate*playMoney).toFixed(2) "></span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注：">
          <div>
            <el-input type="textarea" v-model="formInfo" :autosize="{ minRows: 1, maxRows: 6}"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <!-- <div class="t_center mt_06">
          <div class="d_iblock v_top typeBox form_box">
              <span>出粮金额：</span>
              <div class="box">
                  <el-input v-model="cashBack" size="mini"></el-input>
              </div>
          </div>
      </div>
      <div class="d_flex">
          <span class="t_right infoText">备注：</span>
          <el-input type="textarea" v-model="formInfo" :autosize="{ minRows: 1, maxRows: 6}"></el-input>
      </div> -->
      <div class='t_center mt_06'>
        <el-button type="primary" @click="confirmCli" size="mini">提交出粮</el-button>
        <el-button type="primary" @click="printTab" size="mini">打印</el-button>
      </div>
    </el-dialog>
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
    <el-button type="primary" size="mini" class="mt_01 f_right" @click="openDialog">用户出粮</el-button>
    <el-table :data="TableData.value" border size="mini" :header-cell-style="{background:'#DCDFE6',color:'#000'}"
              style="width: 100%">
      <el-table-column :label="item.name" v-for="(item,index) in TableData.title" :key="index" align="center">
        <template slot-scope="scope">
          <span v-if="item.id != 'opera'">{{scope.row[item.id] === "" ? '-' : scope.row[item.id]}}</span>
          <el-button type="primary" size="mini" v-if="item.id == 'opera'" @click="openDialog(scope.row)">出粮</el-button>
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
        commissionRateList: [],
        formData: {
          offset: 0,
          rows: 10,
          parentUsername: "",
          memberUsername: "",
          memberName: "",
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
            id: "playMoneyCny",
            name: "总洗码量(CNY)"
          }, {id: "cashBackPlayMoneyCny", name: "已出粮-洗码量(CNY)"}, {
            id: "cashBackCny",
            name: "已出粮(CNY)"
          }, {id: "playMoneyUsd", name: "总洗码量(USD)"}, {
            id: "cashBackPlayMoneyUsd",
            name: "已出粮-洗码量(USD)"
          }, {id: "cashBackUsd", name: "已出粮(USD)"}, {id: "opera", name: "操作"}],
          value: []
        },
        dialogSync: false,
        dialogList: {},
        form: {
          rows: 1,
          memberUsername: "",
          month: "",
          memberPassword: "",
        },
        currency: "CNY",
        playMoney: "",
        formInfo: "",
        memberCommissionRate: 0.14,
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
      // 初始化-佣金率选项
      var commissionKeys = Object.keys(allConst.MemberCommissionMap);
      var arr = []
      commissionKeys.forEach(function (key, index) {
        arr.push({
          id: key,
          name: allConst.MemberCommissionMap[key],
        })
      })
      var date = new Date();
      this.form.month = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate().toString()
      this.commissionRateList = arr
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
        Object.keys(this.formData).forEach((item) => {
          if (this.formData[item] !== "") {
            params[item] = this.formData[item]
          }
        })
        this.$http.post(this.$Api.accountMemberCommissionMonthCommissionListApi, params).then(
          (res) => {
            if (res.data.code == 0) {
              this.TableData.value = res.data.data.list;
              this.totalCount = res.data.data.count;
            }
            console.log("单月佣金", res.data)
          },
          (error) => {
            console.log(error)
          }
        )
      },
      searchOne() {
        this.$http.post(this.$Api.accountMemberCommissionMonthCommissionListApi, this.form).then(
          (res) => {
            console.log("单月佣金-个人", res.data)
            if (res.data.code == 0) {
              if (res.data.data.list.length == 0) {
                this.dialogList = {}
              } else {
                this.dialogList = res.data.data.list[0]
              }
            }
          },
          (error) => {
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
      openDialog(val) {
        if (val === undefined) {
          this.dialogList = {};
          this.form = {rows: 1, memberUsername: "", month: ""};
          this.playMoney = ""
        } else {
          this.dialogList = {...val};
          this.form.memberUsername = val.memberUsername;
          this.form.month = val.month;
          this.playMoney = ""
        }
        this.dialogSync = true;
      },
      getUser(val) {
        this.form.memberUsername = val.toUpperCase()
        if (this.form.memberUsername.length > 3 && this.form.month !== "" && this.form.month != null) {
          this.searchOne()
        }else{
          this.dialogList.memberName=''
        }
      },
      getMonth() {
        if (this.form.memberUsername.length > 3 && this.form.month !== "" && this.form.month != null) {
          this.searchOne()
        }
      },
      confirmCli() {
        var params = {
          memberId: this.dialogList.memberId,
          currency: this.currency,
          playMoney: this.playMoney,
          month: this.dialogList.month,
          memberCommissionRate: this.memberCommissionRate,
          info: ""
        };
        if (this.formInfo != "") {
          params.info = this.formInfo;
        }
        var num;
        if (this.currency == "CNY") {
          num = this.dialogList.playMoneyCny - this.dialogList.cashBackPlayMoneyCny
        } else {
          num = this.dialogList.playMoneyUsd - this.dialogList.cashBackPlayMoneyUsd
        }
        if (!this.dialogList.memberId) {
          this.$message({
            message: `会员不存在`,
            type: 'warning',
            center: true
          });
        } else if (this.playMoney <= 0 || isNaN(this.playMoney)) {
          this.$message({
            message: `请输入正确出粮金额`,
            type: 'warning',
            center: true
          });
        } else if (this.playMoney > num) {
          this.$message({
            message: `可出粮金额不足,必须<=${num}`,
            type: 'warning',
            center: true
          });
        } else {
          this.$http.post(this.$Api.accountMemberCommissionCommissionTurnCashBackApi, params).then(
            (res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: `提交成功！`,
                  type: 'success',
                  center: true
                });
                this.dialogSync = false;
                this.searchCli()
              }
            },
            (error) => {
              console.log(error)
            }
          )
        }
      },
      printTab() {
        this.$emit("printTab")
      }
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
    background-color: rgba(246, 246, 246, 1);
  }

  .commissionList .rightForm {
    padding-top: 14px
  }

  .mt_06 {
    margin-top: 0.6rem;
  }

  .infoText {
    min-width: 4rem
  }
</style>
