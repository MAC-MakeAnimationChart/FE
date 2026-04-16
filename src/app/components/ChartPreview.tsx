import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

type ChartData = { [key: string]: string | number };

interface ChartSettings {
  chartType: 'bar' | 'scatter' | 'bubble' | 'animated-scatter';

  // shared
  categoryColumn: string;
  valueColumn: string;
  topN: number;
  backgroundColor: string;

  // titles
  mainTitle: string;
  mainTitlePosition: string;
  mainTitleFontSize: number;
  mainTitleBold: boolean;
  subTitle: string;
  subTitlePosition: string;
  subTitleFontSize: number;
  subTitleBold: boolean;

  // axis
  axisFontSize: number;
  axisBold: boolean;

  // labels
  labelFontSize: number;
  labelBold: boolean;

  // legend
  showLegend: boolean;
  legendFontSize: number;
  legendBold: boolean;

  // source note
  dataSource: string;
  sourceFontSize: number;

  // bar-specific
  barColor: string;
  barOpacity: number;
  barWidth: number;
  barGap: string;

  // scatter / bubble / animated-scatter specific
  xColumn: string;        // x-axis column (numeric)
  yColumn: string;        // y-axis column (numeric)
  sizeColumn: string;     // bubble size column (numeric, optional)
  colorColumn: string;    // colour-group column (categorical, optional)
  timeColumn: string;     // animation frame column (for animated-scatter)
  pointColor: string;     // default point color when no colorColumn
  pointSize: number;      // base symbol size
  pointOpacity: number;   // 0-100
}

// ─── colour palette for multi-series ───────────────────────────────────────
const PALETTE = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666',
  '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',
];

// ─── helpers ────────────────────────────────────────────────────────────────
function toNum(v: string | number): number {
  return Number(v) || 0;
}

function getGroupedSeries(
  data: ChartData[],
  xCol: string,
  yCol: string,
  sizeCol: string,
  colorCol: string,
  pointSize: number,
  pointOpacity: number,
  topN: number,
  isBubble: boolean,
): echarts.SeriesOption[] {
  const subset = data.slice(0, topN || data.length);

  if (!colorCol) {
    // single series
    const points = subset.map(row => {
      const base = [toNum(row[xCol]), toNum(row[yCol])];
      if (isBubble) base.push(toNum(row[sizeCol]) || pointSize);
      return base;
    });

    return [{
      type: 'scatter',
      symbolSize: isBubble
        ? (val: number[]) => Math.sqrt(Math.abs(val[2])) * 3
        : pointSize,
      data: points,
      itemStyle: { opacity: pointOpacity / 100 },
      label: { show: false },
    }];
  }

  // group by colorColumn
  const groups: Record<string, number[][]> = {};
  subset.forEach(row => {
    const key = String(row[colorCol] ?? 'other');
    if (!groups[key]) groups[key] = [];
    const pt = [toNum(row[xCol]), toNum(row[yCol])];
    if (isBubble) pt.push(toNum(row[sizeCol]) || pointSize);
    groups[key].push(pt);
  });

  return Object.entries(groups).map(([name, pts], i) => ({
    name,
    type: 'scatter',
    symbolSize: isBubble
      ? (val: number[]) => Math.sqrt(Math.abs(val[2])) * 3
      : pointSize,
    data: pts,
    itemStyle: { color: PALETTE[i % PALETTE.length], opacity: pointOpacity / 100 },
    label: { show: false },
  }));
}

function buildScatterOption(
  data: ChartData[],
  settings: ChartSettings,
): echarts.EChartsOption {
  const { xColumn, yColumn, sizeColumn, colorColumn, pointColor, pointSize, pointOpacity, topN } = settings;
  const isBubble = settings.chartType === 'bubble';

  const series = getGroupedSeries(
    data, xColumn, yColumn, sizeColumn, colorColumn,
    pointSize, pointOpacity, topN, isBubble,
  );

  // if no colorColumn set the single series colour
  if (!colorColumn && series.length === 1) {
    (series[0] as any).itemStyle = {
      color: pointColor,
      opacity: pointOpacity / 100,
    };
  }

  return {
    backgroundColor: settings.backgroundColor,
    title: buildTitles(settings),
    grid: buildGrid(settings),
    tooltip: { trigger: 'item', formatter: (p: any) => {
      const v = p.value as number[];
      if (isBubble) return `x: ${v[0]}<br/>y: ${v[1]}<br/>size: ${v[2]}`;
      return `x: ${v[0]}<br/>y: ${v[1]}`;
    }},
    xAxis: {
      type: 'value',
      name: xColumn,
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    yAxis: {
      type: 'value',
      name: yColumn,
      nameLocation: 'middle',
      nameGap: 40,
      axisLabel: {
        fontSize: settings.axisFontSize,
        fontWeight: settings.axisBold ? 'bold' : 'normal',
      },
    },
    legend: buildLegend(settings),
    graphic: buildGraphic(settings),
    series,
  };
}

// ─── animated scatter ────────────────────────────────────────────────────────
function buildAnimatedScatterOption(
  data: ChartData[],
  settings: ChartSettings,
): { option: echarts.EChartsOption; frames: string[] } {
  const { xColumn, yColumn, sizeColumn, colorColumn, timeColumn, pointSize, pointOpacity } = settings;

  // collect ordered frames
  const frameSet = new Set<string>();
  data.forEach(row => frameSet.add(String(row[timeColumn] ?? '')));
  const frames = Array.from(frameSet).sort();

  // build per-frame series
  function frameData(frame: string): echarts.SeriesOption[] {
    const subset = data.filter(row => String(row[timeColumn]) === frame);
    return getGroupedSeries(
      subset, xColumn, yColumn, sizeColumn, colorColumn,
      pointSize, pointOpacity, subset.length, true,
    );
  }

  // Use first frame as initial option; timeline extension handles the rest
  const option: echarts.EChartsOption = {
    backgroundColor: settings.backgroundColor,
    baseOption: {
      timeline: {
        axisType: 'category',
        autoPlay: true,
        playInterval: 1000,
        data: frames,
        label: {
          fontSize: 12,
          color: '#666',
        },
      },
      title: buildTitles(settings),
      grid: buildGrid(settings),
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'value',
        name: xColumn,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          fontSize: settings.axisFontSize,
          fontWeight: settings.axisBold ? 'bold' : 'normal',
        },
      },
      yAxis: {
        type: 'value',
        name: yColumn,
        nameLocation: 'middle',
        nameGap: 40,
        axisLabel: {
          fontSize: settings.axisFontSize,
          fontWeight: settings.axisBold ? 'bold' : 'normal',
        },
      },
      legend: buildLegend(settings),
      graphic: buildGraphic(settings),
      series: frameData(frames[0] ?? ''),
    },
    options: frames.map(f => ({ series: frameData(f) })),
  };

  return { option, frames };
}

