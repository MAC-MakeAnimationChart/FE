import React, { useState } from 'react'

function ChartView() {

    // ===== 상태 관리 =====
    const [topN, setTopN] = useState(10)

    const [chartColor, setChartColor] = useState('#3498db')
    const [backgroundColor, setBackgroundColor] = useState('#ffffff')

    const [barThickness, setBarThickness] = useState(20)
    const [barGap, setBarGap] = useState(10)

    const [fontSize, setFontSize] = useState(14)
    const [isBold, setIsBold] = useState(false)

    const [legendOn, setLegendOn] = useState(true)
    const [legendFontSize, setLegendFontSize] = useState(12)
    const [legendBold, setLegendBold] = useState(false)

    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [titleSize, setTitleSize] = useState(20)
    const [subtitleSize, setSubtitleSize] = useState(16)

    const [footer, setFooter] = useState('')

    const [csvData, setCsvData] = useState(null)

    // ===== 파일 업로드 =====
    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setCsvData(event.target.result)
        }
        reader.readAsText(file)
    }

    return (
        <div className='chart-view' style={{ display: 'grid', gridTemplateColumns: "7fr 3fr ", height: "70vh" }}>

            {/* ===== 왼쪽 차트 영역 ===== */}
            <div
                className='chart-view-left'
                style={{
                    border: '1px solid black',
                    backgroundColor: backgroundColor,
                    padding: '10px'
                }}
            >
                <h2 style={{ fontSize: titleSize }}>{title || '대제목'}</h2>
                <h4 style={{ fontSize: subtitleSize }}>{subtitle || '중제목'}</h4>

                <div style={{ marginTop: '20px' }}>
                    차트 그림이 위치할 자리
                </div>

                <div style={{ position: 'absolute', bottom: '10px' }}>
                    {footer && <small>출처: {footer}</small>}
                </div>
            </div>

            {/* ===== 오른쪽 설정 패널 ===== */}
            <div className='chart-view-right' style={{ border: '1px solid black', padding: '10px', overflowY: 'scroll' }}>

                <h3>설정 패널</h3>

                {/* Top N */}
                <div>
                    <label>Top N</label>
                    <input type="number" value={topN} onChange={(e) => setTopN(e.target.value)} />
                </div>

                {/* 차트 컬러 */}
                <div>
                    <label>차트 색상</label>
                    <input type="color" value={chartColor} onChange={(e) => setChartColor(e.target.value)} />
                </div>

                {/* 배경 색 */}
                <div>
                    <label>배경 색상</label>
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                </div>

                {/* 바 설정 */}
                <div>
                    <label>바 두께</label>
                    <input type="number" value={barThickness} onChange={(e) => setBarThickness(e.target.value)} />
                </div>

                <div>
                    <label>바 간격</label>
                    <input type="number" value={barGap} onChange={(e) => setBarGap(e.target.value)} />
                </div>

                {/* 글자 */}
                <div>
                    <label>글자 크기</label>
                    <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
                </div>

                <div>
                    <label>볼드</label>
                    <input type="checkbox" checked={isBold} onChange={() => setIsBold(!isBold)} />
                </div>

                {/* legend */}
                <div>
                    <label>범례 표시</label>
                    <input type="checkbox" checked={legendOn} onChange={() => setLegendOn(!legendOn)} />
                </div>

                <div>
                    <label>범례 글자 크기</label>
                    <input type="number" value={legendFontSize} onChange={(e) => setLegendFontSize(e.target.value)} />
                </div>

                <div>
                    <label>범례 볼드</label>
                    <input type="checkbox" checked={legendBold} onChange={() => setLegendBold(!legendBold)} />
                </div>

                {/* 제목 */}
                <div>
                    <label>대제목</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                    <label>대제목 크기</label>
                    <input type="number" value={titleSize} onChange={(e) => setTitleSize(e.target.value)} />
                </div>

                <div>
                    <label>중제목</label>
                    <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </div>

                <div>
                    <label>중제목 크기</label>
                    <input type="number" value={subtitleSize} onChange={(e) => setSubtitleSize(e.target.value)} />
                </div>

                {/* Footer */}
                <div>
                    <label>출처</label>
                    <input type="text" value={footer} onChange={(e) => setFooter(e.target.value)} />
                </div>

                {/* CSV 업로드 */}
                <div>
                    <label>CSV 업로드</label>
                    <input type="file" accept=".csv" onChange={handleFileUpload} />
                </div>

                {/* CSV 미리보기 */}
                <div>
                    <label>데이터 미리보기</label>
                    <textarea
                        style={{ width: '100%', height: '100px' }}
                        value={csvData || ''}
                        readOnly
                    />
                </div>

                {/* JPG 추출 (프로토타입 버튼) */}
                <div>
                    <button>JPG로 추출</button>
                </div>

            </div>
        </div>
    )
}

export default ChartView