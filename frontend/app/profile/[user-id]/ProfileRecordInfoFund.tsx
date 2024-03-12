export default function UserRecordInfoFund() {
  return (
    <div className="shadow row-span-5 relative overflow-auto max-h-96">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              펀드이름
            </th>
            <th scope="col" className="px-6 py-3">
              기간
            </th>
            <th scope="col" className="px-6 py-3">
              펀드 자금
            </th>
            <th scope="col" className="px-6 py-3">
              수익률
            </th>
            <th scope="col" className="px-6 py-3">
              수익
            </th>
          </tr>
        </thead>
        <tbody>
        
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
              scope="row"
              className="cursor-pointer px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
            <td className="px-6 py-4">$2999</td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
}
