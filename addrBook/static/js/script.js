document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('photo');
    const preview = document.querySelector('.file-preview');
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const switchInputBtn = document.getElementById('switch-input-btn');
    let isUsingWebcam = false;
    let stream = null;

    // 웹캠/파일 입력 전환
    switchInputBtn.style.display = 'inline-block';
    switchInputBtn.addEventListener('click', toggleInput);

    async function toggleInput() {
        isUsingWebcam = !isUsingWebcam;
        if (isUsingWebcam) {
            fileInput.style.display = 'none';
            video.style.display = 'block';
            captureBtn.style.display = 'inline-block';
            preview.innerHTML = '';
            await startWebcam();
        } else {
            stopWebcam();
            fileInput.style.display = 'block';
            video.style.display = 'none';
            captureBtn.style.display = 'none';
        }
    }

    // 웹캠 시작
    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            console.error('웹캠 접근 오류:', err);
        }
    }

    // 웹캠 정지
    function stopWebcam() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    }

    // 사진 촬영
    captureBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        preview.innerHTML = `<img src="${imageData}" alt="촬영된 사진">`;
        
        // 파일 입력에 이미지 데이터 설정
        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            });
    });

    // 파일 입력 처리
    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="미리보기">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '';
        }
    });
});