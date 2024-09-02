document.addEventListener('DOMContentLoaded', function() {
    const communityList = document.getElementById('community-list');
    const createForm = document.getElementById('create-community-form');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');


    fetch('/session-info')
        .then(response => response.text())
        .then(text => {
            console.log('Response Text:', text);
            try {
                const data = JSON.parse(text);  // 직접 JSON으로 파싱 시도
                if (data.success && data.username) {
                    userNameSpan.innerText = data.username;
                    userInfo.style.display = 'flex';
                } else {
                    userInfo.style.display = 'none';
                }
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
                userInfo.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('세션 정보 가져오기 중 오류 발생:', error);
            userInfo.style.display = 'none';
        });



    // 커뮤니티 목록 로드
    fetch('/community')
        .then(response => response.json())
        .then(data => {
            communityList.innerHTML = '';
            data.forEach(community => {
                const div = document.createElement('div');
                div.textContent = community.name;
                communityList.appendChild(div);
            });
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
