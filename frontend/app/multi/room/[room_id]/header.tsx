"use client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/src/assets/images/logo.png"
import penguin from "@/public/src/assets/images/penguin.png";
import axios from "axios";
import useClickSound from "@/public/src/components/clickSound/DefaultClick";
import socketStore from "@/public/src/stores/websocket/socketStore";
import { useEffect, useState } from "react";
import userStore from "@/public/src/stores/user/userStore";


export default function Header() {
  const { memberId } = userStore();
  const playClickSound = useClickSound();
  const router = useRouter();
  const params = useParams<{ room_id?: string }>();
  const room_id: string | undefined = params.room_id;
  const { receiveMessages, setReceiveMessages, deleteReceiveMessages, readyState } = socketStore();
  const {roomId, roomTitle, hostId} = socketStore()
  const [allReady, setAllReady] = useState(false)

  useEffect(()=>{
    Object.keys(readyState).map((item)=>{
      if (!readyState[Number(item)]) 
      {
        setAllReady(false)
        return
      }
    }) 
    setAllReady(true)
  }, [readyState])
  const handleGameReady = async() => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch(`https://j10a207.p.ssafy.io/api/multi/ready?roomId=${params.room_id}`,{
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGameStart = async() => {
    const token = sessionStorage.getItem("accessToken");
    try {
      const response = await fetch("https://j10a207.p.ssafy.io/api/multi/start-game",{
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'playerIds': [1, 2, 3, 4, 5, 6],
          'roundNumber': 3,
          'roomId': params.room_id
        })
      })
      
      const result = await response.json();
      console.log(result)
      const gameId = result.result.gameLogId
      router.push(`${room_id}/play/${gameId}`);
    } catch (error) {
      console.error(error)
    }
  }

  const [receiveMessage, setReceiveMessage] = useState<any>([]);
  function handleExit() {
    axios({
      method: "delete",
      url: `https://j10a207.p.ssafy.io/api/multi/exit?roomId=${room_id}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      deleteReceiveMessages()
    });
  }


  return (
    <header className="row-span-1 grid grid-cols-12 border items-center gap-2">
      <div className="col-start-2 col-end-3 flex items-center">
        <div className="flex gap-2 items-center">
          <Image
            src={logo}
            alt="Logo"
            className="h-8"
            width={32}
            height={32}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            지금이니
          </span>
        </div>
      </div>
      <div className="col-span-8 flex justify-center font-bold text-xl">
        <div>{roomTitle}</div>
      </div>
      <div className="col-span-2 flex justify-center gap-4">
        {
          memberId === hostId ? (
          <button
            className="border p-2 rounded-md bg-red-500 text-white hover:bg-red-400"
            onClick={() => {
              playClickSound();
              handleGameStart();
            }}
          >
            시작하기
          </button>
          ): (
          <button
            className="border p-2 rounded-md bg-red-500 text-white hover:bg-red-400"
            disabled={!allReady}
            onClick={() => {
              playClickSound();
              handleGameReady();
            }}
          >
            준비하기
          </button>
          )
        }
        <button
          onClick={() => {
            playClickSound();
            handleExit();
            router.back();
          }}
          className="border p-2 rounded-md border-red-500 hover:bg-red-100 hover:border-2"
        >
          나가기
        </button>
      </div>
    </header>
  );
}
