import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './style.css'

import 'bootstrap/dist/js/bootstrap.min.js'
import '@popperjs/core'

import { checkLogin, goBackToWhere, registerWaiter, changePassword, deleteWaiter, changeOrderStatus } from "a_src/utils/manage.js"
checkLogin()
goBackToWhere()
registerWaiter()
changePassword()
deleteWaiter()
changeOrderStatus()