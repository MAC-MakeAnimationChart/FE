import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChartData from '../../components/ChartData';
import ChartView from '../../components/ChartView';

function ChartMaker() {

    const [navSelect, setNavSelect] = useState([true, false])

    const navigate = useNavigate();
    return (
        <>
            <div className='chart-make-head' style={{ display: 'flex', flexDirection: "row", gap: '5px' }}>
                <h1>Chart Maker</h1>
                <button onClick={() => navigate('/')}>홈으로 가기</button>
                <button onClick={() => navigate('/login')}>로그아웃</button>
            </div>
            <div className='chart-make-nav'>
                <button onClick={() => setNavSelect([true, false])}>차트 보기</button>
                <button onClick={() => setNavSelect([false, true])}>데이터 보기</button>
            </div>
            <div className='chart-make-main'>
                {navSelect[1] ? (
                    <ChartData />
                ) : (
                    <ChartView />
                )}
            </div>
        </>
    )
}

export default ChartMaker
