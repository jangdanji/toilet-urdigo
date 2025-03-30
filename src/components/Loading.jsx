import React from 'react';
import { FaToilet } from "react-icons/fa";

const Loading = ({ message = '로딩 중...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white-100/20 backdrop-blur-xs">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-end justify-center">
          <FaToilet className="text-indigo-500 toilet-bounce" size={40} />
        </div>
        
        <p className="mt-4 text-base text-gray-700 font-medium">{message}</p>
        <p className="text-xs text-gray-500 mt-1">잠시만 기다려 주세요!</p>
      </div>
      
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(-5px);
            }
            50% {
              transform: translateY(5px);
            }
          }
          
          .toilet-bounce {
            animation: bounce 0.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
