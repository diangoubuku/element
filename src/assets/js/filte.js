function getWinner(Zobj,Xobj,pukeArr){
    var Zresult = Zobj.result;
    var ZNiuniu5xiaoniuSum = Zobj.Niuniu5xiaoniuSum;
    var ZmaxOne = Zobj.maxOne.split(",");
    var Xresult = Xobj.result;
    var XNiuniu5xiaoniuSum = Xobj.Niuniu5xiaoniuSum;
    var XmaxOne = Xobj.maxOne.split(",");
    var pukeNumArr = ["K","Q","J","10","9","8","7","6","5","4","3","2","A"];
    var nultNum = {"5小牛":40000,"炸弹":30000,"5花牛":20000,"牛牛":10000,"牛9":9000,"牛8":8000,"牛7":7000,"牛6":6000,"牛5":5000,"牛4":4000,"牛3":3000,"牛2":2000,"牛1":1000,"无牛":100}
    var Znum;
    var Xnum;
    Znum = nultNum[Zresult] + Number(ZNiuniu5xiaoniuSum) + (pukeNumArr.indexOf(ZmaxOne[0]) + 1) * 10 + pukeArr.indexOf(ZmaxOne[1]);
    Xnum = nultNum[Xresult] + Number(XNiuniu5xiaoniuSum) + (pukeNumArr.indexOf(XmaxOne[0]) + 1) * 10 + pukeArr.indexOf(XmaxOne[1]);
    if(Xnum > Znum){
        return true
    }else{
        return false
    }
}

export default { getWinner }