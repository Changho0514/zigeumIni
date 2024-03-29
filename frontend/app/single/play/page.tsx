"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
// navbar
import Navbar from "@/app/Navbar";
// BGM
import InGameBgm from "@/public/src/components/bgm/InGameBgm";

// left
import TotalAssets from "./TotalAssets";
import AssetsHeld from "./AssetsHeld";
import SalesHistory from "./SalesHistory";
// middle
import Chart from "./Chart";
import StockMarket from "./StockMarket";
// right
import TurnInfo from "./TurnInfo";
import StockList from "./StockList";
import MarketAndTrends from "./MarketAndTrends";

// Store
import userStore from "@/public/src/stores/user/userStore";
import SingleGameStore from "@/public/src/stores/single/SingleGameStore";
// Hook
import useFetchUserInfo from "@/public/src/hooks/useFetchUserInfo";
// axios
import axios from "axios";

export default function SinglePlay() {
  useFetchUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const { 
    turn, setTurn, gameIdx, setGameIdx, setSingleGameChance,
    setTotalAssetData, setAssetListData, setTradeListData,
    stockListData, setStockListData, setStockMarketListData, 
    setTrendListData, setMarketInfoListData, setTodayStockInfoListData,
    selectedStockIndex
  } = SingleGameStore();
  const { asset } = userStore();
  console.log("asset : ", asset);
  const fetchSingleGameData = async () => {
    try {
      const response = await axios({
        method : "get",
        url : "https://j10a207.p.ssafy.io/api/single",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        }
      })

      console.log("useEffect axios 요청 데이터 결과")
      console.log(response.data.result);    
      if (response.data.result.day > 0) {
        setTurn(response.data.result.day);
      } else {
        setTurn(1);
      }

      setGameIdx(response.data.result.gameIdx);      
      setSingleGameChance(response.data.result.singleGameChance);

        // 사용자 총 평가 자산 데이터
        if (response.data.result.totalAsset) {
            setTotalAssetData({
              cash : response.data.result.totalAsset.cash,
              resultProfit : response.data.result.totalAsset.resultProfit,
              resultRoi : response.data.result.totalAsset.resultRoi,
              totalPurchaseAmount : response.data.result.totalAsset.totalPurchaseAmount,
              totalAsset : response.data.result.totalAsset.cash + response.data.result.totalAsset.totalPurchaseAmount,
            })
        } else {
          console.log("없어서")
          console.log(asset);
          setTotalAssetData({
            cash : asset as number,
            resultProfit : 0,
            resultRoi : 0, 
            totalPurchaseAmount : 0, 
            totalAsset :  asset as number,
          })
        }
        // 사용자 보유 종목 주식 데이터
        if (response.data.result.assetList != null) {
          setAssetListData(response.data.result.assetList);
        }
        // 사용자 매매 기록 데이터
        if (response.data.result.tradeList != null) {
          setTradeListData(response.data.result.tradeList);
        }
        // 10개 랜덤 종목 데이터
        setStockListData(response.data.result.stockChartDataList);
        // 증시 데이터
        setStockMarketListData(response.data.result.stockMarketList);

        // 트렌드, 시장 데이터
        setTrendListData(response.data.result.trendList);
        setMarketInfoListData(response.data.result.marketInfo);
        setTodayStockInfoListData(response.data.result.nextDayInfos);

        setIsLoading(false)

    } catch (error) {
      console.log(error)
      setIsError(true);
    }
  }

  useEffect(() => {
    fetchSingleGameData();
    // window.addEventListener('keydown', handleSelectStockIndex);
    return () => {
      // window.removeEventListener('keydown', handleSelectStockIndex);
    }
  }, []);
  
  if (isLoading) {
    return <div className="rainbow"></div>;
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-rows-12 h-screen border-separate">
        <InGameBgm></InGameBgm>
        {/* navbar */}
        <Navbar />
        <div className="row-span-11 grid grid-cols-12">
          {/* left aside */}
          <aside className="col-span-3 grid grid-rows-3">
            <TotalAssets />
            <AssetsHeld />
            <SalesHistory />
          </aside>
          {/* main */}
          <main className="col-span-7 grid grid-rows-12">
            <Chart data={stockListData[selectedStockIndex]?.stockChartList.slice(0, 300+turn)}/>
            {/* <StockMarket /> */}
          </main>
          {/* right aside */}
          <aside className="col-span-2 grid grid-rows-6">
            <TurnInfo/>
            <StockList />
            <MarketAndTrends />
          </aside>
        </div>
      </div>
    </QueryClientProvider>
  );
}
