let app = getApp();

//线上域名
let domain = "http://dingding.xinshuiguanjia.com";
//替换成开发者后台设置的安全域名
//let domain = "http://192.168.2.83:8080";
let url = domain + '/login';
let url_annual = domain + '/getAnnualLeave';
let url_getAllUser = domain + '/getAllUserList';
let url_getUser = domain + '/getUser';

Page({
    data:{
      corpId: '',
      authCode:'',
      userId:'',
      userName:'',
      confirmJoinTime:'',
      joinWorkingTime:'',
      days:'',
      daysLastYear: '',
      fastDays:'',
      hideList: true,
      lastName: '',
      selectPerson:true,
      firstPerson:'个人',
      selectArea:false,
      hidePick:true,
      objectArray: [
        
      ],
      arrIndex: 0,
      index: 0,
      selectDays:''
    },
    bindObjPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value);
      console.log('userid', this.data.objectArray[e.detail.value].userId);
      this.setData({
        arrIndex: e.detail.value,
      });
      dd.httpRequest({
        url: url_getUser,
        method: 'GET',
        data: {
          userId:this.data.objectArray[e.detail.value].userId
        },
        dataType: 'json',
        success: (res) => {
            // dd.alert({content: "step2"});
            console.log('success----',res)
            let selectDays = res.data.error.days  + res.data.error.daysLastYear;
            this.setData({
                selectDays:selectDays+'天'
            })
        },
        fail: (res) => {
            console.log("httpRequestFail---",res)
            dd.alert({content: JSON.stringify(res)});
        },
        complete: (res) => {
            dd.hideLoading();
        }
      });
    },
    onLoad(){
      let _this = this;
      this.setData({
          corpId: app.globalData.corpId
      })
      dd.httpRequest({
          url: url_getAllUser,
          method: 'GET',
          data: {
    
          },
          dataType: 'json',
          success: (res) => {
              console.log('success----',res)
              let objectArray = res.data.error;
              this.setData({
                  objectArray:objectArray
              })
          },
          fail: (res) => {
              console.log("httpRequestFail---",res)
              dd.alert({content: JSON.stringify(res)});
          },
          complete: (res) => {
              dd.hideLoading();
          }
          
      });

      dd.showLoading();
      dd.getAuthCode({
          success:(res)=>{
              dd.httpRequest({
                  url: url_annual,
                  method: 'GET',
                  data: {
                      authCode: res.authCode
                  },
                  dataType: 'json',
                  success: (res) => {
                      console.log('success----',res)
                      let userName = res.data.error.userName;
                      let confirmJoinTime = res.data.error.confirmJoinTime;
                      let joinWorkingTime = res.data.error.joinWorkingTime;
                      let days = res.data.error.days;
                      let daysLastYear = res.data.error.daysLastYear;
                      let lastName = res.data.error.lastName;
                      let isAdmin = res.data.error.isAdmin;
                      let hidePick = true;
                      console.log("hidePick---",hidePick)
                      if(isAdmin){
                        hidePick = false;
                      }
                      
                      this.setData({
                          userName:userName,
                          confirmJoinTime:confirmJoinTime,
                          joinWorkingTime:joinWorkingTime,
                          days:days,
                          daysLastYear:daysLastYear,
                          hideList:false,
                          lastName:lastName,
                          hidePick:hidePick
                          
                      })
                      console.log("hidePick---",this.data.hidePick)
                  },
                  fail: (res) => {
                      console.log("httpRequestFail---",res)
                      dd.alert({content: res.data.message});
                  },
                  complete: (res) => {
                      dd.hideLoading();
                  }
                  
              });
          },
          fail: (err)=>{
              // dd.alert({content: "step3"});
              dd.alert({
                  content: JSON.stringify(err)
              })
          }
      })
    }
})