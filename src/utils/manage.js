import { axios } from './avatar.js'
import { myAlert, fixAlert } from './alert.js'
import { utcToutc8 } from "./utc8Time.js"
import { Modal } from 'bootstrap/dist/js/bootstrap.min.js'
import serialize from "form-serialize"

// 检查登录状态
export function checkLogin() {
    const loginModal = document.querySelector('#loginModal')
    const loginM = new Modal(loginModal)
    const topBarData = JSON.parse(localStorage.getItem('topBarData'))
    console.log(topBarData)
    if (topBarData === null) {
        document.querySelector('.topBar').style.display = 'none'
        document.querySelector('.btnControlArea').style.display = 'none'
        loginM.show()
        loginWaiter(loginM)
    } else {
        document.querySelector('.waiterLoginName').innerHTML = topBarData.Limitid === 2 ? `服务员 ${topBarData.Waitername}` : '管理者/老板'
        document.querySelector('.waiterLoginName').dataset.limitId = topBarData.Limitid.toString()
        document.querySelector('.waiterLoginTel').innerHTML = topBarData.Mytel
    }
}

// 返回按钮们的归宿
export function goBackToWhere() {
    document.querySelectorAll('.goBackToIntro').forEach(item => item.addEventListener('click', () => location.href = '../intro/index.html'))
    document.querySelector('.goBackIntro').addEventListener('click', () => location.href = '../intro/index.html')
    document.querySelector('.goBackOrder').addEventListener('click', () => location.href = '../order/index.html')
}

// 修改密码 按钮
export function changePassword() {
    const wantChangePassword = document.querySelector('.wantChangePassword')
    const changePasswordModal = document.querySelector('#changePasswordModal')
    console.log(changePasswordModal)

    const changePasswordM = new Modal(changePasswordModal)
    wantChangePassword.addEventListener('click', () => {
        const Limitid = +document.querySelector('.waiterLoginName').dataset.limitId
        if (Limitid === 1) {
            myAlert(false, '如需修改密码，联系技术人员！')
        } else {
            changePasswordM.show()

            const passwordInput = changePasswordModal.querySelector('#Password')
            const confirmPasswordInput = changePasswordModal.querySelector('#confirmPassword')

            console.log(passwordInput)

            // 验证密码
            passwordInput.addEventListener('blur', () => {
                validateInput(passwordInput, value => value.length >= 8 && value.length <= 20, '', '密码长度在8到20位数字之间')
            })
            // 输入密码时清除 确认密码框 的全部样式
            passwordInput.addEventListener('focus', () => {
                confirmPasswordInput.value = ''
                const parentDiv = confirmPasswordInput.closest('.mb-3')
                const feedbackText = parentDiv.querySelector('.feedback-text')
                const icon = parentDiv.querySelector('.bi')
                if (feedbackText) feedbackText.remove()
                if (icon) icon.remove()
                confirmPasswordInput.classList.remove('is-invalid')
                confirmPasswordInput.classList.remove('is-valid')
            })
            // 验证确认密码 不能使用验证函数！
            confirmPasswordInput.addEventListener('blur', function () {
                const isMatch = confirmPasswordInput.value === passwordInput.value
                const parentDiv = confirmPasswordInput.closest('.mb-3')
                const feedbackText = parentDiv.querySelector('.feedback-text')
                const icon = parentDiv.querySelector('.bi')
                if (confirmPasswordInput.value === '' && passwordInput.value === '') {
                    confirmPasswordInput.classList.add('is-invalid')
                    if (!feedbackText) {
                        const errorText = document.createElement('div')
                        errorText.classList.add('feedback-text', 'text-danger')
                        errorText.textContent = '您未输入密码'
                        parentDiv.appendChild(errorText)
                    }
                    if (icon) icon.remove()
                } else {
                    if (isMatch) {
                        confirmPasswordInput.classList.remove('is-invalid')
                        confirmPasswordInput.classList.add('is-valid')
                        if (!icon) {
                            const validIcon = document.createElement('i')
                            validIcon.classList.add('bi', 'bi-check-circle', 'text-success')
                            parentDiv.appendChild(validIcon)
                        }
                        if (feedbackText) feedbackText.remove()
                    } else {
                        confirmPasswordInput.classList.remove('is-valid')
                        confirmPasswordInput.classList.add('is-invalid')
                        if (!feedbackText) {
                            const errorText = document.createElement('div')
                            errorText.classList.add('feedback-text', 'text-danger')
                            errorText.textContent = '两次输入密码不一致'
                            parentDiv.appendChild(errorText)
                        }
                        if (icon) icon.remove()
                    }
                }
            })

            // 提交按钮点击事件
            changePasswordModal.querySelector('.changePasswordBtn').addEventListener('click', async e => {
                e.preventDefault()

                const form = changePasswordModal.querySelector('.changePasswordForm')
                const changeData = serialize(form, { hash: true, empty: true })
                changeData.Mytel = document.querySelector('.waiterLoginTel').innerHTML
                try {
                    const response = await axios.post('/api/waiterChangePassword', changeData)
                    if (response.status === 200) {
                        myAlert(true, `${response.data.message}`)
                    } else {
                        myAlert(false, `${response.data.message}`)
                        console.log('更改失败:' + response.data.message)
                    }
                } catch (error) {
                    console.log("后端出错: " + error)
                    myAlert(false, '服务器遇到问题，请联系技术人员')
                } finally {
                    changePasswordModal.querySelector('.changePasswordForm').reset()
                    changePasswordModal.querySelectorAll('.changePasswordInput').forEach(item => {
                        const input = item.querySelector('input')
                        input.classList.remove('is-invalid', 'is-valid')
                        const styleForInput = input.nextElementSibling
                        if (styleForInput) { styleForInput.remove() }
                    })
                    changePasswordM.hide()


                }
            })
        }

    })
}

