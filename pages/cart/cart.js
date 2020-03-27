import { getSetting, openSetting, chooseAddress, showModal,showToast } from "../../utils/asyncWx";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0

  },
  async handleChooseAddress() {
    //1 获取 权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     // 2 获取权限状态 主要发现一些 属性名很怪异的时候 都要使用[]
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         }
    //       });
    //     }else{
    //       //3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           //4 可以调用 收获地址代码
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //               console.log(result3)
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });
    try {
      //1. 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      //4 调用获取收获地的api
      const address = await chooseAddress();
      // console.log(res2);
      //5 存入到缓存中
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    //1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    // const allChecked = cart.length?cart.every(v=>v.checked):false;
    // let allChecked = true;
    // //1 总价格 总数量
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v=>{
    //   if(v.checked){
    //     totalPrice += v.num * v.goods_price;
    //     totalNum+=v.num;
    //   }else{
    //     allChecked = false;
    //   }
    // })
    // //判断数组是否为空
    // allChecked = cart.length != 0?allChecked:false
    // //2 给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    this.setData({ address });
    this.setCart(cart);
  },
  //商品的选中
  handleItemChange(e) {
    //1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //2 获取购物车数组
    let { cart } = this.data;
    //3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //4选中状态取反
    cart[index].checked = !cart[index].checked;
    //5 6 把购物车数据重新设置data中和缓存中
    this.setCart(cart)

  },
  //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 数量
  setCart(cart) {
    let allChecked = true;
    //1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart, totalPrice, totalNum, allChecked
    });
    wx.setStorageSync("cart", cart);
  },
  //商品全选功能
  handleItemAllCheck() {
    //1 获取data中的数据
    let { cart, allChecked } = this.data;
    //2 修改值
    allChecked = !allChecked;
    //3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    //把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  //商品数量的编辑功能
  async handleItemNumEdit(e) {
    //1 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    //2 获取购物车数组
    let { cart } = this.data;
    //3 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    //4 判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      //4.1 弹窗提示
      // wx.showModal({
      //   title: '提示',
      //   content: '您是否要删除?',
      //   success: (result) => {
      //     if (result.confirm) {
      //       cart.splice(index, 1);
      //       this.setCart(cart);
      //     } else if (result.cancel) {
      //       console.log('用户点击取消');
      //     }
      //   }
      // });
      const result = await showModal({ content: "您是否要删除?" });
      if (result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      //4 进行修改数量
      cart[index].num += operation;
      //5 设置回缓存的data中
      this.setCart(cart);
    }

  },
  //点击结算
  async handlePay(){
    //1判断收获地址
    const {address,totalNum} = this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收获地址"});
      return;
    }
    //2 判断用户有没有选购商品
    if(totalNum === 0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //3跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    });
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