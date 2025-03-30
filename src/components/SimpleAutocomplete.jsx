import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { MdCheck } from 'react-icons/md';
import useToiletStore from '../store/toiletStore';
import useRegionStore from '../store/regionStore';

const SimpleAutocomplete = ({ 
  placeholder = "주소를 입력해주세요.", 
  onSelect, 
  value,
  className = "" 
}) => {

  const { regions, fetchRegions, isLoading } = useRegionStore();

  useEffect(() => {
    fetchRegions();
  }, []);

  const [inputValue, setInputValue] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);

  const { setLocationByAddress } = useToiletStore();

  // 상위 요소에서 value 전달
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // 입력값이 변경될 때 필터링된 옵션 업데이트
  useEffect(() => {

    const filtered = regions.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    
  }, [inputValue, regions]);

  // 컴포넌트 외부 클릭 시 옵션 목록 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  // 옵션 선택 핸들러
  const handleOptionSelect = async (option) => {
    
    setInputValue(option.label);
    setShowOptions(false);
    if (onSelect) {
      onSelect(option);
    }

    await setLocationByAddress(option.label);

  };

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-4xl ${className}`}>
      <div className="flex w-full">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowOptions(true);
          }}
          onFocus={() => setShowOptions(true)}
          placeholder={placeholder}
          className="w-full rounded-md border-r-0 bg-white"
        />
      </div>

      {/* 드롭다운 옵션 목록 */}
      {showOptions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {isLoading && (
              <li className="flex items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </li>
            )}
            {!isLoading && filteredOptions.length === 0 && (
              <li className="flex items-center px-4 py-2 text-gray-500 hover:bg-gray-100">
                검색 결과가 없습니다.
              </li>
            )}
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                {inputValue === option.label && <MdCheck className="mr-2 h-4 w-4 text-blue-600" />}
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimpleAutocomplete;
