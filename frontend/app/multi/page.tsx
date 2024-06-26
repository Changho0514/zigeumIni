"use client";

import Navbar from "../Navbar";
import Profile from "./profile";
import Ranking from "./Ranking";
import GameRoomSetting from "./gameroomSetting";
import PeacefulBgm from "@/public/src/components/bgm/PeacefulBgm";
import { QueryClient, QueryClientProvider } from "react-query";
import useFetchUserInfo from "@/public/src/hooks/useFetchUserInfo";
import { Boxes } from "../../public/src/components/ui/background-boxes";
import { cn } from "../../public/src/utils/cn";
import userStore from "@/public/src/stores/user/userStore";
import axios from "axios";
import { useEffect } from "react";
const queryClient = new QueryClient();

interface userType {
  memberId: number;
  email: string;
  nickname: string;
  birthYear: number;
  gender: string;
  asset: number;
  rankPoint: number;
  win: number;
  lose: number;
  singleAvgRoi: number;
  multiAvgRoi: number;
}

export default function Multi() {
  useFetchUserInfo();
  
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // for chrome. deprectaed.
  };

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);
  // 새로고침 방지 로직

  const preventGoBack = () => {
    history.pushState(null, "", location.href);
  };
  useEffect(() => {
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", preventGoBack);
    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);
  //  뒤로가기 방지 로직

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative bg-background-1">
        <div className="grid grid-rows-12 h-screen border-separate">
          <PeacefulBgm></PeacefulBgm>
          <Navbar />
          <div className="bg-big-1 rounded-md row-span-11 grid grid-rows-12 mx-auto xl:max-w-screen-xl">
            {/* 상단 */}
            <div className="grid grid-cols-12 gap-4 row-span-4 z-10">
              <Profile />
              <div className="col-span-8 relative w-full overflow-hidden bg-small-1 flex flex-col items-center justify-center rounded-lg ">
                <div className="absolute inset-0 w-full bg-small-1 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
                <Boxes />
                <h1
                  className={cn("md:text-4xl text-xl text-white text-center relative z-20")}
                >
                  <div>주식 투자의 핵심은 </div>
                   <div>자신의 감정을 통제하는 것이다.</div> 
                </h1>
                <p className="text-center mt-2 text-white relative z-20">
                  Expanding Investment Capabilities with Multi-Play
                </p>
              </div>
            </div>

            {/* 하단 */}
            <div className="grid grid-cols-12 gap-4 row-span-8 mt-4 px-2">
              <aside className="col-span-4 mt-2">
                <Ranking />
              </aside>
              <GameRoomSetting />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
