import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './style.css'

import 'bootstrap/dist/js/bootstrap.min.js'
import '@popperjs/core'

import order from 'a_src/utils/order.js'
const {getMenuFromServer, getOrderListFromServer,
    buttonOkClear, getAvatar, fixAlert, } = order
buttonOkClear()
fixAlert()
getMenuFromServer()
document.addEventListener('DOMContentLoaded', () => getAvatar().then(Mytel =>{
    getOrderListFromServer(Mytel)
}))