// ─── shared option builders ──────────────────────────────────────────────────
function buildTitles(settings: ChartSettings): echarts.TitleComponentOption[] {
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

function buildGrid(settings: ChartSettings): echarts.GridComponentOption {
  return {
    left: '10%',
    right: '10%',
    top: settings.mainTitle || settings.subTitle ? 100 : 60,
    bottom: settings.dataSource ? 80 : 60,
    containLabel: true,
  };
}

function buildLegend(settings: ChartSettings): echarts.LegendComponentOption {
  return {
    show: settings.showLegend,
    bottom: settings.dataSource ? 50 : 20,
    textStyle: {
      fontSize: settings.legendFontSize,
      fontWeight: settings.legendBold ? 'bold' : 'normal',
    },
  };
}

function buildGraphic(settings: ChartSettings): echarts.GraphicComponentOption[] {
  if (!settings.dataSource) return [];
  return [{
    type: 'text',
    left: 'center',
    bottom: 10,
    style: {
      text: settings.dataSource,
      fontSize: settings.sourceFontSize,
      fill: '#999',
    },
  }];
}

// ─── bar option (original logic preserved) ───────────────────────────────────
function buildBarOption(data: ChartData[], settings: ChartSettings): echarts.EChartsOption {
  const filteredData = data
    .slice(0, settings.topN)
    .map(row => ({
      category: String(row[settings.categoryColumn]),
      value: toNum(row[settings.valueColumn]),
    }));

  const categories = filteredData.map(d => d.category);
  const values = filteredData.map(d => d.value);

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
    series: [{
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
    }],
    legend: buildLegend(settings),
    graphic: buildGraphic(settings),
  };
}

// ─── empty-state helpers ─────────────────────────────────────────────────────
function MissingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export function ChartPreview({ data, settings }: { data: ChartData[]; settings: ChartSettings }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const isScatterFamily =
      settings.chartType === 'scatter' ||
      settings.chartType === 'bubble' ||
      settings.chartType === 'animated-scatter';

    const isBar = settings.chartType === 'bar' || !settings.chartType;

    // Guard: bar needs categoryColumn + valueColumn
    if (isBar && (!settings.categoryColumn || !settings.valueColumn)) return;

    // Guard: scatter family needs xColumn + yColumn
    if (isScatterFamily && (!settings.xColumn || !settings.yColumn)) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    let option: echarts.EChartsOption;

    if (isBar) {
      option = buildBarOption(data, settings);
    } else if (settings.chartType === 'animated-scatter') {
      const { option: animOpt } = buildAnimatedScatterOption(data, settings);
      option = animOpt;
    } else {
      option = buildScatterOption(data, settings);
    }

    chart.setOption(option, true);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data, settings]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  // ── render guards ────────────────────────────────────────────────────────
  if (data.length === 0) {
    return <MissingState message="데이터를 업로드하면 차트가 표시됩니다" />;
  }

  const isBar = settings.chartType === 'bar' || !settings.chartType;
  const isScatterFamily =
    settings.chartType === 'scatter' ||
    settings.chartType === 'bubble' ||
    settings.chartType === 'animated-scatter';

  if (isBar && (!settings.categoryColumn || !settings.valueColumn)) {
    return <MissingState message="차트 설정에서 카테고리와 값 컬럼을 선택하세요" />;
  }

  if (isScatterFamily && (!settings.xColumn || !settings.yColumn)) {
    return <MissingState message="차트 설정에서 X축과 Y축 컬럼을 선택하세요" />;
  }

  return (
    <div className="h-full w-full bg-white rounded-lg">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
}
