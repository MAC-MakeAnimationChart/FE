import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export function ChartPreview({ data, settings }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current || data.length === 0 || !settings.categoryColumn || !settings.valueColumn) {
            return;
        }

        if (!chartInstanceRef.current) {
            chartInstanceRef.current = echarts.init(chartRef.current);
        }

        const chart = chartInstanceRef.current;

        const filteredData = data
            .slice(0, settings.topN)
            .map(row => ({
                category: String(row[settings.categoryColumn]),
                value: Number(row[settings.valueColumn]) || 0
            }));

        const categories = filteredData.map(d => d.category);
        const values = filteredData.map(d => d.value);

        // --- 🚀 차트 타입에 따른 Series 분기 처리 ---
        const chartType = settings.chartType || 'bar';
        let seriesConfig = [];

        if (chartType === 'diverging') {
            // 발산형 막대그래프 설정
            seriesConfig = [
                {
                    type: 'bar',
                    data: values,
                    itemStyle: {
                        // 값이 양수면 기본 색상, 음수면 별도 색상 적용
                        color: (params) => {
                            return params.value >= 0
                                ? (settings.barColor || '#5470c6')
                                : (settings.negativeColor || '#ee6666'); // 음수 색상
                        },
                        opacity: settings.barOpacity / 100,
                    },
                    barWidth: settings.barWidth ? `${settings.barWidth}%` : 'auto',
                    barGap: settings.barGap,
                    label: {
                        show: true,
                        // 값이 양수면 막대의 오른쪽, 음수면 막대의 왼쪽에 라벨 표시
                        position: (params) => params.value >= 0 ? 'right' : 'left',
                        fontSize: settings.labelFontSize,
                        fontWeight: settings.labelBold ? 'bold' : 'normal',
                    },
                }
            ];
        } else {
            // 기존 일반 막대그래프 (향후 line, scatter 등으로 확장 가능)
            seriesConfig = [
                {
                    type: chartType,
                    data: values,
                    itemStyle: {
                        color: settings.barColor,
                        opacity: settings.barOpacity / 100,
                    },
                    barWidth: settings.barWidth ? `${settings.barWidth}%` : 'auto',
                    barGap: settings.barGap,
                    label: {
                        show: true,
                        // 차트 타입에 따라 라벨 기본 위치 조정
                        position: chartType === 'bar' ? 'right' : 'top',
                        fontSize: settings.labelFontSize,
                        fontWeight: settings.labelBold ? 'bold' : 'normal',
                    },
                },
            ];
        }

        const option = {
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
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' } // 툴팁 표시 스타일 추가
            },
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
                axisTick: { show: false } // Y축 눈금선 숨김 (깔끔한 표시를 위함)
            },
            series: seriesConfig, // 동적으로 생성한 series 할당
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

        // true(notMerge 옵션)를 추가하여 이전 차트 속성이 덮어씌워지는 오류 방지
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

    // ... (로딩 상태 컴포넌트는 기존과 동일) ...
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

