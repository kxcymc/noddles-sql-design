import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './phone.css'
import './style.css'

import 'bootstrap/dist/js/bootstrap.min.js'
import '@popperjs/core'
import intro from 'a_src/utils/intro.js'
const { navbar, avatarimg, loginUser, 
  fixAlert, getAvatar, } = intro

if (process.env.NODE_ENV === 'production') {
    console.log = function() {}
  }
console.log('开发模式，可以使用控制台打印')

// 处理引入的 intro.js
import addicon from "./assets/addicon.jpg"
document.querySelector('.addicon').src = addicon
import logo from "a_src/intro/assets/logo.jpg";
document.querySelector('#logo').querySelector('img').src = logo
navbar()
fixAlert()
avatarimg()
loginUser()
document.addEventListener('DOMContentLoaded', getAvatar)