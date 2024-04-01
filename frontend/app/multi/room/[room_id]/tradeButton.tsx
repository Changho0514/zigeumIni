'use client'
import { useState } from "react";
import TradeModal from "./play/[game_id]/TradeModal";
import useClickSound from "@/public/src/components/clickSound/DefaultClick";
export default function TradeButtons(){
  // 거래 모달창 open 여부
  const [isOpenTradeModal, setIsOpenTradeModal] = useState<boolean>(false);
  // 매수 / 매도 / 공매도 
  const [tradeType, setTradeType] = useState<string>('')
  const playClickSound = useClickSound();

  return(
    <div className='col-span-2'>
      <TradeModal 
        tradeType={tradeType} 
        isOpen={isOpenTradeModal} 
        onClose={()=>{
          playClickSound();
          setIsOpenTradeModal(false)
          setTradeType('')
        }}
       />
      <div className="gap-1 grid grid-rows-4">
        <button
          onClick={()=>{
            playClickSound();
            setTradeType('buy');
            setIsOpenTradeModal(true)
          }}
         className='border p-1 m-2 rounded-md text-white font-bold bg-red-500 hover:bg-red-400'>매수
        </button>
        <button
          onClick={()=>{
            playClickSound();
            setTradeType('sell')
            setIsOpenTradeModal(true)
          }}
         className='border p-1 m-2 rounded-md text-white font-bold bg-blue-500 hover:bg-small-1'>매도
         </button>
        <button
          onClick={()=>{
            playClickSound();
            setTradeType('shortSell')
            setIsOpenTradeModal(true)
          }}
         className='border p-1 m-2 rounded-md text-white font-bold bg-yellow-500 hover:bg-small-10'>공매도
        </button>
      </div>
    </div>
  )
}