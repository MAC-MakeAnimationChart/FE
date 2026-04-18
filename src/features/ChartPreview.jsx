import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// ─────────────────────────────────────────────
// 데이터 변환 헬퍼 함수들
// ─────────────────────────────────────────────

/**
 * 누적/비중 영역 차트용 데이터 변환
 * CSV 구조: categoryColumn(X축) + 여러 valueColumns(각 시리즈)
 *
 * 예) { "월": "1월", "서울": 120, "부산": 80, "대구": 60 }
 *     categoryColumn = "월"
 *     seriesColumns   = ["서울", "부산", "대구"]
 */
function buildAreaSeriesData(data, settings) {
  const { categoryColumn, seriesColumns = [], topN } = settings;

  const sliced = data.slice(0, topN || data.length);
  const xCategories = sliced.map((row) => String(row[categoryColumn] ?? ''));

  // seriesColumns 미지정 시 categoryColumn 제외한 나머지 모두 사용
  const cols =
    seriesColumns.length > 0
      ? seriesColumns
      : Object.keys(data[0] || {}).filter((k) => k !== categoryColumn);

  const series = cols.map((col) => ({
    name: col,
    values: sliced.map((row) => Number(row[col]) || 0),
  }));

  return { xCategories, series };
}

/**
 * 범주형 히트맵용 데이터 변환
 * CSV 구조: xColumn(X축 범주) + yColumn(Y축 범주) + valueColumn(셀 값)
 *
 * 예) { "요일": "월", "시간대": "오전", "건수": 34 }
 *     xColumn = "요일", yColumn = "시간대", valueColumn = "건수"
 */
function buildHeatmapData(data, settings) {
  const { xColumn, yColumn, valueColumn } = settings;

  const xSet = [...new Set(data.map((r) => String(r[xColumn] ?? '')))];
  const ySet = [...new Set(data.map((r) => String(r[yColumn] ?? '')))];

  const points = data.map((row) => [
    xSet.indexOf(String(row[xColumn] ?? '')),
    ySet.indexOf(String(row[yColumn] ?? '')),
    Number(row[valueColumn]) || 0,
  ]);

  const values = points.map((p) => p[2]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  return { xCategories: xSet, yCategories: ySet, points, minVal, maxVal };
}

// ─────────────────────────────────────────────
// 차트 옵션 빌더들
// ─────────────────────────────────────────────

function buildBarOption(data, settings) {
  const filteredData = data
    .slice(0, settings.topN)
    .map((row) => ({
      category: String(row[settings.categoryColumn]),
      value: Number(row[settings.valueColumn]) || 0,
    }));

  const categories = filteredData.map((d) => d.category);
  const values = filteredData.map((d) => d.value);

  return {
    backgroundColor: settings.backgroundColor,
    title: buildTitles(settings),
    grid: buildGrid(settings),
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
    legend: buildLegend(settings),
    graphic: buildGraphic(settings),
  };
}

function buildAreaStackedOption(data, settings) {
  const { xCategories, series } = buildAreaSeriesData(data, settings);
  const colors = settings.seriesColors || defaultSeriesColors(series.length);

  return {
    backgroundColor: settings.backgroundColor,
    title: buildTitles(settings),
    grid: buildGrid(settings),
    xAxis: {
      type: 'category',
      data: xCategories,
      boundaryGap: false,
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'line',
      stack: 'total',
      areaStyle: { opacity: (settings.barOpacity ?? 80) / 100 },
      smooth: settings.smooth ?? true,
      emphasis: { focus: 'series' },
      data: s.values,
      itemStyle: { color: colors[i % colors.length] },
      label: {
        show: settings.showLabel ?? false,
        fontSize: settings.labelFontSize,
        fontWeight: settings.labelBold ? 'bold' : 'normal',
      },
    })),
    legend: buildLegend(settings),
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    graphic: buildGraphic(settings),
  };
}

function buildAreaProportionalOption(data, settings) {
  const { xCategories, series } = buildAreaSeriesData(data, settings);
  const colors = settings.seriesColors || defaultSeriesColors(series.length);

  // 각 X 지점에서 합계 계산 후 비율로 변환
  const totals = xCategories.map((_, xi) =>
    series.reduce((sum, s) => sum + (s.values[xi] || 0), 0)
  );

  const normalizedSeries = series.map((s) => ({
    ...s,
    values: s.values.map((v, xi) =>
      totals[xi] === 0 ? 0 : parseFloat(((v / totals[xi]) * 100).toFixed(2))
    ),
  }));

  return {
    backgroundColor: settings.backgroundColor,
    title: buildTitles(settings),
    grid: buildGrid(settings),
    xAxis: {
      type: 'category',
      data: xCategories,
      boundaryGap: false,
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    series: normalizedSeries.map((s, i) => ({
      name: s.name,
      type: 'line',
      stack: 'total',
      areaStyle: { opacity: (settings.barOpacity ?? 80) / 100 },
      smooth: settings.smooth ?? true,
      emphasis: { focus: 'series' },
      data: s.values,
      itemStyle: { color: colors[i % colors.length] },
      label: {
        show: settings.showLabel ?? false,
        formatter: '{c}%',
        fontSize: settings.labelFontSize,
        fontWeight: settings.labelBold ? 'bold' : 'normal',
      },
    })),
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      valueFormatter: (v) => `${v}%`,
    },
    legend: buildLegend(settings),
    graphic: buildGraphic(settings),
  };
}

