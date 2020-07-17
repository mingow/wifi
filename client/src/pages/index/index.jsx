import Taro, { Component } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import { AtButton,AtModal } from 'taro-ui'
import './index.scss'

import Login from '../../components/login/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: 'WiFi一键连',
    backgroundColor:'#0b091e',
    backgroundColorTop:'#161540',
    navigationBarBackgroundColor: "#0b091e",
    navigationBarTextStyle: "white"
  }

  constructor (props) {
    super(props)
    this.state = {
      SSID:'homie欢乐轰趴',
      PWD:'19926696315',
      connection: false,

    }
  }

  connectWifi() {
    var that = this;
    //检测手机型号
    wx.getSystemInfo({
      success: function (res) {
        var system = '';
        if (res.platform == 'android') system = parseInt(res.system.substr(8));
        if (res.platform == 'ios') system = parseInt(res.system.substr(4));
        if (res.platform == 'android' && system < 6) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        if (res.platform == 'ios' && system < 11.2) {
          wx.showToast({
            title: '手机版本不支持',
          })
          return
        }
        //2.初始化 Wi-Fi 模块
        that.startWifi();
      }
    })
  }
  //初始化 Wi-Fi 模块
  startWifi() {
    if(this.state.connection){
      return;
    }
    var that = this
    wx.startWifi({
      success: function () {
        //请求成功连接Wifi
        that.Connected();
      },
      fail: function (res) {
          wx.showToast({
            title: '接口调用失败',
          })
      }
    })
  }

  Connected() {
    var that = this
    wx.showLoading({
      title: '连接Wi-Fi中...',
    })
    wx.connectWifi({
      SSID: that.state.SSID,
      BSSID: '',
      password: that.state.PWD,
      success: function (res) {
        var timeOut = setTimeout(function(){
          wx.hideLoading();
          wx.getConnectedWifi({
            success (res) {
              if(res.wifi.SSID==that.state.SSID){
                that.setState({
                  connection:true
                })
                wx.showToast({
                  title: 'wifi已连接',
                })
              }else{
                that.setState({
                  connection:false
                })
                wx.showToast({
                  title: 'wifi连接失败',
                })
              }
            },
            fail (res) {
              that.setState({
                connection:false
              })
              wx.showToast({
                title: 'wifi连接失败',
              })
            }
          })
        },2000)
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: 'wifi连接失败',
        })
      }
    })
  }

  clip() {
    var that = this
    wx.setClipboardData({
      data: that.state.PWD,
      success (res) {
        wx.showToast({
          title: '密码复制成功',
        })
      }
    })
  }

  componentWillMount () { }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
    var own = this;
    //判断是否已经连接wifi
    wx.getConnectedWifi({
      success (res) {
        if(res.wifi.SSID==own.state.SSID){
          own.setState({
            connection:true
          })
        }else{
          own.setState({
            connection:false
          })
        }
      },
      fail (res) {
        own.setState({
          connection:false
        })
      }
    })

  }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className="bg">
          <View className="content">
              <View className="one"><View className="p"></View></View>
          </View>
        </View>
        <View className='top'>
          <Image className='pic' src='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/logo.jpg' />
          <View className='group'>
            <View className="circle"></View>
            <View className="circle a1"></View>
            <View className="circle a2"></View>
            <View className="shadow"></View>
          </View>
        </View>


        <View className='center'>
          <View className='button' style={{backgroundColor:this.state.connection?'#41e086':'#478dff'}} onClick={this.connectWifi.bind(this)}>
            <Text className='text' >{this.state.connection?'已连接':'连接'}</Text>
          </View>


        </View>
        <View className='grid'>
          <Text>点击上方按钮连接Wi-Fi</Text>
          <Text className='p'>如有任何问题，请联系管家处理，谢谢！</Text>
          <Text className='p'>SSID:{this.state.SSID}</Text>
          <Text className='p'>PWD:{this.state.PWD}</Text>
          <AtButton className='btn' type='primary' onClick={this.clip.bind(this)}>点击复制WiFi密码</AtButton>
        </View>

      </View>
    )
  }
}
