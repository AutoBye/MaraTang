document.addEventListener('DOMContentLoaded', function() {

    const userInfo = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const loginContainer = document.getElementById('login-container');


    // 세션에서 username 가져오기
    fetch('/session-info')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userNameSpan.innerText = data.username;
                userInfo.style.display = 'block';
            } else {
                userInfo.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('세션 정보 가져오기 중 오류 발생:', error);
        });



    logoutBtn.addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('userName');
                    userNameSpan.style.display = 'none';
                    userInfo.style.display = 'none';
                    window.location.href = '/index';
                }
            })
            .catch(error => {
                console.error('로그아웃 요청 중 오류 발생:', error);
            });
    });



});