function buildHeatmapOption(data, settings) {
  const { xCategories, yCategories, points, minVal, maxVal } =
    buildHeatmapData(data, settings);

  const heatColor = settings.heatmapHighColor || '#c23531';

  return {
    backgroundColor: settings.backgroundColor,
    title: buildTitles(settings),
    grid: {
      ...buildGrid(settings),
      // 히트맵은 좌우 여유를 더 줌
      left: '15%',
      right: '10%',
    },
    xAxis: {
      type: 'category',
      data: xCategories,
      splitArea: { show: true },
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    yAxis: {
      type: 'category',
      data: yCategories,
      splitArea: { show: true },
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    visualMap: {
      min: minVal,
      max: maxVal,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: settings.dataSource ? 50 : 20,
      inRange: {
        color: ['#f0f0f0', heatColor],
      },
      textStyle: { fontSize: settings.axisFontSize || 12 },
    },
    series: [
      {
        type: 'heatmap',
        data: points,
        label: {
          show: settings.showLabel ?? true,
          fontSize: settings.labelFontSize,
          fontWeight: settings.labelBold ? 'bold' : 'normal',
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
        },
      },
    ],
    tooltip: {
      position: 'top',
      formatter: (p) => {
        const x = xCategories[p.data[0]];
        const y = yCategories[p.data[1]];
        return `${x} / ${y}: <b>${p.data[2]}</b>`;
      },
    },
    graphic: buildGraphic(settings),
  };
}

// ─────────────────────────────────────────────
// 공통 헬퍼
// ─────────────────────────────────────────────

function buildTitles(settings) {
  return [
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
  ];
}

function buildGrid(settings) {
  return {
    left: '10%',
    right: '10%',
    top: settings.mainTitle || settings.subTitle ? 100 : 60,
    bottom: settings.dataSource ? 80 : 60,
    containLabel: true,
  };
}

function buildLegend(settings) {
  return {
    show: settings.showLegend,
    bottom: settings.dataSource ? 50 : 20,
    textStyle: {
      fontSize: settings.legendFontSize,
      fontWeight: settings.legendBold ? 'bold' : 'normal',
    },
  };
}

function buildGraphic(settings) {
  return settings.dataSource
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
    : [];
}

/** 기본 시리즈 색상 팔레트 */
function defaultSeriesColors(n) {
  const palette = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
  ];
  return Array.from({ length: n }, (_, i) => palette[i % palette.length]);
}

// ─────────────────────────────────────────────
// 유효성 검사: 차트 타입별 필수 필드
// ─────────────────────────────────────────────

function getMissingFieldMessage(chartType, settings) {
  switch (chartType) {
    case 'bar':
      if (!settings.categoryColumn || !settings.valueColumn)
        return '차트 설정에서 카테고리와 값 컬럼을 선택하세요';
      return null;

    case 'area-stacked':
    case 'area-proportional':
      if (!settings.categoryColumn)
        return '차트 설정에서 X축(카테고리) 컬럼을 선택하세요';
      return null;

    case 'heatmap-categorical':
      if (!settings.xColumn || !settings.yColumn || !settings.valueColumn)
        return '히트맵 설정에서 X축, Y축, 값 컬럼을 모두 선택하세요';
      return null;

    default:
      return null;
  }
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────

export function ChartPreview({ data, settings }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const chartType = settings.chartType || 'bar';

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    if (getMissingFieldMessage(chartType, settings)) return;

    if (!chartInstanceRef.current) {
    chartInstanceRef.current = echarts.init(chartRef.current, null, {
        width: chartRef.current.offsetWidth || 600,
        height: chartRef.current.offsetHeight || 500,
    });
}

    const chart = chartInstanceRef.current;

    let option;
    try {
      switch (chartType) {
        case 'area-stacked':
          option = buildAreaStackedOption(data, settings);
          break;
        case 'area-proportional':
          option = buildAreaProportionalOption(data, settings);
          break;
        case 'heatmap-categorical':
          option = buildHeatmapOption(data, settings);
          break;
        case 'bar':
        default:
          option = buildBarOption(data, settings);
          break;
      }
    } catch (err) {
      console.error('[ChartPreview] 옵션 생성 오류:', err);
      return;
    }

    chart.setOption(option, true); // true = 이전 옵션 완전 교체

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, settings, chartType]);

  // 언마운트 시 인스턴스 정리
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // ── 빈 데이터 상태 ──
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">데이터를 업로드하면 차트가 표시됩니다</p>
      </div>
    );
  }

  // ── 필드 미선택 상태 ──
  const missingMsg = getMissingFieldMessage(chartType, settings);
  if (missingMsg) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <p className="text-gray-500">{missingMsg}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '500px', backgroundColor: 'white', borderRadius: '8px' }}>
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
);
}