// 离职办理 按钮
export function deleteWaiter() {
    const deleteWaiterModal = document.querySelector('#deleteWaiterModal')
    const deleteWaiterM = new Modal(deleteWaiterModal)

    document.querySelector('.wantdeleteWaiter').addEventListener('click', () => {
        const Limitid = +document.querySelector('.waiterLoginName').dataset.limitId
        if (Limitid === 2) {
            myAlert(false, '注销账号请联系老板处理')
        } else {
            deleteWaiterM.show()
            const mytelInput = deleteWaiterModal.querySelector('#Mytel')
            // 验证手机号
            mytelInput.addEventListener('blur', function () {
                validateInput(mytelInput, value => /^1\d{10}$/.test(value), '', '请输入有效的11位手机号，且以1开头')
            })


            // 提交按钮点击事件
            deleteWaiterModal.querySelector('.deleteWaiterBtn').addEventListener('click', async e => {
                e.preventDefault()

                const form = deleteWaiterModal.querySelector('.deleteWaiterForm')
                const deleteData = serialize(form, { hash: true, empty: true })
                try {
                    const response = await axios.post('/api/deleteWaiter', deleteData)
                    if (response.status === 200) {
                        myAlert(true, `${response.data.message}`)
                    } else {
                        console.log(deleteData)
                        myAlert(false, `${response.data.message}`)
                        console.log('删除失败:' + response.data.message)
                    }
                } catch (error) {
                    console.log("后端出错: " + error)
                    myAlert(false, '服务器遇到问题，请联系技术人员')
                } finally {
                    deleteWaiterModal.querySelector('.deleteWaiterForm').reset()
                    deleteWaiterModal.querySelectorAll('.deleteWaiterInput').forEach(item => {
                        const input = item.querySelector('input')
                        input.classList.remove('is-invalid', 'is-valid')
                        const styleForInput = input.nextElementSibling
                        if (styleForInput) { styleForInput.remove() }
                    })
                    deleteWaiterM.hide()


                }
            })
        }
    })

}

