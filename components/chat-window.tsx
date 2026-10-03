"use client"

import React from "react"


type ChatItemProps = {

}

function ChatItem( { }: ChatItemProps ){

    return(
        <div className="bg-white p-3 mb-2 rounded shadow">
            <p className="text-gray-900 text-sm">Hello Alen, What are you doing buddy!</p>
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
            <div className="flex flex-col bg-white py-3 pl-3 pr-4 rounded shadow-sm">
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
        <div className="p-2 flex">
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
                 " 

                 name="" 
                 id=""
                 defaultValue={"Type here..."}
                 ></textarea>
                 <button className="w-[60px]" type="button">
                    Send
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
                    <div className="bg-slate-300  p-2 w-[250px] h-full border-r border-slate-100">
                        {[...Array(5).keys()].map((i) => <ChatItem key={i}/>)}
                        
                    </div>
                    <div className="flex flex-col">
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
