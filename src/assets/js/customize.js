function time_sign(){
    if(!this.diffNum){
        this.diffNum=Math.ceil((new Date().getTime()/1000)-window.serverStaticData.timestamp);
    }
    if(!this.sign){
        this.sign=localStorage.getItem("DeviceId");
    }
    this.timestamp = Math.ceil(new Date().getTime()/1000) - this.diffNum;
    return {timestamp:this.timestamp,sign:this.sign}
}
function getTimestamp(){
    return Math.ceil((new Date().getTime()/1000)-this.serverStaticData.timestamp);
}




export default { getTimestamp,time_sign }