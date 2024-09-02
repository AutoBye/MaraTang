document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.createElement('div');
    errorMessage.style.color = 'red';
    errorMessage.style.marginBottom = '10px';
    signupForm.prepend(errorMessage);

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('newusername').value;
        const id = document.getElementById('newId').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('newEmail').value;

        if (password !== confirmPassword) {
            errorMessage.textContent = '비밀번호가 일치하지 않습니다.';
            errorMessage.style.display = 'block';
            return;
        }

        // 위치 정보를 가져와 폼 데이터를 서버로 전송
        navigator.geolocation.getCurrentPosition(function(position) {
            const location = `${position.coords.latitude}, ${position.coords.longitude}`;

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, id, password, email, location }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = '/index';
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('회원가입 요청 중 오류 발생:', error);
                    errorMessage.textContent = '회원가입 중 오류가 발생했습니다.';
                    errorMessage.style.display = 'block';
                });
        }, function(error) {
            console.error('위치 정보를 가져오는데 실패했습니다:', error);
            errorMessage.textContent = '위치 정보를 가져올 수 없습니다.';
            errorMessage.style.display = 'block';
        });
    });
});
