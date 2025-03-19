import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { MdCheck } from 'react-icons/md';
import useToiletStore from '../store/toiletStore';

const SimpleAutocomplete = ({ 
  options = [], 
  placeholder = "주소를 입력해주세요.", 
  onSelect, 
  value,
  className = "" 
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);

  const { getGeocode, getToilets } = useToiletStore();

  // 입력값이 변경될 때 필터링된 옵션 업데이트
  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions([]);
    } else {
      const filtered = options.filter(option => 
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [inputValue, options]);

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

    const { lat, lng } = await getGeocode(option.label);

    if (lat && lng) {
      // Zustand 스토어에 좌표 저장
      useToiletStore.getState().setLocation(lat, lng);
      getToilets();
    }
  };

  // 키보드 이벤트 핸들러 (엔터키 처리)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      handleOptionSelect(filteredOptions[0]);
    }
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
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-md border-r-0 bg-white"
        />
      </div>

      {/* 드롭다운 옵션 목록 */}
      {showOptions && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
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
