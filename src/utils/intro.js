import { openAvatarImageDb, storeAvatar, getAvatar, axios } from './avatar.js'
import { myAlert, fixAlert } from './alert.js'

// 处理导航栏
function navbar() {
    const head = document.querySelector('#navbar')
    // 阻止a标签默认跳转
    head.querySelector('.aneedtoprevent').addEventListener("click", e => e.preventDefault())
    const distance = document.querySelector('#services-container').offsetHeight
    window.addEventListener('scroll', function (e) {
        if (this.scrollY >= distance) {
            head.style.top = 0
            console.log(111111111)
        }
        else {
            head.style.top = '-100px'
        }
    })
}

// 我要登录
function loginUser() {
    const avatar = document.querySelector('.avatarPre')
    const Mytel = document.querySelector('#Mytel')
    function styleRecover(isSuccess) {
        if (isSuccess && avatar.src) {
            document.querySelector('.myAvatar').src = avatar.src
            storeAvatar(avatar.src, Mytel.value)
        }
        avatar.style.display = 'none'
        document.querySelector('.addicon').style.display = 'inline'
        avatar.src = ''
        Mytel.classList.remove('is-valid', 'is-invalid')
        const styleForMytel = Mytel.nextElementSibling
        if (styleForMytel) { styleForMytel.remove() }
        Mytel.value = ''
        document.querySelector('.uploadAvatar').style.top = '160px'
        document.querySelector('.imgmb-3').style.height = '224px'
    }

    function validateInput(input, validatorFn, successMessage, errorMessage) {
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

    // 验证手机号
    Mytel.addEventListener('blur', function () {
        validateInput(Mytel, value => /^1\d{10}$/.test(value), '', '请输入有效的11位手机号，且以1开头')
    })



    // 确认按钮 提交信息
    document.getElementById('confirmBtn').addEventListener('click', async e => {
        e.stopPropagation()
        console.log('手机号:', Mytel.value)

        // 发送数据到后端，使用 axios 
        try {
            const response = await axios.post('/api/saveUsertel', {
                //  Myte.value 是手机号， Limitid 是用户身份
                Mytel: Mytel.value,
                Limitid: 3
            })
            if (response.status === 200) {
                myAlert(true, `${response.data.message}`)
                // 把名字和头像贴到右上角去
                document.querySelector('.username').innerHTML = Mytel.value
                styleRecover(true)
                console.log(response.data.message)
            } else {
                myAlert(false, `${response.data.message}!`)
                styleRecover(false)
                console.log('出现错误:', response.data.message)
            }
        } catch (error) {
            myAlert(false, `${error.response.data.message}!`)
            styleRecover(false)
            console.log('后端错误:', error)
        }
    })
}

// 处理图片上传
function avatarimg() {

    const avatar = document.querySelector('.avatarPre')

    // 创建 MutationObserver 实例，监听 src 属性变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                console.log('src 属性已更改:', avatar.src)
            }
        }
    })

    // 配置观察的选项
    const config = { attributes: true }

    // 启动观察
    observer.observe(avatar, config)


    // 文件选择事件
    document.getElementById('imgInput').addEventListener('change', async function (event) {
        const file = event.target.files[0]
        if (avatar) { avatar.src = '' }
        const imgsrc = await readFile(file)
        avatar.src = imgsrc
        avatar.style.display = 'inline'
        document.querySelector('.addicon').style.display = 'none'
        document.querySelector('.uploadAvatar').style.top = '310px'
        document.querySelector('.imgmb-3').style.height = '374px'
    })

    // 点击上传头像按钮触发文件选择
    const uploadAvatar = document.querySelector('.uploadAvatar')
    uploadAvatar.addEventListener('click', () => document.querySelector('input[id="imgInput"]').click())

    // 拖拽事件
    const imgdrop = document.querySelector('#imgdrop-area')
    imgdrop.addEventListener('dragover', e => e.preventDefault())
    imgdrop.addEventListener('drop', async (event) => {
        event.preventDefault()
        const files = event.dataTransfer.files
        if (files.length > 0) {
            const file = files[0]
            if (avatar.src) { avatar.src = '' }
            const imgsrc = await readFile(file)
            avatar.src = imgsrc
            avatar.style.display = 'inline'
            document.querySelector('.addicon').style.display = 'none'
            document.querySelector('.uploadAvatar').style.top = '310px'
            document.querySelector('.imgmb-3').style.height = '374px'
        }
    })

    // 文件读取的异步函数
    function readFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                // 如果没有提供文件，直接返回reject
                reject(new Error("No file uploaded"))
            }
            const reader = new FileReader()
            reader.onload = function (e) {
                resolve(e.target.result)
            }
            reader.onerror = function (e) {
                reject(e)
            }
            reader.readAsDataURL(file)
        })
    }
}

export default {
    navbar,
    avatarimg,
    loginUser,
    axios,
    myAlert,
    fixAlert,
    openAvatarImageDb,
    storeAvatar,
    getAvatar
}