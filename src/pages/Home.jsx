// App.jsx
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function App() {
  // 리스트 아이템 예시 데이터
  const items = Array.from({ length: 10 }, (_, i) => `아이템 ${i + 1}`);

  return (
      <div className="container mx-auto p-4 flex justify-center">
        {/* 상위 직사각형 박스 */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
          {/* 좌측: 스크롤 가능한 리스트 */}
          <div className='w-full md:w-2/3 h-[400px] border-b md:border-b-0 md:border-r border-gray-200 p-4'>
            <div className='px-2 pb-4 pt-2'>
              <h2 className='text-2xl font-semibold text-center'>가까운 화장실</h2>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              <ul className="space-y-2">
                {items.map((item, index) => (
                    <li
                      key={index}
                      className="p-2 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      {item}
                    </li>
                ))}
                <li id='toilet-loading'></li>
              </ul>
            </div>
          </div>

          <div className='md:w-1/3 p-4 flex flex-col justify-evenly'>
            <div className='space-y-6'>
              {/* 개방 상태 필터 */}
              <div>
                <h3 className="mb-4 text-md font-bold">개방 상태</h3>
                <Select defaultValue="open">
                  <SelectTrigger className="w-full py-4 text-md">
                    <SelectValue placeholder="개방 상태 선택" />
                  </SelectTrigger>
                  <SelectContent className="text-xl">
                    <SelectItem value="open">개방중</SelectItem>
                    <SelectItem value="closed">개방시간 아님</SelectItem>
                    <SelectItem value="unknown">개방시간 미확인</SelectItem>
                    <SelectItem value="all">전체</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 화장실 종류 필터 */}
              <div>
                <h3 className="mb-4 text-md font-bold">화장실 종류</h3>
                <Select defaultValue="all-types">
                  <SelectTrigger className="w-full py-4 text-md">
                    <SelectValue placeholder="화장실 종류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">전체</SelectItem>
                    <SelectItem value="public">공중화장실</SelectItem>
                    <SelectItem value="disabled">민간화장실</SelectItem>
                    <SelectItem value="unknown">존재 여부 미확인</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 반경 필터 */}
              <div>
                <h3 className="mb-4 text-md font-bold">검색 반경</h3>
                <Select defaultValue="100">
                  <SelectTrigger className="w-full py-4 text-md">
                    <SelectValue placeholder="반경 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100m</SelectItem>
                    <SelectItem value="500">500m</SelectItem>
                    <SelectItem value="1000">1km</SelectItem>
                    <SelectItem value="3000">3km</SelectItem>
                    <SelectItem value="all">전체</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* <div className="md:w-3/5 p-4 flex flex-col gap-2">
            <div className='flex flex justify-between pt-2'>
              <h2 className='text-2xl font-semibold'>화장실 제목</h2>
              <p className='text-gray-500 content-end'>데이터 기준일자</p>
            </div>
            <p>서울특별시 서대문구 아현동 1921249124</p>
            <p>공중화장실/민간화장실/미승인</p>
            <p>개방시간 : 09:00 ~ 18:00</p>
            <p>특이사항</p>
          </div> */}
        </div>
      </div>
  );
}
