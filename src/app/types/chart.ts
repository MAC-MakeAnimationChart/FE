export interface ChartData {
  [key: string]: string | number;
}

export interface ChartSettings {
  // 데이터 설정
  topN: number;
  categoryColumn: string;
  valueColumn: string;
  chartType: 'bar' | 'proportionalBar' | 'gridBar' | 'barRace';
  
  // 차트 색상
  barColor: string;
  backgroundColor: string;
  
  // 바 설정
  barWidth: number;
  barOpacity: number;
  barGap: string;
  
  // 글자 서식
  labelFontSize: number;
  labelBold: boolean;
  axisFontSize: number;
  axisBold: boolean;
  
  // 범례
  showLegend: boolean;
  legendFontSize: number;
  legendBold: boolean;
  
  // 제목
  mainTitle: string;
  mainTitleFontSize: number;
  mainTitleBold: boolean;
  mainTitlePosition: 'left' | 'center' | 'right';
  
  subTitle: string;
  subTitleFontSize: number;
  subTitleBold: boolean;
  subTitlePosition: 'left' | 'center' | 'right';
  
  // 출처
  dataSource: string;
  sourceFontSize: number;
}

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  topN: 10,
  categoryColumn: '',
  valueColumn: '',
  chartType: 'bar',
  
  barColor: '#3b82f6',
  backgroundColor: '#ffffff',
  
  barWidth: 70,
  barOpacity: 100,
  barGap: '20%',
  
  labelFontSize: 12,
  labelBold: false,
  axisFontSize: 12,
  axisBold: false,
  
  showLegend: true,
  legendFontSize: 12,
  legendBold: false,
  
  mainTitle: '',
  mainTitleFontSize: 24,
  mainTitleBold: true,
  mainTitlePosition: 'center',
  
  subTitle: '',
  subTitleFontSize: 16,
  subTitleBold: false,
  subTitlePosition: 'center',
  
  dataSource: '',
  sourceFontSize: 10,
};
