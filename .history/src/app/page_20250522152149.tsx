"use client";
import { useState } from "react";
import EastIcon from '@mui/icons-material/East'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
export default function Home() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("deepseek-v3");
  const handleChangeModel = () => {
    setModel(model === 'deepseek-v3' ? 'deepseek-r1' : 'deepseek-v3');
  }
  // useQuery
  const queryClient = useQueryClient()
  const route = useRouter()
  // 检测用户登录状态
  const { user } = useUser()
  // Mutations
  // 调用reactquery提供的hook函数，useMutation连接后端
  const { mutate: createChat } = useMutation({

    // 通过mutationFn方法调用后端接口  传参
    mutationFn: async () => {
      return axios.post('/api/create-chat', {
        title: input,
        model: model,
      }
      )
    },
    onSuccess: (res) => {
      console.log("创建聊天成功:", res.data);
      //获取新增聊天后的id     
      route.push(`/chat/${res.data.id}`)
      // Invalidate and refetch
      // 通过queryClient调用invalidateQueries方法，重新获取数据
      // queryClient.invalidateQueries 说明
      // 这行代码是 React Query 中的一个重要操作，用于使缓存失效并重新获取数据：
      // 主要功能
      // 使指定查询键（queryKey）的缓存数据失效
      // 触发相关查询的重新获取
      // 确保数据的实时性
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })


  // handleSubmit
  // 如果用户输入为空不新增聊天直接返回

  const handleSubmit = () => {
    if (input.trim() === "") {
      return;
    }
    //如果用户登录状态为false，跳转到登录页面
    if (!user) {
      route.push('/sign-in')
      return;
    }
    // 如果用户登录状态为true，调用createChat方法
    // 调用createChat方法
    createChat()
  }
  return (
    <div className="h-screen  flex flex-col items-center justify-center ">
      <div className="h-1/5" ></div>
      <div className="w-1/2    ">
        <p className="text-bold text-2xl text-center">
          有什么想问的？我来解答！
        </p>

        <div className="flex flex-col items-center justify-center mt-4
        shadow-lg border-[1px] h-31 rounded-lg ">
          <textarea className="w-full rouned-lg p-3 h-30 focus:outline-none" placeholder="请在这里输入问题"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
            {/* 反引号（ ` ）定义模板字符串， ${} 内部是 JavaScript 表达式 模板字符串语法（Template Literals），属于 ES6 标准特性*/}
            <div className={`flex flex-row itmes-center justify-center rotate-lg border-[1px]
              px-2 py-1 ml-2 cursor-pointer ${model === 'deepseek-r1' ? "border-blue-300  border-blue-200" : "border-gray-100"}`}
              onClick={handleChangeModel}
            >
              <p className="text-sm">深度思考(R1)</p>
              {/* <p>深く（ふかく）考える（かんがえる）</p>  */}
            </div>
            <div className="flex  items-center justify-center　 mr-4  p-1 rounded-full"
              onClick={handleSubmit}>
              <EastIcon></EastIcon>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
