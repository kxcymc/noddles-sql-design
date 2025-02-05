// 弹窗插件
// 需要先准备 alert 样式相关的 DOM
/**
 * BS 的 Alert 警告框函数，2秒后自动消失
 * @param {*} isSuccess 成功 true，失败 false
 * @param {*} msg 提示消息
 */

// 显示警告框
export function myAlert(isSuccess, msg) {
  const myAlert = document.querySelector('.alert')
  myAlert.classList.add(isSuccess ? 'alert-success' : 'alert-danger')
  myAlert.innerHTML = msg
  myAlert.classList.add('show')
  
  setTimeout(() => {
    myAlert.classList.remove(isSuccess ? 'alert-success' : 'alert-danger')
    myAlert.innerHTML = ''
    myAlert.classList.remove('show')
  }, 3000)
}

// 警告框倒计时，警告框中字符串只能含一个数字0～9类型字符！
export function changeNumber(msg){
  const div = document.querySelector('.alert')
  let i = 3
  let n = setInterval(() => {
    i--
    // 当msg字符串只有一个数字字符时
    const parts = msg.split(msg.match(/(\d)/)[0])
    div.innerHTML = parts.join(`${i}`)
    if(i===0) { clearInterval(n) }
  }, 1000);
}

// 警告框需要跟踪页面位置
export function fixAlert() {
  function debounce(func, delay) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  }
  window.addEventListener('scroll', debounce(()=> document.querySelector('.alert').style.top = (window.scrollY + 50) + 'px', 200))
}