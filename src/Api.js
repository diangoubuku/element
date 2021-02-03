const api_auth = "/auth-server/"

const api_server = "/system-server/"


const userLoginApi = api_auth + 'Public/login';        //登陆
const logoutApi = api_auth + 'User/loginOut';        //退出
const userInfoApi = api_auth + 'User/info';        //用户信息
const userChangePasswordApi = api_auth + 'User/changePassword';        //更改密码


const baseInfo = api_server + 'Desk/baseInfo'       //台面-基本信息
const deskLogGetListApi = api_server + 'DeskLog/getList'       //加减彩-记录
const deskLogSubmitApi = api_server + 'DeskLog/submit'       //加减彩-提交
const deskCheckLogGetListApi = api_server + 'DeskCheckLog/getList'  //点码记录 前台
const deskCheckLogSubmitApi = api_server + 'DeskCheckLog/submit'       //清点-提交
const deskCheckLogDeleteApi = api_server + 'DeskCheckLog/delete'       //清点-删除
const deskCancelOpen = api_server + 'Desk/cancelOpen'       //撤销开台
const deskLogDelete = api_server + 'DeskLog/delete'       //加减彩-删除
const accountDeskLogHandlerApi = api_server + "AccountDeskLog/handler"
const orderSubmitBaijialeApi = api_server + 'Order/submitBaijiale'  //超6百家乐/龙虎提交
const orderSubmitNiuniuApi = api_server + 'Order/submitNiuniu'         //龙虎，三公，推筒子提交

const deskManagerGetListApi = api_server + 'DeskManager/getList'              //.台面列表
const deskShoeGameGetListApi = api_server + 'DeskShoeGame/getList'              //游戏局口  现场经理
const orderGetListApi = api_server + 'Order/getList'              //交易单  现场经理


const accountMemberCommissionCommissionListApi = api_server + "AccountMemberCommission/playMoneyList"        //账房-佣金列表
const accountMemberCommissionMonthCommissionListApi = api_server + "AccountMemberCommission/monthPlayMoneyList"        //账房佣金列表
const accountMemberCommissionCommissionCashBackListApi = api_server + 'AccountMemberCommission/commissionCashBackList'        //账房佣金-出粮列表
const accountMemberCommissionCommissionTurnCashBackApi = api_server + 'AccountMemberCommission/playMoneyTurnCashBack'        //单月佣金-转出粮

const accountMemberDepositGetListApi = api_server + 'AccountMemberDeposit/getList'        //账房 会员存取-列表
const accountMemberDepositPreSubmitApi = api_server + 'AccountMemberDeposit/preSubmit'           //会员-存取-预提交-信息
const accountMemberDepositSubmitApi = api_server + 'AccountMemberDeposit/submit'             //会员-存取-提交

const accountDeskLogGetListApi = api_server + 'AccountDeskLog/getList'       //账房,加减彩-记录
const accountDeskCheckLogGetListApi = api_server + 'AccountDeskCheckLog/getList'       //账房,清点-记录
const accountDeskCheckLogHandlerApi = api_server + 'AccountDeskCheckLog/handler'          //账房,清点-提交

const supervisionOrderGetListApi = api_server + 'SupervisionOrder/getList'        //交易单-列表

const supervisionGameGetListApi = api_server + 'SupervisionGame/getList'          //局口列表

const deskManagerCreateApi = api_server + 'DeskManager/create'          //台面新增
const deskManagerUpdateApi = api_server + 'DeskManager/update'          //台面修改


export default {
    userLoginApi,
    logoutApi,
    userInfoApi,
    userChangePasswordApi,

    baseInfo,
    deskLogGetListApi,
    deskLogSubmitApi,
    deskCheckLogGetListApi,
    deskCheckLogSubmitApi,
    deskCheckLogDeleteApi,
    deskCancelOpen,
    deskLogDelete,
    accountDeskLogHandlerApi,
    orderSubmitBaijialeApi,
    orderSubmitNiuniuApi,

    deskManagerGetListApi,
    deskShoeGameGetListApi,
    orderGetListApi,

    accountMemberCommissionCommissionListApi,
    accountMemberCommissionMonthCommissionListApi,
    accountMemberCommissionCommissionCashBackListApi,
    accountMemberCommissionCommissionTurnCashBackApi,

    accountMemberDepositGetListApi,
    accountMemberDepositPreSubmitApi,
    accountMemberDepositSubmitApi,

    accountDeskLogGetListApi,
    accountDeskCheckLogGetListApi,
    accountDeskCheckLogHandlerApi,

    supervisionOrderGetListApi,
    supervisionGameGetListApi,

    deskManagerCreateApi,
    deskManagerUpdateApi
}

