export default function AssetHeld({ data } :any) {

    return (
        <div className="row-span-3 bg-blue-100 border-black m-1 grid grid-rows-3 rounded-lg">
            <div className="row-span-1">{data.종목명}</div>
            <div className="row-span-2 grid grid-rows-2">
                <div className="row-span-1 grid grid-cols-4 justify-center">
                    <div className="col-span-1 m-auto">평가 손익</div>
                    <div className="col-span-1 m-auto text-pink-300">{data.평가손익}</div>
                    <div className="col-span-1 m-auto">매도 가능</div>
                    <div className="col-span-1 m-auto">{data.매도가능}</div>
                </div>
                <div className="row-span-1 grid grid-cols-4">
                    <div className="col-span-1 m-auto">손익률</div>
                    <div className="col-span-1 m-auto text-pink-300">{data.손익률} %</div>
                    <div className="col-span-1 m-auto">평균 단가</div>
                    <div className="col-span-1 m-auto">{data.평균단가}</div>
                </div>
            </div>
        </div>
    )
}