// 修改订单状态 按钮
export function changeOrderStatus() {
    const changeOrderStatusModal = document.querySelector('#changeOrderStatusModal')
    const changeOrderStatusM = new Modal(changeOrderStatusModal)
    document.querySelector('.wantchangeOrderStatus').addEventListener('click', () => {
        changeOrderStatusM.show()
    })

    const orderidInput = changeOrderStatusModal.querySelector('#Orderid')
    const statusnameInput = changeOrderStatusModal.querySelector('#Statusname')

    // 验证 订单编号
    orderidInput.addEventListener('blur', function () {
        validateInput(orderidInput, value => /^[1-9][0-9]*$/.test(value), '', '订单编号是大于0的正整数')
    })

    // 验证 订单状态名
    statusnameInput.addEventListener('blur', function () {
        function boolsta(value) {
            switch (value) {
                case "正在制作":
                case "已支付":
                case "已完成":
                case "退款成功":
                    return true
                default:
                    return false
            }
        }
        validateInput(statusnameInput, value => boolsta(value), '', '您输入的状态名错误，请检查')
    })

    // 提交按钮点击事件
    changeOrderStatusModal.querySelector('.changeOrderStatusBtn').addEventListener('click', async e => {
        e.preventDefault()

        const form = changeOrderStatusModal.querySelector('.changeOrderStatusForm')
        const changeData = serialize(form, { hash: true, empty: true })
        try {
            const response = await axios.post('/api/changeOneOrderStatus',changeData)
            if (response.status === 200) {
                const message = response.data.message.split(' ').join(`${changeData.Orderid}`) + changeData.Statusname + '！'
                myAlert(true, `${message}`)
            } else {
                console.log(changeData)
                myAlert(false, `${response.data.message}`)
                console.log('删除失败:' + response.data.message)
            }
        } catch (error) {
            console.log("后端出错: " + error)
            myAlert(false, '服务器遇到问题，请联系技术人员')
        } finally {
            changeOrderStatusModal.querySelector('.changeOrderStatusForm').reset()
            changeOrderStatusModal.querySelectorAll('.changeOrderStatusInput').forEach(item => {
                const input = item.querySelector('input')
                input.classList.remove('is-invalid', 'is-valid')
                const styleForInput = input.nextElementSibling
                if (styleForInput) { styleForInput.remove() }
            })
            changeOrderStatusM.hide()
        }
    })
}


// 验证函数 确认密码框另外写
export function validateInput(input, validatorFn, successMessage, errorMessage) {
    const parentDiv = input.closest('.mb-3')
    const feedbackText = parentDiv.querySelector('.feedback-text')
    const icon = parentDiv.querySelector('.bi')

    if (validatorFn(input.value)) {
        input.classList.remove('is-invalid')
        input.classList.add('is-valid')
        if (!icon) {
            const validIcon = document.createElement('i')
            validIcon.classList.add('bi', 'bi-check-circle', 'text-success')
            parentDiv.appendChild(validIcon)
        }
        if (feedbackText) feedbackText.remove()
    } else {
        input.classList.remove('is-valid')
        input.classList.add('is-invalid')
        if (!feedbackText) {
            const errorText = document.createElement('div')
            errorText.classList.add('feedback-text', 'text-danger')
            errorText.textContent = errorMessage
            parentDiv.appendChild(errorText)
        }
        if (icon) icon.remove()
    }
}

// 根据 模态框 和 提交结果 渲染提示信息
export function toggleMessage(ModalBodytoWhom, isSuccess, message = '', nullFormText = '') {
    const ModalBody = document.querySelector(`.${ModalBodytoWhom}ModalBody`)
    const badWhomText = ModalBody.querySelector(`.bad-${ModalBodytoWhom}-text`)
    const successWhomText = ModalBody.querySelector(`.success-${ModalBodytoWhom}-text`)
    if (isSuccess) {
        if (badWhomText) feedbackText.remove()
        if (!successWhomText) {
            const successText = document.createElement('div')
            successText.classList.add(`success-${ModalBodytoWhom}-text`, 'text-success')
            successText.textContent = message
            ModalBody.appendChild(successText)
        }
    } else {
        if (successWhomText) successWhomText.remove()
        if (!badWhomText) {
            const errorText = document.createElement('div')
            errorText.classList.add(`bad-${ModalBodytoWhom}-text`, 'text-danger')
            errorText.textContent = nullFormText ? nullFormText : message
            ModalBody.appendChild(errorText)
            if (message) { document.querySelector(`.${ModalBodytoWhom}Form`).reset() }
        }
    }
}

