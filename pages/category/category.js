// pages/category/category.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  Cates: [],
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    //从本地存储中获取数据
    const Cates = wx.getStorageSync("cates");
    //判断
    if (!Cates) {
      //不存在 发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据  定义过期时间  
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates();
      } else {
        //可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //原来写法
  //getCates(){
  // request({

  //   url:'/categories'

  // }).then(result => {
  //   // console.log(result)
  //   this.Cates = result;

  //   //把接口的数据存储到本地存储中
  //   wx.setStorageSync("cates", {time: Date.now(),data:this.Cates});

  //   let leftMenuList = this.Cates.map(v => v.cat_name);
  //   let rightContent = this.Cates[0].children;

  //   this.setData({
  //     leftMenuList,
  //     rightContent
  //   })
  // }).catch(err => {

  // })
  //},

  //es7写法
  async getCates() {
    const res = await request({ url: '/categories' });
    this.Cates = res;
    //把接口的数据存储到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent
    })
  },
  handleItemTap(e) {
    // console.log(e)
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})