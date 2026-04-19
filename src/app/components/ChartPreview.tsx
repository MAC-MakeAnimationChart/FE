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

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    const filteredData = data.slice(0, settings.topN);

    const categories = filteredData.map(row => String(row[settings.categoryColumn]));
    const values = filteredData.map(row => Number(row[settings.valueColumn]) || 0);

    let option: echarts.EChartsOption;

    if (settings.chartType === 'proportionalBar') {
      const total = values.reduce((sum, value) => sum + value, 0);

      option = {
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
          max: 100,
          axisLabel: {
            formatter: '{value}%',
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
            data: values.map((value) => total === 0 ? 0 : Number(((value / total) * 100).toFixed(2))),
            itemStyle: {
              color: settings.barColor,
              opacity: settings.barOpacity / 100,
            },
            barWidth: `${settings.barWidth}%`,
            barGap: settings.barGap,
            label: {
              show: true,
              position: 'right',
              formatter: '{c}%',
              fontSize: settings.labelFontSize,
              fontWeight: settings.labelBold ? 'bold' : 'normal',
            },
          },
        ],
      };
    } else if (settings.chartType === 'gridBar') {
      const allColumns = Object.keys(filteredData[0] || {});
      const groupColumn = allColumns.find(
        (col) => col !== settings.categoryColumn && col !== settings.valueColumn
      );

      if (!groupColumn) {
        option = {
          title: {
            text: 'gridBar를 사용하려면 그룹 컬럼이 필요합니다',
            left: 'center',
          },
        };
      } else {
        const groupedData: Record<string, { category: string; value: number }[]> = {};

        filteredData.forEach((row) => {
          const groupKey = String(row[groupColumn]);
          if (!groupedData[groupKey]) {
            groupedData[groupKey] = [];
          }
          groupedData[groupKey].push({
            category: String(row[settings.categoryColumn]),
            value: Number(row[settings.valueColumn]) || 0,
          });
        });

        const groupKeys = Object.keys(groupedData);
        const gridCount = groupKeys.length;
        const gridHeight = Math.max(15, Math.floor(70 / Math.max(gridCount, 1)));

        option = {
          backgroundColor: settings.backgroundColor,
          title: groupKeys.map((group, index) => ({
            text: group,
            left: 'center',
            top: `${10 + index * (gridHeight + 8)}%`,
            textStyle: {
              fontSize: settings.subTitleFontSize,
              fontWeight: settings.subTitleBold ? 'bold' : 'normal',
              color: '#333',
            },
          })),
          grid: groupKeys.map((_, index) => ({
            left: '10%',
            right: '10%',
            top: `${15 + index * (gridHeight + 8)}%`,
            height: `${gridHeight}%`,
            containLabel: true,
          })),
          xAxis: groupKeys.map((_, index) => ({
            type: 'value',
            gridIndex: index,
            axisLabel: {
              fontSize: settings.axisFontSize,
              fontWeight: settings.axisBold ? 'bold' : 'normal',
            },
          })),
          yAxis: groupKeys.map((group, index) => ({
            type: 'category',
            gridIndex: index,
            data: groupedData[group].map((item) => item.category),
            axisLabel: {
              fontSize: settings.axisFontSize,
              fontWeight: settings.axisBold ? 'bold' : 'normal',
            },
          })),
          series: groupKeys.map((group, index) => ({
            type: 'bar',
            xAxisIndex: index,
            yAxisIndex: index,
            data: groupedData[group].map((item) => item.value),
            itemStyle: {
              color: settings.barColor,
              opacity: settings.barOpacity / 100,
            },
            barWidth: `${settings.barWidth}%`,
            label: {
              show: true,
              position: 'right',
              fontSize: settings.labelFontSize,
              fontWeight: settings.labelBold ? 'bold' : 'normal',
            },
          })),
        };
      }
    } else if (settings.chartType === 'barRace') {
      const allColumns = Object.keys(filteredData[0] || {});
      const timeColumn = allColumns.find(
        (col) => col !== settings.categoryColumn && col !== settings.valueColumn
      );

      if (!timeColumn) {
        option = {
          title: {
            text: 'barRace를 사용하려면 시간 컬럼이 필요합니다',
            left: 'center',
          },
        };
      } else {
        const timeMap: Record<string, { category: string; value: number }[]> = {};

        filteredData.forEach((row) => {
          const timeKey = String(row[timeColumn]);
          if (!timeMap[timeKey]) {
            timeMap[timeKey] = [];
          }
          timeMap[timeKey].push({
            category: String(row[settings.categoryColumn]),
            value: Number(row[settings.valueColumn]) || 0,
          });
        });

        const times = Object.keys(timeMap).sort();

        option = {
          baseOption: {
            backgroundColor: settings.backgroundColor,
            timeline: {
              axisType: 'category',
              data: times,
              autoPlay: true,
              playInterval: 1000,
            },
            grid: {
              left: '10%',
              right: '10%',
              top: 80,
              bottom: 60,
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
              inverse: true,
              axisLabel: {
                fontSize: settings.axisFontSize,
                fontWeight: settings.axisBold ? 'bold' : 'normal',
              },
            },
            series: [
              {
                type: 'bar',
                realtimeSort: true,
                label: {
                  show: true,
                  position: 'right',
                  fontSize: settings.labelFontSize,
                  fontWeight: settings.labelBold ? 'bold' : 'normal',
                },
                itemStyle: {
                  color: settings.barColor,
                  opacity: settings.barOpacity / 100,
                },
              },
            ],
          },
          options: times.map((time) => {
            const sorted = [...timeMap[time]]
              .sort((a, b) => b.value - a.value)
              .slice(0, settings.topN || 10);

            return {
              title: {
                text: `${settings.mainTitle || 'Bar Chart Race'} - ${time}`,
                left: 'center',
                top: 20,
                textStyle: {
                  fontSize: settings.mainTitleFontSize,
                  fontWeight: settings.mainTitleBold ? 'bold' : 'normal',
                  color: '#333',
                },
              },
              yAxis: {
                data: sorted.map((item) => item.category),
              },
              series: [
                {
                  data: sorted.map((item) => item.value),
                },
              ],
            };
          }),
        };
      }
    } else {
      option = {
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
        graphic: settings.dataSource
          ? [
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
            ]
          : [],
      };
    }

    chart.setOption(option, true);

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