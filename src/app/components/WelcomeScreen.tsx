import React from 'react';
import { Upload, BarChart3, Settings2, Download } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MAC에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Make A Chart - 쉽고 빠른 데이터 시각화
          </p>
          <p className="text-base text-gray-500">
            비개발자도 데이터만 넣으면 차트를 만들고 수정할 수 있는 한글형 No-Code 시각화 웹서비스
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. 업로드</h3>
            <p className="text-sm text-gray-600">CSV 파일을 업로드하세요</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. 확인</h3>
            <p className="text-sm text-gray-600">자동 생성된 차트를 확인하세요</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Settings2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. 편집</h3>
            <p className="text-sm text-gray-600">색상, 크기, 스타일 조정</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Download className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">4. 다운로드</h3>
            <p className="text-sm text-gray-600">JPG 이미지로 저장</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 기능</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left mb-6">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900">Top N 데이터 선택</p>
                <p className="text-sm text-gray-600">원하는 개수만큼 데이터 표시</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900">커스텀 색상</p>
                <p className="text-sm text-gray-600">막대 색상과 배경 자유롭게 변경</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900">막대 스타일 조절</p>
                <p className="text-sm text-gray-600">두께, 투명도, 간격 세밀 조정</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900">제목 및 출처 표시</p>
                <p className="text-sm text-gray-600">대제목, 부제목, 데이터 출처 추가</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900">실시간 편집</p>
                <p className="text-sm text-gray-600">데이터 테이블에서 직접 수정</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900">고해상도 내보내기</p>
                <p className="text-sm text-gray-600">1920x1080 JPG 파일로 다운로드</p>
              </div>
            </div>
          </div>

          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            시작하기
          </button>

          <p className="text-sm text-gray-500 mt-4">
            샘플 데이터: 국가별 인구 통계 (CSV 형식)
          </p>
        </div>
      </div>
    </div>
  );
}
