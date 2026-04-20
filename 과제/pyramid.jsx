import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export function ChartPreview({ data, settings }) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        // 피라미드 차트일 경우 valueColumn2가 필요할 수 있으므로 최소 조건 확인
        if (!chartRef.current || data.length === 0 || !settings.categoryColumn || !settings.valueColumn) {
            return;
        }

        if (!chartInstanceRef.current) {
            chartInstanceRef.current = echarts.init(chartRef.current);
        }

        const chart = chartInstanceRef.current;

        // 1. 공통 카테고리 데이터 추출
        const filteredData = data.slice(0, settings.topN);
        const categories = filteredData.map(row => String(row[settings.categoryColumn]));

        let series = [];
        let xAxisConfig = {
            type: 'value',
            axisLabel: {
                fontSize: settings.axisFontSize,
                fontWeight: settings.axisBold ? 'bold' : 'normal',
            },
        };
        let tooltipConfig = {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        };

        // 2. 차트 타입에 따른 동적 설정 분기
        if (settings.chartType === 'pyramid') {
            // 인구 피라미드: valueColumn(좌측/남성 등)은 음수로, valueColumn2(우측/여성 등)는 양수로 처리
            // valueColumn2가 설정되지 않았다면 기본값으로 0 처리
            const leftValues = filteredData.map(row => -(Number(row[settings.valueColumn]) || 0));
            const rightValues = filteredData.map(row => Number(row[settings.valueColumn2]) || 0);

            series = [
                {
                    name: settings.valueColumnName || '남성',
                    type: 'bar',
                    stack: 'total', // 누적 막대로 설정하여 0을 기준으로 이어지게 함
                    data: leftValues,
                    itemStyle: { color: settings.leftColor || '#5470c6' },
                    label: {
                        show: true,
                        position: 'left',
                        formatter: (params) => Math.abs(params.value), // 라벨은 양수로 표시
                        fontSize: settings.labelFontSize,
                    }
                },
                {
                    name: settings.valueColumn2Name || '여성',
                    type: 'bar',
                    stack: 'total',
                    data: rightValues,
                    itemStyle: { color: settings.rightColor || '#ee6666' },
                    label: {
                        show: true,
                        position: 'right',
                        fontSize: settings.labelFontSize,
                    }
                }
            ];

            // X축과 툴팁에 음수가 표시되지 않도록 포맷터 적용
            xAxisConfig.axisLabel.formatter = (value) => Math.abs(value);
            tooltipConfig.formatter = (params) => {
                let res = `<b>${params[0].name}</b><br/>`;
                params.forEach(item => {
                    res += `${item.marker} ${item.seriesName}: ${Math.abs(item.value)}<br/>`;
                });
                return res;
            };

        } else {
            // 기본 막대 그래프 (기존 로직)
            const values = filteredData.map(row => Number(row[settings.valueColumn]) || 0);

            // 기존에 하드코딩 되어있던 'bar' 대신 동적 타입 적용 지원 (line 등 확장 대비)
            const type = settings.chartType || 'bar';

            series = [
                {
                    type: type,
                    data: values,
                    itemStyle: {
                        color: settings.barColor,
                        opacity: settings.barOpacity ? settings.barOpacity / 100 : 1,
                    },
                    barWidth: settings.barWidth ? `${settings.barWidth}%` : 'auto',
                    barGap: settings.barGap,
                    label: {
                        show: true,
                        position: type === 'bar' ? 'right' : 'top',
                        fontSize: settings.labelFontSize,
                        fontWeight: settings.labelBold ? 'bold' : 'normal',
                    },
                },
            ];
        }

        const option = {
            backgroundColor: settings.backgroundColor,
            tooltip: tooltipConfig,
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
            xAxis: xAxisConfig,
            yAxis: {
                type: 'category',
                data: categories,
                axisLabel: {
                    fontSize: settings.axisFontSize,
                    fontWeight: settings.axisBold ? 'bold' : 'normal',
                },
                axisTick: { show: false }
            },
            series: series,
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

        // true 옵션을 주어 이전 옵션(축 설정 등)과 병합되지 않고 완전히 새로 그리도록 설정
        chart.setOption(option, true);

        const handleResize = () => {
            chart.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data, settings]);

    // ... 하단 메모리 해제 및 렌더링 부분은 기존과 동일
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