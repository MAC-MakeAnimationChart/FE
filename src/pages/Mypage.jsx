import React from 'react'
import { useSearchParams } from 'react-router-dom'

function Mypage() {

    const [searchParams] = useSearchParams();
    console.log(searchParams.get('userId'))

    return (
        <>
            마이페이지
        </>
    )
}

export default Mypage
