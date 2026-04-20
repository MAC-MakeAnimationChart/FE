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
        const chartType = settings.chartType || 'bar';

        let option = {};

        // 🚀 차트 타입 분기 처리
        if (chartType === 'grid_column') {
            // 1. 그룹화 기준 컬럼 설정 (사용자가 지정하지 않으면 카테고리 자체로 분할)
            const groupCol = settings.groupByColumn || settings.categoryColumn;

            // 2. 고유 그룹 추출
            const groups = [...new Set(data.map(d => String(d[groupCol])))];

            // 3. 그리드 레이아웃 계산 (최대 3열 기준으로 행 계산)
            const cols = 3;
            const rows = Math.ceil(groups.length / cols);

            const grids = [];
            const xAxes = [];
            const yAxes = [];
            const series = [];
            const titles = [];

            groups.forEach((group, idx) => {
                // 해당 그룹의 데이터만 필터링 후 상위 N개 자르기
                const groupData = data
                    .filter(d => String(d[groupCol]) === group)
                    .slice(0, settings.topN);

                // 그리드 위치 계산 (행/열 인덱스 기반 수학적 배치)
                const row = Math.floor(idx / cols);
                const col = idx % cols;

                const left = `${(col * 100) / cols + 5}%`;
                const top = `${(row * 100) / rows + 20}%`; // 글로벌 타이틀을 위해 여백 확보
                const width = `${100 / cols - 15}%`;
                const height = `${100 / rows - 30}%`;

                // 개별 그리드 영역
                grids.push({ left, top, width, height, containLabel: true });

                // 세로 막대를 위한 X축 (카테고리)
                xAxes.push({
                    type: 'category',
                    gridIndex: idx,
                    data: groupData.map(d => String(d[settings.categoryColumn])),
                    axisLabel: {
                        fontSize: settings.axisFontSize ? Math.max(8, settings.axisFontSize - 2) : 10
                    },
                    axisTick: { show: false }
                });

                // 세로 막대를 위한 Y축 (값)
                yAxes.push({
                    type: 'value',
                    gridIndex: idx,
                    axisLabel: {
                        fontSize: settings.axisFontSize ? Math.max(8, settings.axisFontSize - 2) : 10
                    },
                });

                // 개별 데이터 시리즈
                series.push({
                    type: 'bar',
                    xAxisIndex: idx,
                    yAxisIndex: idx,
                    data: groupData.map(d => Number(d[settings.valueColumn]) || 0),
                    itemStyle: {
                        color: settings.barColor,
                        opacity: settings.barOpacity / 100,
                    },
                    label: {
                        show: true,
                        position: 'top', // 세로 막대이므로 라벨은 위로
                        fontSize: settings.labelFontSize ? Math.max(8, settings.labelFontSize - 2) : 10,
                    },
                });

                // 개별 차트의 소제목
                titles.push({
                    textAlign: 'center',
                    text: group,
                    left: `${(col * 100) / cols + (100 / cols) / 2}%`,
                    top: `${(row * 100) / rows + 12}%`,
                    textStyle: {
                        fontSize: settings.subTitleFontSize || 12,
                        fontWeight: 'bold',
                        color: '#444'
                    }
                });
            });

            option = {
                backgroundColor: settings.backgroundColor,
                title: [
                    {
                        text: settings.mainTitle,
                        left: settings.mainTitlePosition,
                        top: 10,
                        textStyle: {
                            fontSize: settings.mainTitleFontSize,
                            fontWeight: settings.mainTitleBold ? 'bold' : 'normal',
                            color: '#333',
                        },
                    },
                    ...titles // 개별 그리드 타이틀 병합
                ],
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: grids,
                xAxis: xAxes,
                yAxis: yAxes,
                series: series,
                // 격자형 그래프에서는 데이터 소스 라벨이 레이아웃을 해칠 수 있어 하단에 고정
                graphic: settings.dataSource ? [{
                    type: 'text',
                    left: 'center',
                    bottom: 10,
                    style: { text: settings.dataSource, fontSize: settings.sourceFontSize, fill: '#999' }
                }] : [],
            };

        } else {
            // 📊 기존 일반 가로 막대 그래프 로직 (차트 타입이 'bar' 등일 때)
            const filteredData = data.slice(0, settings.topN).map(row => ({
                category: String(row[settings.categoryColumn]),
                value: Number(row[settings.valueColumn]) || 0
            }));

            option = {
                backgroundColor: settings.backgroundColor,
                title: [
                    { text: settings.mainTitle, left: settings.mainTitlePosition, top: 20, textStyle: { fontSize: settings.mainTitleFontSize, fontWeight: settings.mainTitleBold ? 'bold' : 'normal', color: '#333' } },
                    { text: settings.subTitle, left: settings.subTitlePosition, top: settings.mainTitle ? settings.mainTitleFontSize + 35 : 20, textStyle: { fontSize: settings.subTitleFontSize, fontWeight: settings.subTitleBold ? 'bold' : 'normal', color: '#666' } }
                ],
                grid: { left: '10%', right: '10%', top: settings.mainTitle || settings.subTitle ? 100 : 60, bottom: settings.dataSource ? 80 : 60, containLabel: true },
                xAxis: { type: 'value', axisLabel: { fontSize: settings.axisFontSize, fontWeight: settings.axisBold ? 'bold' : 'normal' } },
                yAxis: { type: 'category', data: filteredData.map(d => d.category), axisLabel: { fontSize: settings.axisFontSize, fontWeight: settings.axisBold ? 'bold' : 'normal' } },
                series: [{
                    type: chartType, // 'bar'로 고정하지 않고 동적 할당
                    data: filteredData.map(d => d.value),
                    itemStyle: { color: settings.barColor, opacity: settings.barOpacity / 100 },
                    barWidth: settings.barWidth ? `${settings.barWidth}%` : 'auto',
                    barGap: settings.barGap,
                    label: { show: true, position: 'right', fontSize: settings.labelFontSize, fontWeight: settings.labelBold ? 'bold' : 'normal' },
                }],
                legend: { show: settings.showLegend, bottom: settings.dataSource ? 50 : 20 },
                graphic: settings.dataSource ? [{ type: 'text', left: 'center', bottom: 10, style: { text: settings.dataSource, fontSize: settings.sourceFontSize, fill: '#999' } }] : [],
            };
        }

        // true (notMerge 옵션)를 추가하여 차트 타입 변경 시 이전 설정(축, 그리드 등)이 남아 레이아웃이 꼬이는 것을 방지합니다.
        chart.setOption(option, true);

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [data, settings]);

    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    // ... (이하 로딩 상태 표시 등 기존 UI 렌더링 코드 유지)
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