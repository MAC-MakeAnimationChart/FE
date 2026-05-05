import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function WorkSpace() {
    const [userInfo, setUserInfo] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        // 로그인 정보 받아오면 되는데, 있는 버전으로 테스트할거면 아래false를 true로 바꾸셔라
        setUserInfo(true)
    }, [])

    if (!userInfo) return (<>
        <div> 로그인 정보가 없습니다.</div>
        <button onClick={() => navigate('/login')}>로그인하기</button>
    </>
    )

    return (
        <>
            <button onClick={() => navigate('/')}>홈으로 가기</button>
            <h1>WorkSpace</h1>
            <hr />
            <h2>내 작업물</h2>
            <div style={{ border: '1px solid black', width: '30%', height: "100px" }}>예시 한개</div>
            <button onClick={() => navigate('/maker')}>작업하러 가기</button>
        </>
    )
}

export default WorkSpace