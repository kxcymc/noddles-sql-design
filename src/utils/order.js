import { openAvatarImageDb, storeAvatar, getAvatar, axios } from './avatar.js'
import { myAlert, fixAlert } from './alert.js'
import { utcToutc8 } from "./utc8Time.js"
import { Modal } from 'bootstrap/dist/js/bootstrap.min.js'

// ！！！前端的订单管理模块的功能缺失：
// 分页、筛选、跳页
// 不要使用data-bs来管理模态框，返回界面的按钮改一下
//   /**
//    * 目标2：筛选文章列表
//    *  2.1 设置频道列表数据
//    *  2.2 监听筛选条件改变，保存查询信息到查询参数对象
//    *  2.3 点击筛选时，传递查询参数对象到服务器
//    *  2.4 获取匹配数据，覆盖到页面展示
//    */
//   // 2.1 设置频道列表数据
//   async function setChannleList() {
//     const res = await axios({
//       url: '/v1_0/channels'
//     })
//     const htmlStr = `<option value="" selected="">请选择文章频道</option>` + res.data.channels.map(item => `<option value="${item.id}">${item.name}</option>`).join('')
//     document.querySelector('.form-select').innerHTML = htmlStr
//   }
//   setChannleList()
//   // 2.2 监听筛选条件改变，保存查询信息到查询参数对象
//   // 筛选状态标记数字->change事件->绑定到查询参数对象上
//   document.querySelectorAll('.form-check-input').forEach(radio => {
//     radio.addEventListener('change', e => {
//       queryObj.status = e.target.value
//     })
//   })
//   // 筛选频道 id -> change事件 -> 绑定到查询参数对象上
//   document.querySelector('.form-select').addEventListener('change', e => {
//     queryObj.channel_id = e.target.value
//   })
//   // 2.3 点击筛选时，传递查询参数对象到服务器
//   document.querySelector('.sel-btn').addEventListener('click', () => {
//     // 2.4 获取匹配数据，覆盖到页面展示
//     setArtileList()
//   })
//   /**
//    * 目标3：分页功能
//    *  3.1 保存并设置文章总条数
//    *  3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
//    *  3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
//    */
//   // 3.2 点击下一页，做临界值判断，并切换页码参数并请求最新数据
//   document.querySelector('.next').addEventListener('click', e => {
//     // 当前页码小于最大页码数
//     if (queryObj.page < Math.ceil(totalCount / queryObj.per_page)) {
//       queryObj.page++
//       document.querySelector('.page-now').innerHTML = `第 ${queryObj.page} 页`
//       setArtileList()
//     }
//   })
//   // 3.3 点击上一页，做临界值判断，并切换页码参数并请求最新数据
//   document.querySelector('.last').addEventListener('click', e => {
//     // 大于 1 的时候，才能翻到上一页
//     if (queryObj.page > 1) {
//       queryObj.page--
//       document.querySelector('.page-now').innerHTML = `第 ${queryObj.page} 页`
//       setArtileList()
//     }
//   })
//   /**
//    * 目标4：删除功能
//    *  4.1 关联文章 id 到删除图标
//    *  4.2 点击删除时，获取文章 id
//    *  4.3 调用删除接口，传递文章 id 到服务器
//    *  4.4 重新获取文章列表，并覆盖展示
//    *  4.5 删除最后一页的最后一条，需要自动向前翻页
//    */
//   // 4.2 点击删除时，获取文章 id
//   document.querySelector('.art-list').addEventListener('click', async e => {
//     // 判断点击的是删除元素
//     if (e.target.classList.contains('del')) {
//       const delId = e.target.parentNode.dataset.id
//       // 4.3 调用删除接口，传递文章 id 到服务器
//       const res = await axios({
//         url: `/v1_0/mp/articles/${delId}`,
//         method: 'DELETE'
//       })
//       // 4.5 删除最后一页的最后一条，需要自动向前翻页
//       const children = document.querySelector('.art-list').children
//       if (children.length === 1 && queryObj.page !== 1) {
//         queryObj.page--
//         document.querySelector('.page-now').innerHTML = `第 ${queryObj.page} 页`
//       }
//       // 4.4 重新获取文章列表，并覆盖展示
//       setArtileList()
//     }
//   })
//   // 点击编辑时，获取文章 id，跳转到发布文章页面传递文章 id 过去
//   document.querySelector('.art-list').addEventListener('click', e => {
//     if (e.target.classList.contains('edit')) {
//       const artId = e.target.parentNode.dataset.id
//       console.log(artId)
//       location.href = `../publish/index.html?id=${artId}`
//     }
//   })


