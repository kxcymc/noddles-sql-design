import axios from 'a_src/utils/request.js' 
// import axios from 'axios'

export function openAvatarImageDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("avatarImageDB", 1)

        // 升级数据库时创建对象存储和索引
        request.onupgradeneeded = e => {
            const db = e.target.result
            if (!db.objectStoreNames.contains("images")) {
                const objectStore = db.createObjectStore("images", { keyPath: "name" })
                // 创建索引
                objectStore.createIndex("isAvatar", "isAvatar")
            }
        }

        request.onsuccess = e => {
            resolve(e.target.result)
        }

        request.onerror = () => {
            reject("数据库打开失败")
        }
    })
}

// 存储头像到 IndexedDB
export function storeAvatar(imageData, Mytel) {
    console.log(typeof imageData)
    console.log(typeof Mytel)
    openAvatarImageDb().then(db => {
        const transaction = db.transaction("images", "readwrite")
        const store = transaction.objectStore("images")

        // 1. 检查是否已经存在被标记为头像的图片
        const avatarRequest = store.index("isAvatar").get("avatar")  

        const checkAndUpdateAvatar = () => {
            return new Promise((resolve, reject) => {
                avatarRequest.onsuccess = () => {
                    if (avatarRequest.result) {
                        // 2. 如果已有头像，先删除旧头像
                        const deleteRequest = store.delete(avatarRequest.result.name)
                        deleteRequest.onsuccess = () => {
                            console.log("旧头像已删除")
                            resolve()  // 删除成功后继续
                        }
                        deleteRequest.onerror = (error) => {
                            console.error("删除旧头像失败", error)
                            reject(error)  // 删除失败时拒绝
                        }
                    } else {
                        // 没有旧头像，直接执行存储新头像
                        resolve()
                    }
                }
                avatarRequest.onerror = (error) => {
                    console.error("查询现有头像失败", error)
                    reject(error)  // 查询失败时拒绝
                }
            })
        }
        
        // 存储头像
        const storeAvatar = () => {
            const request = store.put({
                name: Mytel,
                data: imageData,  
                isAvatar: "avatar"
            })
        
            request.onsuccess = () => {
                console.log(`头像 "${Mytel}" 已更新/存储`)
            }
        
            request.onerror = () => {
                console.log("存储头像失败")
            }
        }
        
        // 执行查询和存储头像的操作
        checkAndUpdateAvatar()
            .then(storeAvatar)
            .catch(error => {
                console.error("处理头像时出错", error)
            })


        transaction.onerror = () => {
            console.log("存储图片事务失败")
        }
    }).catch(e => {
        console.log("打开数据库失败", e)
    })
}


// 根据 mytel 获取图片
// 返回值是携带了用户名的Promise对象，可按需使用
export function getAvatar() {
    // 返回一个Promise，确保异步操作完成后可以得到结果
    return new Promise((resolve, reject) => {
        openAvatarImageDb().then((db) => {
            const transaction = db.transaction("images", "readonly")
            const store = transaction.objectStore("images")
            const cursorRequest = store.openCursor()  // 获取游标，开始遍历对象存储
            
            cursorRequest.onsuccess = async (event) => {
                const cursor = event.target.result
                if (cursor) {
                    const Mytel = cursor.key
                    console.log(Mytel)
                    
                    if (/^1\d{10}$/.test(Mytel)) {
                        console.log(Mytel)
                        
                        try {
                            const response = await axios.post('/checkUsertel', { Mytel: Mytel })
                            if (response.data.result) {
                                document.querySelector('.myAvatar').src = cursor.value.data
                                document.querySelector('.username').innerHTML = Mytel
                                console.log('Found image for mytel:', Mytel)
                                
                                // 成功时返回手机号
                                resolve(Mytel)
                                return
                            } else {
                                console.log('找不到您，请尝试重新登录')
                                reject('找不到用户')
                            }
                        } catch (error) {
                            console.log('请求出错:', error)
                            console.log(error.response ? error.response.data : error)
                            reject('请求出错')
                        }
                    } else {
                        cursor.continue()
                        console.log('寻找下一条数据')
                    }
                }
            }
            
            cursorRequest.onerror = () => {
                console.log('读取图片失败')
                reject('读取图片失败')
            }
        }).catch((error) => {
            console.log(error)
            reject('数据库打开失败')
        })
    })
}

export { axios }