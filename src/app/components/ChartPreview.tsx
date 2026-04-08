import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ChartData, ChartSettings } from '../types/chart';

interface ChartPreviewProps {
  data: ChartData[];
  settings: ChartSettings;
}

export function ChartPreview({ data, settings }: ChartPreviewProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0 || !settings.categoryColumn || !settings.valueColumn) {
      return;
    }

    // Initialize or get chart instance
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    // Prepare data
    const filteredData = data
      .slice(0, settings.topN)
      .map(row => ({
        category: String(row[settings.categoryColumn]),
        value: Number(row[settings.valueColumn]) || 0
      }));

    const categories = filteredData.map(d => d.category);
    const values = filteredData.map(d => d.value);

    // Chart options
    const option: echarts.EChartsOption = {
      backgroundColor: settings.backgroundColor,
      title: [
        {
          text: settings.mainTitle,
          left: settings.mainTitlePosition,
          top: 20,
          textStyle: {
            fontSize: settings.mainTitleFontSize,
            fontWeight: settings.mainTitleBold ? 'bold' : 'normal',
            color: '#333',
          },
        },
        {
          text: settings.subTitle,
          left: settings.subTitlePosition,
          top: settings.mainTitle ? settings.mainTitleFontSize + 35 : 20,
          textStyle: {
            fontSize: settings.subTitleFontSize,
            fontWeight: settings.subTitleBold ? 'bold' : 'normal',
            color: '#666',
          },
        },
      ],
      grid: {
        left: '10%',
        right: '10%',
        top: settings.mainTitle || settings.subTitle ? 100 : 60,
        bottom: settings.dataSource ? 80 : 60,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          fontSize: settings.axisFontSize,
          fontWeight: settings.axisBold ? 'bold' : 'normal',
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          fontSize: settings.axisFontSize,
          fontWeight: settings.axisBold ? 'bold' : 'normal',
        },
      },
      series: [
        {
          type: 'bar',
          data: values,
          itemStyle: {
            color: settings.barColor,
            opacity: settings.barOpacity / 100,
          },
          barWidth: `${settings.barWidth}%`,
          barGap: settings.barGap,
          label: {
            show: true,
            position: 'right',
            fontSize: settings.labelFontSize,
            fontWeight: settings.labelBold ? 'bold' : 'normal',
          },
        },
      ],
      legend: {
        show: settings.showLegend,
        bottom: settings.dataSource ? 50 : 20,
        textStyle: {
          fontSize: settings.legendFontSize,
          fontWeight: settings.legendBold ? 'bold' : 'normal',
        },
      },
      graphic: settings.dataSource ? [
        {
          type: 'text',
          left: 'center',
          bottom: 10,
          style: {
            text: settings.dataSource,
            fontSize: settings.sourceFontSize,
            fill: '#999',
          },
        },
      ] : [],
    };

    chart.setOption(option);

    // Handle resize
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, settings]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">데이터를 업로드하면 차트가 표시됩니다</p>
        </div>
      </div>
    );
  }

  if (!settings.categoryColumn || !settings.valueColumn) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">차트 설정에서 카테고리와 값 컬럼을 선택하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white rounded-lg">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