// 神的导航栏
function navbar() {
    const head = document.querySelector('#navbar')
    // 阻止a标签默认跳转
    head.querySelector('.aneedtoprevent').addEventListener("click", e => e.preventDefault())

    const rdis = document.querySelector('.stapleFood').offsetHeight - document.querySelector('.toppings').offsetHeight
    const ldis = document.querySelector('.stapleFood').offsetHeight + document.querySelector('.toppings').offsetHeight - document.querySelector('#orderformSection').offsetHeight
    console.log(ldis)
    console.log(rdis)
    window.addEventListener('scroll', function (e) {
        if (this.scrollY >= rdis && this.scrollY < ldis) {
            head.style.left = 'auto'
            head.style.right = '0'
        }
        else {
            head.style.left = '0'
            head.style.right = 'auto'
        }
    })
}

// 每道菜品的 加减号 和 输入数字 控件
function buttonAddSubtract() {
    // 获取所有带有 .count 类的元素
    const countElements = document.querySelectorAll('.count')

    countElements.forEach(function (countElement) {
        const inputElement = countElement.parentElement.querySelector('#input-number')
        const btnAdd = countElement.parentElement.querySelector('#btn-add')
        const btnSubtract = countElement.parentElement.querySelector('#btn-subtract')
        const remainElem = countElement.parentElement.querySelector('.remain')
        const remainNum = parseInt(remainElem.textContent.slice(4))

        btnAdd.addEventListener('click', function () {
            let currentCount = parseInt(countElement.textContent.slice(1))
            currentCount++
            if (currentCount >= 0) {
                countElement.textContent = `x${currentCount}`
                inputElement.value = currentCount
                remainElem.textContent = `剩余: ${remainNum - currentCount}`
            } else {
                countElement.textContent = "x0"
                inputElement.value = 0
                remainElem.textContent = `剩余: ${remainNum}`
            }
        })

        btnSubtract.addEventListener('click', function () {
            let currentCount = parseInt(countElement.textContent.slice(1))
            currentCount--
            if (currentCount >= 0) {
                countElement.textContent = `x${currentCount}`
                inputElement.value = currentCount
                remainElem.textContent = `剩余: ${remainNum - currentCount}`
            } else {
                countElement.textContent = "x0"
                inputElement.value = 0
                remainElem.textContent = `剩余: ${remainNum}`
            }
        })

        inputElement.addEventListener('blur', function () {
            let inputValue = parseInt(inputElement.value)
            if (inputValue >= 0) {
                countElement.textContent = `x${inputValue}`
                remainElem.textContent = `剩余: ${remainNum - inputValue}`
            } else {
                inputElement.value = parseInt(countElement.textContent.slice(1))
                remainElem.textContent = `剩余: ${remainNum}`
            }
        })
    })
}

