import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/log/Login.vue'
// import home from '../components/boxs/home.vue'

import AddC from '../components/page/AddC.vue'
import AccCredit from '../components/page/AccCredit.vue'
import AccAlRecord from '../components/page/AccAlRecord.vue'
import CreditRecord from '../components/page/CreditRecord.vue'
import AlRecord from '../components/page/AlRecord.vue'
import Credit from '../components/page/Credit.vue'
import DeskLog from '../components/page/DeskLog.vue'
import ReduceC from '../components/page/ReduceC.vue'
import TabManage from '../components/page/TabManage.vue'    //台面管理 现场经理
import DeskShoeGame from '../components/page/DeskShoeGame.vue'  //游戏局口 现场经理
import Order from '../components/page/Order.vue'  //交易单 现场经理

import CommissionList from '../components/page/CommissionList.vue'  //账房-佣金列表
import CommissionMonthList from '../components/page/CommissionMonthList.vue'  //账房-单月佣金
import CommissionCashBackList from '../components/page/CommissionCashBackList.vue'  //账房-佣金出粮

import AccountMemberDeposit from '../components/page/AccountMemberDeposit.vue'  //账房-会员存取列表

import SupervisionOrder from '../components/page/SupervisionOrder.vue'  //交易单-列表
import SupervisionGame from '../components/page/SupervisionGame.vue'  //交易单-列表
import OrderDetails from '../components/page/OrderDetails.vue'  //交易单-修改
import Oxchange from '../components/page/Oxchange.vue'  //交易单-修改
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/login',
      name: 'Login',
      component: Login
    },{
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/AddC',
      name: 'AddC',
      component: AddC
    },{
      path: '/AccCredit',
      name: 'AccCredit',
      component: AccCredit
    },{
      path: '/AccAlRecord',
      name: 'AccAlRecord',
      component: AccAlRecord
    },{
      path: '/AlRecord',
      name: 'AlRecord',
      component: AlRecord
    },{
      path: '/Credit',
      name: 'Credit',
      component: Credit
    },{
      path: '/DeskLog',
      name: 'DeskLog',
      component: DeskLog
    },{
      path: '/ReduceC',
      name: 'ReduceC',
      component: ReduceC
    },{
      path: '/CreditRecord',
      name: 'CreditRecord',
      component: CreditRecord
    },{
      path: '/TabManage',
      name: 'TabManage',
      component: TabManage
    },{
      path: '/DeskShoeGame',
      name: 'DeskShoeGame',
      component: DeskShoeGame
    },{
      path: '/Order',
      name: 'Order',
      component: Order
    },{
      path: '/CommissionList',
      name: 'CommissionList',
      component: CommissionList
    },{
      path: '/CommissionMonthList',
      name: 'CommissionMonthList',
      component: CommissionMonthList
    },{
      path: '/CommissionCashBackList',
      name: 'CommissionCashBackList',
      component: CommissionCashBackList
    },{
      path: '/AccountMemberDeposit',
      name: 'AccountMemberDeposit',
      component: AccountMemberDeposit
    },{
      path: '/SupervisionOrder',
      name: 'SupervisionOrder',
      component: SupervisionOrder
    },{
      path: '/SupervisionGame',
      name: 'SupervisionGame',
      component: SupervisionGame
    },{
      path: '/OrderDetails',
      name: 'OrderDetails',
      component: OrderDetails
    },{
      path: '/Oxchange',
      name: 'Oxchange',
      component: Oxchange
    },
  ]
})