// 注册模态框的机制
export function registerWaiter() {
    const registerModal = document.querySelector('#registerModal')
    console.log(registerModal)
    const waiterNameInput = registerModal.querySelector('#Waitername')
    const mytelInput = registerModal.querySelector('#Mytel')
    const passwordInput = registerModal.querySelector('#Password')
    const confirmPasswordInput = registerModal.querySelector('#correctPass')

    // 点击返回按钮，重置表单，清空样式
    registerModal.querySelector('.retrunToLoginBtn').addEventListener('click', () => {
        registerModal.querySelector('.registerForm').reset()
        registerModal.querySelectorAll('.regisInput').forEach(item => {
            const input = item.querySelector('input')
            input.classList.remove('is-invalid', 'is-valid')
            const styleForInput = input.nextElementSibling
            if (styleForInput) { styleForInput.remove() }
        })
        const messageElem = document.querySelector('.registerForm').nextElementSibling
        if (messageElem) { messageElem.remove() }
    })

    // 验证姓名
    waiterNameInput.addEventListener('blur', function () {
        validateInput(waiterNameInput, value => value.length >= 2, '', '姓名至少需要2个字')
    })

    // 验证手机号和密码
    mytelInput.addEventListener('blur', function () {
        validateInput(mytelInput, value => /^1\d{10}$/.test(value), '', '请输入有效的11位手机号，且以1开头')
    })

    passwordInput.addEventListener('blur', () => {
        validateInput(passwordInput, value => value.length >= 8 && value.length <= 20, '', '密码长度在8到20位数字之间')
    })
    // 输入密码时清除 确认密码框 的全部样式
    passwordInput.addEventListener('focus', () => {
        confirmPasswordInput.value = ''
        const parentDiv = confirmPasswordInput.closest('.mb-3')
        const feedbackText = parentDiv.querySelector('.feedback-text')
        const icon = parentDiv.querySelector('.bi')
        if (feedbackText) feedbackText.remove()
        if (icon) icon.remove()
        confirmPasswordInput.classList.remove('is-invalid')
        confirmPasswordInput.classList.remove('is-valid')
    })

    // 验证验证码
    registerModal.querySelector('#confirmCode').addEventListener('blur', function () {
        validateInput(registerModal.querySelector('#confirmCode'), value => value === '123456', '', '验证码错误')
    })

    // 验证确认密码 不能使用验证函数！
    confirmPasswordInput.addEventListener('blur', function () {
        const isMatch = confirmPasswordInput.value === passwordInput.value
        const parentDiv = confirmPasswordInput.closest('.mb-3')
        const feedbackText = parentDiv.querySelector('.feedback-text')
        const icon = parentDiv.querySelector('.bi')
        if (confirmPasswordInput.value === '' && passwordInput.value === '') {
            confirmPasswordInput.classList.add('is-invalid')
            if (!feedbackText) {
                const errorText = document.createElement('div')
                errorText.classList.add('feedback-text', 'text-danger')
                errorText.textContent = '您未输入密码'
                parentDiv.appendChild(errorText)
            }
            if (icon) icon.remove()
        } else {
            if (isMatch) {
                confirmPasswordInput.classList.remove('is-invalid')
                confirmPasswordInput.classList.add('is-valid')
                if (!icon) {
                    const validIcon = document.createElement('i')
                    validIcon.classList.add('bi', 'bi-check-circle', 'text-success')
                    parentDiv.appendChild(validIcon)
                }
                if (feedbackText) feedbackText.remove()
            } else {
                confirmPasswordInput.classList.remove('is-valid')
                confirmPasswordInput.classList.add('is-invalid')
                if (!feedbackText) {
                    const errorText = document.createElement('div')
                    errorText.classList.add('feedback-text', 'text-danger')
                    errorText.textContent = '两次输入密码不一致'
                    parentDiv.appendChild(errorText)
                }
                if (icon) icon.remove()
            }
        }
    })

    // 提交按钮点击事件
    registerModal.querySelector('.registerBtn').addEventListener('click', async e => {
        e.preventDefault() // 阻止表单默认行为

        const form = document.querySelector('.registerForm')
        console.log(form.querySelector('#Mytel').value)
        const formData = serialize(form, { hash: true, empty: true })
        console.log(formData)
        if (Object.values(formData).every(value => value === null || value === undefined || value === '')) {
            toggleMessage('register', false, '', '您还未填写数据！')
        } else {
            try {
                const response = await axios.post('/api/waiterRegister', formData)
                if (response.status === 200) {
                    toggleMessage('register', true, `${response.data.message}`)
                } else {
                    toggleMessage('register', false, `${response.data.message}`)
                    console.log('注册失败:' + response.data.message)
                }
            } catch (error) {
                console.log("后端出错: " + error)
                toggleMessage('register', false, '', '服务器遇到问题，请联系技术人员')
            }
        }
    })
}