// 先渲染主框架，再渲染配件
// 从服务器端获取菜单并渲染到页面上
// 获取之后调用 navbar 和 buttonAddSubtract
function getMenuFromServer() {
    axios.post('/api/getFoodMenu')
        .then(response => {
            const data = response.data

            const dishesContainer = document.querySelector('.stapleFood')
            const appetizerContainer = document.querySelector('.toppings')

            const imgArr = []
            for (let i = 1; i < data.length + 1; i++) {
                imgArr.push(require(`a_src/order/assets/foodImage/${i}.jpg`))
            }

            data.forEach((item, index) => {
                const div = document.createElement('div')
                div.dataset.foodId = item.Foodid
                div.classList.add(item.Cateid === 1 ? 'dishes' : 'appetizer')

                // Create and append the elements
                div.innerHTML = `
                <img src=${imgArr[index]} alt="sorry">
                <h2 class="name">${item.Food}</h2>
                <p class="remain">剩余: ${item.Remain}</p>
                <p class="price">¥${item.Price}</p>
                <p class="count">x0</p>
                <p class="btnandinput">
                  <button class="normalbtn btn btn-sm rounded-circle" id="btn-subtract">
                    <i class="bi bi-dash" style="font-size: 24px"></i>
                  </button>
                  <input type="number" id="input-number" class="form-control form-control-sm" value="0">
                  <button class="normalbtn btn btn-sm rounded-circle" id="btn-add">
                    <i class="bi bi-plus" style="font-size: 24px"></i>
                  </button>
                </p>
              `
                item.Cateid === 1 ? dishesContainer.appendChild(div) : appetizerContainer.appendChild(div)
            })
            navbar()
            buttonAddSubtract()
        })
        .catch(error => {
            console.error("获取菜单数据出现错误:", error)
        })
}

// 清空已点菜品
function clearSelectedFood(orderflag) {
    const countElements = document.querySelectorAll('.count')
    countElements.forEach(elem => {
        const remain = elem.parentElement.querySelector('.remain')
        if (orderflag !== true) {
            remain.textContent = `剩余: ${parseInt(remain.textContent.slice(4)) + parseInt(elem.textContent.slice(1))}`
        }
        elem.textContent = 'x0'
        elem.parentElement.querySelector("#input-number").value = 0
    })
}

// 订单管理的我要退款功能
function needToRefund() {
    const refundModal = document.querySelector('#refundModal')
    const refund = new Modal(refundModal)
    const wantRefundBtn = refundModal.querySelector('.wantRefundBtn')
    document.querySelectorAll('.orderManageClick').forEach(item => {
        item.addEventListener('click', e => {
            if (e.target.classList.contains('bi-x-circle') || e.target.classList.contains('bi-cash-coin')) {
                const Orderid = +item.querySelector('.orderId').innerHTML
                refund.show()
                console.log(Orderid)
                wantRefundBtn.addEventListener('click', async () => {
                    try {
                        const response = await axios.post('/api/userRefundOneOrder', { Orderid })
                        if (response.status === 200) {
                            const orderStatus = item.querySelector('.orderStatus')
                            orderStatus.dataset.statusId = '4'
                            orderStatus.innerHTML = '<span class="badge text-bg-warning">退款成功</span>'
                            refund.hide()
                            myAlert(true, `${response.data.message}`)
                        } else {
                            myAlert(false, `${response.data.message}`)
                            console.log('退款失败:' + response.data.message)
                        }
                    } catch (error) {
                        console.log('后端错误:' + error)
                    }
                })
            }
        })
    })
}

// 订单管理的删除订单功能
function wantDeleteOrder() {
    const deleteOrderModal = document.querySelector('#deleteOrderModal')
    const deleteOrder = new Modal(deleteOrderModal)
    const deleteOrderBtn = deleteOrderModal.querySelector('.deleteOrderBtn')
    document.querySelectorAll('.orderManageClick').forEach(item => {
        item.addEventListener('click', e => {
            if (e.target.classList.contains('bi-trash3') || e.target.classList.contains('bi-exclamation-triangle')) {
                switch (item.querySelector('.orderStatus').dataset.statusId) {
                    case '1':
                    case '2':
                        myAlert(false, '尚未 完成/退款 的订单无法删除!')
                        return
                }
                const Orderid = +item.querySelector('.orderId').innerHTML
                deleteOrder.show()
                console.log(Orderid)
                deleteOrderBtn.addEventListener('click', async () => {
                    try {
                        const response = await axios.post('/api/userUnvisitOneOrder', { Orderid })
                        if (response.status === 200) {
                            item.remove()
                            deleteOrder.hide()
                            myAlert(true, `${response.data.message}`)
                        } else {
                            myAlert(false, `${response.data.message}`)
                            console.log('删除失败:' + response.data.message)
                        }
                    } catch (error) {
                        console.log('后端错误:' + error)
                    }
                })
            }
        })
    })
}

