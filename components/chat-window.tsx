"use client"

import React from "react"


function AgentIcon(){
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/>
            <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>
        </svg>
    )
}

function SendIcon(props: Object){

    return(
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 2 11 13"/>
        <path d="M22 2 15 22l-4-9-9-4z"/>
     </svg>
    )
}

function StopIcon(props: Object){

    return(
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="5" width="14" height="14" rx="2"/>
       </svg>
    )
}

type ChatItemProps = {

}

function ChatItem( { }: ChatItemProps ){

    return(
        <div className="pt-3 pb-2 pl-5 rounded border-b boder-gray-100">
            <p className="text-[14px] font-semibold font-sans mb-1">Rag Pipeline Design</p>
            <p className="text-gray-900 font-serif text-[12.5px]">Good question. I'd start by...</p>
        </div>
    )
}

type ChatMessageProps = {
    align?: "left" | "right"
}

function ChatMessage({ align = "left" }: ChatMessageProps){

    return(
        <div className="flex mb-3">
            {(align === "left") &&
            <div className="w-[100px] flex justifyc-enter items-center mr-2">
               <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full  bg-green-100">
                     <span className="">AI</span>
               </div>
            </div>}
            {/* Message Body */}
            <div className={`flex flex-col ${align === "left"? "bg-gray-200":"bg-blue-100"} py-3 pl-3 pr-4 rounded shadow-sm`}>
                <div className={`flex ${align==="left"? "justify-start": "justify-end"} mb-2`}>
                    <p className="text-[.9rem]">Hello Cutie, What are you doing ? I am wairng for you. Come here soon.</p>
                </div>
                <div className={`flex ${align==="left"? "justify-start": "justify-end"}`}>
                    <span className="text-xs text-slate-400">12:00 pm</span>
                </div>
            </div>
            {(align === "right") &&
            <div className="w-[100px] flex justifyc-enter items-center ml-2">
               <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full  bg-green-100">
                     <span className="">AI</span>
               </div>
            </div>}
        </div>
    )
}


type ChatInputProps = {

}

function ChatInput(){

    return (
        <div className="p-2 flex items-center">
             <textarea 
                 className="
                    flex-1
                    w-full 
                    py-1 
                    px-2 
                    bg-zinc-200
                    border 
                    border-zinc-300 
                    rounded-md 
                    focus:outline-none 
                    focus:ring-0 
                    resize-none 
                    text-sm 
                    text-gray-900
                    mr-2
                 " 

                 name="" 
                 id=""
                 defaultValue={"Type here..."}
                 ></textarea>
                 <button 
                     className="w-[40px] h-[40px] bg-blue-100 rounded-full flex justify-center items-center text-blue-500" 
                     type="button"
                 >
                    <SendIcon/>
                 </button>
        </div>
    )

}

type ChatWindowProps = {

}

export function ChatWindow( {} : ChatItemProps){


    return(
        <div className="fixed right-[30px] bottom-[30px] h-[500px] w-[650px] bg-slate-50 rounded overflow-hidden shadow-lg">
            <div className="flex w-full h-full">
                   
                    <div className="bg-slate-200  w-[300px] h-full border-r border-slate-200">
                        <div className="p-3"> 
                            <button className="bg-sky-600 text-white px-3 py-2 w-full rounded-md text-sm" type="button"><span className="mr-1">+</span>New Chat</button> 
                        </div>
                        <p className="pl-5 pb-2 text-[12.5px] text-gray-800">Recent</p>
                        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-slate scrollbar-thumb-gray-500">
                            {[...Array(10).keys()].map((i) => <ChatItem key={i}/>)}
                        </div>
                    </div>
                    <div className="flex flex-col">
                         <div className="flex justify-start bg-slate-100 border-t border-r boder-slate-500">
                             <div className="py-3 pl-3 flex">
                                <div className="ai-av mr-2">
                                    <AgentIcon/>
                                </div>
                                <div className="flex flex-col pl-2">
                                    <p className="text-[15.5px] text-bold">AI Agent</p>
                                    <span className="text-gray-800 text-xs">Ready</span>
                                </div>
                             </div>
                         </div>
                        <div className="min-w-0 flex-1 overflow-y-auto border-b bg-slate-400 p-2">
                        {
                            [...Array(5).keys()].map((i ,_) => <ChatMessage key={i} align={( i%2==0 ? "left": "right")}/> )
                        }
                        </div>
                        <ChatInput/>
                    </div>
             </div>
        </div>
    )
}
