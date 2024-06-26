"use client";
import { ChartImage } from "./chartImage";
import Chat from "./chat";
import FriendSearch from "./friendSearch";
import GameRule from "./gameRule";
import Header from "./header";
import GameMembers from "./GameMembers";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import multigameStore from "@/public/src/stores/multi/MultiGameStore";
import { useParams } from "next/navigation";
import PeacefulBgm from "@/public/src/components/bgm/PeacefulBgm";


const queryClient = new QueryClient();

export default function page() {

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
  
  const params = useParams<{ room_id?: string }>();
  const room_id: string | undefined = params.room_id;
  const { getMultigameRoomInfo } = multigameStore();

  useEffect(() => {
    getMultigameRoomInfo(Number(room_id));
  }, [room_id]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-rows-12 h-screen border-separate">
        <PeacefulBgm></PeacefulBgm>
        <Header />
        <div className="row-start-2 row-end-13 grid grid-cols-12 border">
        <PeacefulBgm></PeacefulBgm>
          <aside className="col-span-3 grid grid-rows-6 text-center">
            <FriendSearch />
            <GameRule />
          </aside>
          <main className="col-span-6 grid grid-rows-12">
              <ChartImage />
              <div className="row-span-3">
              <Chat />
              </div>
          </main>
          <GameMembers />
        </div>
      </div>
    </QueryClientProvider>
  );
}