// 根据传入的数组渲染订单管理模块
function renderOrderManageDiv(manageDIVData) {
    const totalOrderCount = manageDIVData.length
    // if (totalOrderCount===0) return
    document.querySelector('.totalOrder-count').innerHTML = `共 ${totalOrderCount} 单`

    // const manageDIVData = [{ Foodpicture, Orderid, Statusid, Ordertime, Totalprice }]
    document.querySelector('.orderList').innerHTML = manageDIVData.map(item => {
        let str = ''
        let statusid = ''
        switch (item.Statusid) {
            case 1:
                str = '<span class="badge text-bg-primary">已支付</span>'
                statusid = 1
                break
            case 2:
                str = '<span class="badge text-bg-secondary">正在制作</span>'
                statusid = 2
                break
            case 3:
                str = '<span class="badge text-bg-success">已完成</span>'
                statusid = 3
                break
            case 4:
                str = '<span class="badge text-bg-warning">退款成功</span>'
                statusid = 4
                break
        }
        return `<tr class="orderManageClick">
    <td>
      <img src="${item.Foodpicture !== '' ? item.Foodpicture : `https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500`}" alt="无法加载图片">
    </td>
    <td class='orderId'>${item.Orderid}</td>
    <td class='orderStatus' data-status-id='${statusid}'>
      ${str}
    </td>
    <td>
      <span>${item.Ordertime}</span>
    </td>
    <td>
      <span>${item.Totalprice}</span>
    </td>
    <td>
        <i class="bi bi-x-circle fs-2">
            <i class="bi bi-cash-coin fs-4"></i>
        </i>
    </td>
    <td>
        <i class="bi bi-trash3 del fs-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                class="bi bi-exclamation-triangle text-danger" viewBox="0 0 16 16">
                <path
                    d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                <path
                    d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
        </i>
    </td>
  </tr>`}).join('')
    needToRefund()
    wantDeleteOrder()
}

// 在前端渲染订单信息模块，通过用户名来识别操作
// 未登录就渲染一条数据，
// 已登录将按最大下单时间逆序渲染数据
async function generateOrderManageDiv(generateflag, Mytel) {
    if (generateflag && (Mytel === '' || Mytel === null)) {
        try {
            const response = await axios.post('/api/fetchlastOrderwithNULL')
            if (response.status === 200) {
                const lastOrder = response.data.lastOrder
                const { Orderid, Totalprice, Statusid } = lastOrder[0]
                const Ordertime = utcToutc8(lastOrder[0].Ordertime)
                const Foodpicture = document.querySelector(`div[data-food-id='${lastOrder[1].Foodid}']`).querySelector('img').src
                const manageDIVData = [{ Foodpicture, Orderid, Statusid, Ordertime, Totalprice }]
                renderOrderManageDiv(manageDIVData)
            } else {
                console.log('无法获取最新订单！')
            }
        } catch (error) {
            console.log("数据库错误: " + error)
        }
    } else if (Mytel) {
        try {
            const response = await axios.post('/api/fecthOrderWithUsername', { Mytel })
            if (response.status === 200) {
                const totalOrder = response.data.totalOrder
                const manageDIVData = totalOrder.map(item => {
                    const { Orderid, Totalprice, Statusid } = item[0]
                    const Ordertime = utcToutc8(item[0].Ordertime)
                    const Foodpicture = document.querySelector(`div[data-food-id='${item[1].Foodid}']`).querySelector('img').src
                    return { Foodpicture, Orderid, Statusid, Ordertime, Totalprice }
                })
                console.log(manageDIVData)
                renderOrderManageDiv(manageDIVData)
            } else {
                console.log('无法获取该用户的全部订单！')
            }
        } catch (error) {
            console.log("出现错误: " + error)
        }
    }
}

// 从服务器端获取订单管理模块需要的信息并渲染到页面上
function getOrderListFromServer(Mytel) {
    const username = document.querySelector('.username').innerHTML
    console.log("订单:", username)
    if (username !== '' && Mytel !== '') {
        generateOrderManageDiv(false, Mytel)
    }
}