// 登录模态框的机制
export function loginWaiter(loginM) {
    const loginModal = document.querySelector('#loginModal')
    const mytelInput = loginModal.querySelector('#Mytel')
    const passwordInput = loginModal.querySelector('#Password')

    // 验证手机号
    mytelInput.addEventListener('blur', function () {
        validateInput(mytelInput, value => /^1\d{10}$/.test(value), '', '请输入有效的11位手机号，且以1开头')
    })

    // 验证密码
    passwordInput.addEventListener('blur', () => {
        validateInput(passwordInput, value => value.length >= 8 && value.length <= 20, '', '密码长度在8到20位数字之间')
    })

    // 注册按钮点击后清除错误提示信息
    loginModal.querySelector('.wantRegisBtn').addEventListener('click', () => {
        const messageElem = document.querySelector('.loginForm').nextElementSibling
        if (messageElem) { messageElem.remove() }
    })

    // 提交按钮点击事件
    const loginBtn = loginModal.querySelector('.loginBtn')
    loginBtn.addEventListener('click', async e => {
        e.preventDefault() //阻止表单默认提交
        try {
            const response = await axios.post('/api/waiterLogin', { Mytel: mytelInput.value, Password: passwordInput.value })
            if (response.status === 200) {
                const { Mytel, Limitid, Waitername } = response.data.topBarData
                myAlert(true, `${response.data.message}`)
                localStorage.setItem('topBarData', JSON.stringify(response.data.topBarData))

                const topBar = document.querySelector('.topBar')
                const btnControlArea = document.querySelector('.btnControlArea')
                const loginName = topBar.querySelector('.waiterLoginName')
                if (topBar.style.display === 'none') {
                    topBar.style.display = 'flex'
                }
                if (btnControlArea.style.display === 'none') {
                    btnControlArea.style.display = 'block'
                }
                loginName.dataset.limitId = `${Limitid}`
                if (Limitid === 2) {
                    if (Waitername) {
                        loginName.innerHTML = `服务员 ${Waitername}`
                    } else {
                        loginName.innerHTML = '服务员'
                    }
                } else {
                    loginName.innerHTML = '管理员/老板'
                }
                topBar.querySelector('.waiterLoginTel').innerHTML = Mytel
                console.log(topBar.style.display)
                console.log(Limitid)
                console.log(loginName)
                loginM.hide()
            } else {
                toggleMessage('login', false, `${response.data.message}`)
                console.log('登录失败:' + response.data.message)
                loginModal.querySelector('.loginForm').reset()
                loginModal.querySelectorAll('.loginInput').forEach(item => {
                    const input = item.querySelector('input')
                    input.classList.remove('is-invalid', 'is-valid')
                    const styleForInput = input.nextElementSibling
                    if (styleForInput) { styleForInput.remove() }
                })
            }
        } catch (error) {
            console.log("后端出错: " + error)
            toggleMessage('login', false, '', '服务器遇到问题，请联系技术人员')
        }
    })
}