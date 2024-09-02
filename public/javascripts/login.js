document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.getElementById('login-container');
    const userInfo = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userId = document.getElementById('newId').value;
        const password = document.getElementById('newPassword').value;

        if (userId && password) {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, password: password }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = data.redirectUrl;
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('로그인 요청 중 오류 발생:', error);
                    errorMessage.textContent = '로그인 중 오류가 발생했습니다.';
                    errorMessage.style.display = 'block';
                });
        } else {
            errorMessage.textContent = 'ID와 비밀번호를 모두 입력해주세요.';
            errorMessage.style.display = 'block';
        }
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
                    loginContainer.style.display = 'block';
                    userInfo.style.display = 'none';
                    window.location.href = '/index';
                }
            })
            .catch(error => {
                console.error('로그아웃 요청 중 오류 발생:', error);
            });
    });
});