// 订单确认下单按钮
// 数据传给后端，插入和订单信息相关的两个数据表
// 对于菜单表，还需要更新剩余量
// 只用一个接口完成： /api/saveOrderInfo
function placeanorder(orderList, isSuccess) {
    if (isSuccess) {
        document.querySelector('.placeOrderBtn').addEventListener('click', async e => {
            if (document.querySelector('.list').innerText !== '') {
                try {
                    const response = await axios.post('/api/saveOrderInfo', {
                        orderList
                    })
                    if (response.status === 200) {
                        console.log(response.data.message)
                        document.querySelector('.list').innerHTML = ''
                        document.querySelector('.total').innerHTML = ''
                        clearSelectedFood(true)
                        const placeOrderdiv = document.querySelector('.placeOrderdiv')
                        if (placeOrderdiv) { placeOrderdiv.remove() }
                        console.log(orderList)

                        generateOrderManageDiv(true, orderList[0].Mytel)

                        document.querySelector('.alert').style.top = (window.scrollY + 250) + 'px'
                        myAlert(true, `${response.data.message}`)

                    } else {
                        myAlert(false, `${response.data.message}!`)
                        console.log('Error:', response.data.message)
                    }
                } catch (error) {
                    myAlert(false, `${error.response.data.message}!`)
                    console.log("数据库错误: " + error)
                }

            } else {
                myAlert(false, '您还没点菜呢～')
            }
        })
    }
}

// 产生订单信息
function renderOrderForm(orderList) {
    // 数组中的对象具有这样的格式
    // {
    //     id: '4001874',
    //     name: '古法温酒汝瓷酒具套装白酒杯莲花温酒器',
    //     price: 488,
    //     picture: 'https://yanxuan-item.nosdn.127.net/44e51622800e4fceb6bee8e616da85fd.png',
    //     count: 1,
    //     spec: { color: '青色', sum: '一大四小' }
    //   },
    //  spec可以用来当加料的规格，多葱 去香菜 多辣 之类的
    // 标签结构见对应页面
    return new Promise((resolve, reject) => {
        // 1. 根据数据渲染页面
        document.querySelector('.list').innerHTML = `<div class="itemheader">
              <div class="headerpic">餐品图片</div>
              <p class="foodname">餐品名称</p>
              <!-- <p class="foodspec">餐品规格</p> -->
              <p class="foodprice">餐品单价</p>
              <p class="foodcount">点菜数目</p>
              <p class="foodsub-total">小计</p>
            </div>` + orderList.slice(1).map(item => {
            // console.log(item)  // 每一条对象
            // 对象解构  item.price item.count
            const { picture, Foodname, count, price, spec, gift } = item
            // 规格文字模块处理
            // const text = Object.values(spec).join('/')

            // 计算小计模块 单价 * 数量  保留两位小数 
            // 注意精度问题，因为保留两位小数，所以乘以 100  最后除以100
            const subTotal = ((price * 100 * count) / 100).toFixed(2)
            // 处理赠品模块 '50g茶叶,清洗球'
            const str = gift ? gift.split(',').map(item => `<span class="tag">【赠品】${item}</span> `).join('') : ''
            return `
      <div class="item">
        <img src=${picture} alt="">
        <p class="foodname">${Foodname} ${str} </p>
        <p class="foodprice">${price.toFixed(2)}</p>
        <p class="foodcount">x${count}</p>
        <p class="foodsub-total">${subTotal}</p>
      </div>
    `
        }).join('')

        // 3. 合计模块
        const total = orderList.slice(1).reduce((prev, item) => prev + (item.price * 100 * item.count) / 100, 0)
        document.querySelector('.total').innerHTML = `<div style="padding:20px">合计：<span class="totalfoodamount">${total.toFixed(2)}</span></div>`

        resolve(true)
    })

}

// orderList的结构一般是这样
// [
//     {
//         Orderid: 2,
//         Mytel: "13355007788",
//         Statusid: 1,
//         Totalprice: "579.80",
//     },
//     {
//         Foodid: "24",
//         Foodname: "可口可乐",
//         count: 1,
//         picture: "http://localhost:8080/order/index.html",
//         price: 3,
//         remainNumber: 199
//     },
// ]

