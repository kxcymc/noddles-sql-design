// 数据表存储的下单时间是UTC+8时间
// 从后端取回时，会改成ISO格式的 UTC时间
// 比如，取出 “2024-11-22 14:26:44”
// 会变成 "2024-11-22T06:26:44.000Z"
// 所以需要写一个函数变回来
export function utcToutc8(utcString) {
    // utcString = "2024-11-22T06:26:44.000Z"
    const options = {
        timeZone: 'Asia/Shanghai', // 设置时区为 UTC+8
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24小时制
      }
    return new Date(utcString).toLocaleString('en-GB', options).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$2-$1 $4:$5:$6')
}


