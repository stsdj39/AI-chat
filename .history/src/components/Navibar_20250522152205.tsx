'use client'
import { ChatModel } from "@/db/schema"
import React from "react";
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import axios from "axios"
type Props = {
    a:string
}

const Navibar = (props: Props) => {
    console.log('props', props);
    
    const { user } = useUser()
    const route = useRouter()
    const { data: chats } = useQuery({
        //         # React Query 查询结构解析
        // ## 代码分析
        // ```tsx
        // const { data: chats } = useQuery({
        //     queryKey: ['chats'],
        //     queryFn: async () => {
        //         return axios.get('/api/get-chats')
        //     },
        //     enabled: !!user?.id,
        // })
        // ```
        // ## 关键部分说明
        // ### 1. `useQuery` Hook
        // - 这是 React Query 提供的核心 Hook
        // - 用于处理数据获取、缓存和状态管理
        // - 返回包含查询状态和数据的对象
        // ### 2. 配置对象参数
        // 这个对象包含三个重要属性：
        // #### `queryKey: ['chats']`
        // - 用于唯一标识这个查询
        // - 数组形式允许组合多个值
        // - 在缓存管理和数据刷新时使用
        // - 其他组件可以通过相同的 key 访问数据
        // #### `queryFn: async () => {...}`
        // - 定义实际的数据获取逻辑
        // - 返回 Promise
        // - 这里使用 axios 发送 GET 请求
        // - 获取聊天列表数据
        // #### `enabled: !!user?.id`
        // - 控制查询是否执行的条件
        // - 只有在用户已登录时才执行查询
        // - `!!` 将值转换为布尔类型
        // - 防止未登录状态下的无用请求
        // ### 3. 解构赋值
        // ```tsx
        // const { data: chats } = useQuery(...)
        // ```
        // - 从返回对象中解构出 `data` 并重命名为 `chats`
        // - 便于在组件中使用聊天数据
        // ## 使用场景
        // 1. **导航栏显示聊天列表**
        // ```tsx
        // {chats?.map(chat => (
        //     <div key={chat.id}>
        //         {chat.title}
        //     </div>
        // ))}
        // ```
        // 2. **数据更新和缓存**
        // - 当创建新聊天时，可以通过 `invalidateQueries(['chats'])` 刷新列表
        // - 数据会自动缓存，减少不必要的请求
        // 3. **条件查询**
        // - 只在用户登录状态下获取数据
        // - 提高应用性能和用户体验
        queryKey: ['chats'],
        queryFn: async () => {
            return axios.post('/api/get-chats')
        },
        enabled: !!user?.id,
    })
    // 读取当前路由路径
    const pathname = usePathname()
    return (
        // 导航栏
        <div className="h-screen bg-gray-50">
            {/* 表头 */}
            <div className="flex items-center justify-center">
                <p className="font-blod text-2xl">AnyAI</p>
            </div>
            <div className="h-10 items-center justify-center flex mt-4 cursor-pointer"
                onClick={() => {
                    route.push('/')
                }}
            >
                {/* cursor-pointer:当应用这个样式类时，会将鼠标悬停在元素上时的光标样式更改为一个手型指针（👆）。 */}
                <p className="h-full w-/2/3 bg-green-300 rounded-lg flex items-center justify-center font-thin">创建新聊天</p>
            </div>

            {/* 目录 */}
            <div className="flex flex-col justify-center items-center gpt-2 p-6">
                {/* flex-col 是 Tailwind CSS 中的一个 flex 布局类，
                它等同于 CSS 中的 flex-direction: column。让我详细解释它的作用：
                主要功能
                将 flex 容器的主轴方向设置为垂直方向（从上到下）
                使子元素在垂直方向上依次排列
                通常与其他 flex 相关的类配合使用
                常见搭配
                items-center: 水平居中对齐
                justify-center: 垂直居中对齐
                space-y-{n}: 设置垂直间距
                gap-{n}: 设置子元素间距 */}
                {chats?.data?.map((chat: ChatModel) => (
                    <div
                        className="w-full h-10"
                        key={chat.id}
                        onClick={() => {
                            route.push(`/chat/${chat.id}`)
                        }}
                    >
                        <p className={`font-extralight text-sm line-clamp-1 flex items-center justify-center  ${pathname === `/chat/${chat.id}` ? 'text-green-700' : ''} `}>{chat?.title}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Navibar