// 根据ok-clear btn的函数 
// buttonOkClear 来切换订单信息
function toggleOrderForm(createflag) {
    const existingDiv = document.querySelector('.placeOrderdiv')

    if (createflag) {
        // 如果传入 true，则渲染订单
        if (!existingDiv) {

            const placeOrderDiv = document.createElement('div')
            placeOrderDiv.className = 'placeOrderdiv'

            const placeOrderBtn = document.createElement('button')
            placeOrderBtn.className = 'btn placeOrderBtn btn-dark'
            placeOrderBtn.textContent = '下单'

            placeOrderDiv.appendChild(placeOrderBtn)
            document.querySelector('#orderformSection').appendChild(placeOrderDiv)

            document.querySelector('.alert').style.top = (window.scrollY + 250) + 'px'
            myAlert(createflag, '好的！请下滑查看您的订单')
        }
    } else {
        // 传入false就删除订单信息
        if (existingDiv) {
            existingDiv.remove()
        }
        clearSelectedFood()
        document.querySelector('.list').innerHTML = ''
        document.querySelector('.total').innerHTML = ''
        myAlert(createflag, '已清空餐品和订单，重新选择吧')
    }
}

// 清除已点 和 我选好了 两个按钮
function buttonOkClear() {
    function getdata(elem) {
        const Foodname = elem.querySelector('.name').innerText
        const price = parseFloat(elem.querySelector('.price').innerText.replace('¥', '').trim())
        const remainNumber = parseInt(elem.querySelector('.remain').innerText.replace('剩余: ', '').trim())
        const count = parseInt(elem.querySelector('.count').innerText.replace('x', '').trim())
        const data = {
            picture: elem.querySelector('img').src,
            Foodid: parseInt(elem.dataset.foodId),
            Foodname: Foodname,
            price: price,
            remainNumber: remainNumber,
            count: count,
        }
        return data
    }

    document.querySelector('.clearOrderbtn').addEventListener('click', () => toggleOrderForm(false))

    document.querySelector('.okOrderbtn').addEventListener('click', async e => {
        const dishes = document.querySelectorAll('.dishes')
        const appetizers = document.querySelectorAll('.appetizer')
        const orderList = []

        try {
            const response = await axios.post('/api/getLastOrderID')
            if (response.status === 200) {
                console.log(response.data)
                console.log(response.data.message)

                orderList.push({
                    Orderid: +response.data.lastOrderID + 1,
                    Mytel: document.querySelector('.username').innerHTML ? document.querySelector('.username').innerHTML : null,
                    Statusid: 1,
                })
                dishes.forEach((dish) => {
                    if (dish.querySelector('#input-number').value !== '0') {
                        const dishData = getdata(dish)
                        orderList.push(dishData)
                    }
                })
                appetizers.forEach(appetizer => {
                    if (appetizer.querySelector('#input-number').value !== '0') {
                        const appetizerData = getdata(appetizer)
                        orderList.push(appetizerData)
                    }
                })
                if (orderList.length === 1) {
                    myAlert(false, '您没有点菜呢～')
                } else {
                    toggleOrderForm(true)
                    const isSuccess = await renderOrderForm(orderList)
                    console.log(orderList)
                    console.log(isSuccess)
                    orderList[0].Totalprice = parseFloat(document.querySelector('.totalfoodamount').innerHTML)
                    placeanorder(orderList, isSuccess)
                }
            } else {
                console.log('无法取回最后一个订单编号:', response.data.message)
            }
        } catch (error) {
            console.log("数据库错误: " + error)
        }
    })
}



export default {
    navbar,
    getMenuFromServer,
    buttonAddSubtract,
    buttonOkClear,
    clearSelectedFood,
    toggleOrderForm,
    axios,
    openAvatarImageDb,
    storeAvatar,
    getAvatar,
    placeanorder,
    getOrderListFromServer,
    generateOrderManageDiv,
    renderOrderManageDiv,
    myAlert,
    fixAlert,
    utcToutc8,
}
