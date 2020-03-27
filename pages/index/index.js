//Page Object
import { request } from "../../request/index.js";
Page({
  data: {
    swiperList: [],
    catesList:[],
    foolrList:[],
    //自己添加的路径
    navigator_url:"/pages/goods_list/goods_list?query=服饰"
  },
  //options(Object)
  onLoad: function (options) {
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   method: 'GET',
    //   success: (result)=>{
    //     // console.log(result)
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFoolrList();
  },
  getSwiperList(){
    request({ url: "/home/swiperdata" })
      .then((result) => {
        this.setData({
          swiperList: result
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  getCateList(){
    request({ url: "/home/catitems" })
      .then((result) => {
        this.setData({
          catesList: result
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  getFoolrList(){
    request({ url: "/home/floordata" })
      .then((result) => {
        this.setData({
          floorList: result
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});
// "/pages/goods_list/index?query=服饰"