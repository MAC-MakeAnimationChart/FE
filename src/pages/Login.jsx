import React, { useState } from 'react'

function Login() {

    const [user, setUser] = useState({
        userId: '',
        userPwd: ''
    });

    const handleUser = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    return (
        <>
            <div>
                <h1>로그인</h1>
                <label htmlFor="userId">ID : </label>
                <input
                    type="text"
                    name='userId'
                    id='userId'
                    value={user.userId}
                    onChange={handleUser}
                    placeholder='ID를 입력하세요'
                /><br />
                <label htmlFor="userPwd">PWD : </label>
                <input
                    type="password"
                    name='userPwd'
                    id='userPwd'
                    value={user.userPwd}
                    onChange={handleUser}
                    placeholder='비밀번호를 입력하세요' />
                <br /><button>로그인</button>
            </div>
        </>
    )
}

export default Login
