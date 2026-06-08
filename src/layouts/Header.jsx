import React from 'react'
import macImg from '../assets/mac.png';
import { useLocation, useNavigate } from 'react-router-dom';

function Header() {
    const { pathname } = useLocation();
    console.log(pathname)

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/`)
    }
    return (
        <div className='header'>
            <img src={macImg} alt="mac" onClick={handleClick} />
            <h2>MAC</h2>
            <p style={{ position: 'absolute', justifySelf: 'right', marginRight: 20 }} onClick={()=>{navigate('/login')}} onMouseOver={{cursor:'pointer'}}>
                {pathname === '/' ? '로그인' : ''}
            </p>
        </div>
    )
}

export default Header
