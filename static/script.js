document.addEventListener('DOMContentLoaded', function() {
    initCapabilitiesPage();
    initVoiceControl();
    initInteractiveDemos();
    initModeSwitching();
    initWidgets();});

function initCapabilitiesPage() {
    console.log('AeroAssist Capabilities Initialized');
    const firstVisit = !localStorage.getItem('capabilities-visited');
    if (firstVisit) {
        setTimeout(() => {
            showModeSelectModal();
        }, 2000);
        localStorage.setItem('capabilities-visited', 'true');}
    initParallax();
    initScrollAnimations();
    }

function showModeSelectModal() {
    const modal = document.querySelector('.mode-select-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const options = document.querySelectorAll('.mode-option');
    options.forEach((option, index) => {
        option.style.opacity = '0';
        option.style.transform = 'translateY(30px)';
        setTimeout(() => {
            option.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
        }, index * 200);
        })
        ;}

function hideModeSelectModal() {
    const modal = document.querySelector('.mode-select-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';}
const closeModeModal = document.getElementById('closeModeModal');
if (closeModeModal) {
    closeModeModal.addEventListener('click', hideModeSelectModal);};

document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', function() {
        const mode = this.dataset.mode;
        selectMode(mode);
        });
});

document.querySelectorAll('.select-mode-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const mode = this.closest('.mode-option').dataset.mode;
        selectMode(mode);
    });
});

function selectMode(mode) {
    console.log(`Selected mode: ${mode}`);
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.9)';
    modalContent.style.opacity = '0';
    const transition = document.querySelector('.theme-transition');
    transition.style.opacity = '1';
    setTimeout(() => {
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.classList.contains(`${mode}-mode`)) {
                btn.classList.add('active');
            }
        });
        if (mode === 'pro') {
            document.querySelector('#proDetails').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            document.querySelector('#publicDetails').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        hideModeSelectModal();
        setTimeout(() => {
            transition.style.opacity = '0';
            modalContent.style.transform = '';
            modalContent.style.opacity = '';
        }, 500);

    }, 300);
}

function initModeSwitching() {
    const switchTrack = document.querySelector('.switch-track');
    const switchThumb = document.querySelector('.switch-thumb');
    const switchLabels = document.querySelectorAll('.switch-labels span');
    if (!switchTrack) return;
    let isProMode = false;
    switchTrack.addEventListener('click', function() {
        isProMode = !isProMode;
        if (isProMode) {
            switchTrack.classList.add('active');
            switchLabels[0].classList.add('active');
            switchLabels[1].classList.remove('active');
            setTimeout(() => {
                document.querySelector('#proDetails').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        } else {
            switchTrack.classList.remove('active');
            switchLabels[0].classList.remove('active');
            switchLabels[1].classList.add('active');
            setTimeout(() => {
                document.querySelector('#publicDetails').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
        playSound('switch');
    });
    switchLabels.forEach(label => {
        label.addEventListener('click', function() {
            if (this.classList.contains('pro-label') && !isProMode) {
                switchTrack.click();
            } else if (this.classList.contains('public-label') && isProMode) {
                switchTrack.click();
            }
        });
    });
}

function initInteractiveDemos() {
    const simulateBtn = document.querySelector('.demo-btn-simulate');
    if (simulateBtn) {
        simulateBtn.addEventListener('click', function() {
            simulateCrackDetection();
        });
    }
    const analyzeBtn = document.querySelector('.demo-btn-analyze');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            simulateAIAnalysis();
        });
    }
    const checklistItems = document.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        if (!item.classList.contains('checked') && !item.classList.contains('warning')) {
            item.addEventListener('click', function() {
                this.classList.add('checked');
                playSound('check');
                checkAllChecklist();
            });
        }
    });
    const widgetOptions = document.querySelectorAll('.widget-option');
    const widgets = document.querySelectorAll('.widget');
    widgetOptions.forEach(option => {
        option.addEventListener('click', function() {
            const widgetType = this.dataset.widget;
            widgetOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            widgets.forEach(widget => {
                widget.classList.remove('active');
                if (widget.classList.contains(`${widgetType}-widget`)) {
                    widget.classList.add('active');
                }
            });
            playSound('click');
        });
    });
}

function simulateCrackDetection() {
    const materialSample = document.querySelector('.material-sample');
    if (!materialSample) return;
    const newCrack = document.createElement('div');
    newCrack.className = 'crack-line';
    newCrack.style.cssText = `
        position: absolute;
        top: ${Math.random() * 80 + 10}%;
        left: ${Math.random() * 80 + 10}%;
        width: ${Math.random() * 40 + 20}px;
        height: ${Math.random() * 2 + 1}px;
        background: rgba(255, 55, 95, 0.8);
        border-radius: 1px;
        transform: rotate(${Math.random() * 180 - 90}deg);
        z-index: 2;
    `;
    materialSample.appendChild(newCrack);
    const highlight = document.querySelector('.ai-highlight');
    highlight.style.animation = 'none';
    setTimeout(() => {
        highlight.style.animation = 'highlightScan 3s linear';
    }, 10);
    const crackCount = materialSample.querySelectorAll('.crack-line').length;
    updateDetectionStats(crackCount);
    playSound('detection');
    showNotification(`Обнаружена новая трещина! Всего: ${crackCount}`, 'warning');
}

function simulateAIAnalysis() {
    const analyzeBtn = document.querySelector('.demo-btn-analyze');
    if (!analyzeBtn) return;
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Анализ...';
    analyzeBtn.disabled = true;
    setTimeout(() => {
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
        const results = [
            { type: 'Трещины', count: Math.floor(Math.random() * 5) + 1, confidence: Math.floor(Math.random() * 30) + 70 },
            { type: 'Коррозия', count: Math.floor(Math.random() * 3), confidence: Math.floor(Math.random() * 40) + 60 },
            { type: 'Деформация', count: Math.floor(Math.random() * 2), confidence: Math.floor(Math.random() * 50) + 50 }
        ];
        showAnalysisResults(results);
        playSound('complete');
    }, 2000);
}

function updateDetectionStats(count) {
    const stats = document.querySelectorAll('.module-specs .spec-bar');
    if (stats.length > 0) {
        const accuracy = Math.min(99.2 + count * 0.1, 99.9);
        stats[0].dataset.value = accuracy.toFixed(1);
        stats[0].querySelector('span').textContent = `${accuracy.toFixed(1)}%`;
        const speed = Math.max(87 - count * 2, 60);
        stats[1].dataset.value = speed;
        stats[1].querySelector('span').textContent = `${speed} кадров/сек`;
        stats.forEach(bar => {
            bar.style.animation = 'none';
            setTimeout(() => {
                bar.style.animation = 'fillBar 1.5s ease-out forwards';
            }, 10);
        });
    }
}

function checkAllChecklist() {
    const items = document.querySelectorAll('.checklist-item');
    const checked = Array.from(items).filter(item =>
        item.classList.contains('checked') || item.classList.contains('warning')
    );
    if (checked.length === items.length) {
        showNotification('Все системы скафандра проверены!', 'success');
        playSound('success');
    }
}

function showAnalysisResults(results) {
    const modal = document.createElement('div');
    modal.className = 'results-modal';
    modal.innerHTML = `
        <div class="results-content">
            <h3><i class="fas fa-chart-bar"></i> Результаты анализа</h3>
            <div class="results-grid">
                ${results.map(result => `
                    <div class="result-item">
                        <div class="result-type">${result.type}</div>
                        <div class="result-count">${result.count} шт</div>
                        <div class="result-confidence">
                            <div class="confidence-bar" style="width: ${result.confidence}%"></div>
                            <span>${result.confidence}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="close-results">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    const content = modal.querySelector('.results-content');
    content.style.cssText = `
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        transform: translateY(30px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 10);
    modal.querySelector('.close-results').addEventListener('click', () => {
        modal.style.opacity = '0';
        content.style.opacity = '0';
        content.style.transform = 'translateY(30px)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.querySelector('.close-results').click();
        }
    });
}

function initVoiceControl() {
    const voiceToggle = document.getElementById('voiceToggle');
    if (!voiceToggle) {
        console.log('Voice control element not found');
        return;
    }
    const voiceWave = voiceToggle.querySelector('.voice-wave');
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        voiceToggle.style.display = 'none';
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;
    let isListening = false;
    voiceToggle.addEventListener('click', function() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    });
    function startListening() {
        recognition.start();
        isListening = true;
        voiceToggle.classList.add('listening');
        voiceWave.style.animation = 'wave 2s linear infinite';
        showNotification('Слушаю... Скажите команду', 'info');
        playSound('start');
    }
    function stopListening() {
        recognition.stop();
        isListening = false;
        voiceToggle.classList.remove('listening');
        voiceWave.style.animation = '';
        showNotification('Голосовое управление отключено', 'info');
        playSound('end');
    }
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Распознано:', transcript);
        handleVoiceCommand(transcript);
    };
    recognition.onerror = function(event) {
        console.error('Ошибка распознавания:', event.error);
        showNotification('Ошибка распознавания речи', 'error');
        stopListening();
    };
    recognition.onend = function() {
        if (isListening) {
            setTimeout(() => {
                if (isListening) recognition.start();
            }, 100);
        }
    };
}

function handleVoiceCommand(command) {
    const normalized = command.toLowerCase();
    if (normalized.includes('про режим') || normalized.includes('профессиональный')) {
        document.querySelector('.switch-track')?.click();
        showNotification('Переключаюсь на Pro режим', 'success');
    }
    else if (normalized.includes('публичный') || normalized.includes('публик')) {
        document.querySelector('.switch-track')?.click();
        showNotification('Переключаюсь на Public режим', 'success');
    }
    else if (normalized.includes('демо') && normalized.includes('трещин')) {
        document.querySelector('.demo-btn-simulate')?.click();
        showNotification('Запускаю демо обнаружения трещин', 'success');
    }
    else if (normalized.includes('анализ') || normalized.includes('проанализировать')) {
        document.querySelector('.demo-btn-analyze')?.click();
        showNotification('Запускаю AI анализ', 'success');
    }
    else if (normalized.includes('вверх') || normalized.includes('наверх')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('Прокручиваю наверх', 'success');
    }
    else if (normalized.includes('вниз') || normalized.includes('внизу')) {
        window.scrollTo({ 
            top: document.body.scrollHeight, 
            behavior: 'smooth' 
        });
        showNotification('Прокручиваю вниз', 'success');
    }
    else if (normalized.includes('помощь') || normalized.includes('команды')) {
        showNotification('Доступные команды: "Pro режим", "Демо трещин", "Анализ", "Вверх", "Вниз"', 'info');
    }
    else {
        showNotification('Команда не распознана. Скажите "помощь" для списка команд', 'warning');
    }
}

function initWidgets() {
    const radarSweep = document.querySelector('.radar-sweep');
    if (radarSweep) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                createAnomaly();
            }
        }, 3000);
    }

    animateVitals();
    updateISSPosition();
    updateLaunchCountdown();
}

function createAnomaly() {
    const radar = document.querySelector('.anomaly-radar');
    if (!radar) return;
    const anomaly = document.createElement('div');
    anomaly.className = 'anomaly-point';
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    anomaly.style.cssText = `
        position: absolute;
        top: ${y}%;
        left: ${x}%;
        width: 12px;
        height: 12px;
        background: var(--accent-red);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 15px var(--accent-red);
        animation: anomalyPulse 2s ease-in-out infinite;
        z-index: 2;
    `;
    radar.appendChild(anomaly);
    setTimeout(() => {
        if (anomaly.parentNode === radar) {
            radar.removeChild(anomaly);
        }
    }, 5000);
}

function animateVitals() {
    const graphs = document.querySelectorAll('.vital-graph');
    graphs.forEach(graph => {
        setInterval(() => {
            const currentWidth = parseFloat(graph.style.width || getComputedStyle(graph, '::after').width);
            const newWidth = Math.random() * 20 + 70; // 70-90%
            graph.querySelector('::after')?.style.setProperty('width', `${newWidth}%`);
        }, 2000);
    });
}

function updateISSPosition() {
    const issTracker = document.querySelector('.iss-tracker');
    if (!issTracker) return;
    setInterval(() => {
        const currentLeft = parseFloat(getComputedStyle(issTracker).left);
        const newLeft = (currentLeft + 1) % 100;
        issTracker.style.left = `${newLeft}%`;
        const currentTop = parseFloat(getComputedStyle(issTracker).top);
        const newTop = 20 + Math.sin(Date.now() / 1000) * 10;
        issTracker.style.top = `${newTop}%`;
    }, 100);
}

function updateLaunchCountdown() {
    const countdownElement = document.querySelector('.countdown-timer');
    if (!countdownElement) return;
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 14);
    launchDate.setHours(14, 30, 0, 0);
    function updateTimer() {
        const now = new Date();
        const diff = launchDate - now;
        if (diff <= 0) {
            countdownElement.innerHTML = `
                <div class="launch-success">
                    <i class="fas fa-rocket"></i>
                    <span>Запуск успешен!</span>
                </div>
            `;
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const timeUnits = countdownElement.querySelectorAll('.time-value');
        if (timeUnits.length >= 3) {
            timeUnits[0].textContent = days.toString().padStart(2, '0');
            timeUnits[1].textContent = hours.toString().padStart(2, '0');
            timeUnits[2].textContent = minutes.toString().padStart(2, '0');
        }
    }
    updateTimer();
    setInterval(updateTimer, 60000);
}

function initParallax() {
    const orbitals = document.querySelectorAll('.orbital-ring');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        orbitals.forEach((ring, index) => {
            const speed = 0.2 + index * 0.1;
            const yOffset = scrolled * speed;
            ring.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.classList.contains('module-card')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    document.querySelectorAll('.module-card, .feature-card, .tech-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid ${getNotificationColor(type)};
        border-radius: 12px;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    `;
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'var(--accent-green)';
        case 'warning': return '#ffcc00';
        case 'error': return 'var(--accent-red)';
        default: return 'var(--accent-blue)';
    }
}

let currentStep = 1;
const totalSteps = 5;
let registrationData = {
    team: null,
    profile: null,
    cameras: [],
    documents: [],
    agreements: {}
};

document.addEventListener('DOMContentLoaded', () => {
    initRegistration();
    setupEventListeners();
    updateProgress();
    loadSampleData();
});

function initRegistration() {
    const savedData = localStorage.getItem('aeroassist_registration');
    if (savedData) {
        registrationData = JSON.parse(savedData);
        updateSummary();
    }
}

function setupEventListeners() {
    document.querySelector('.toggle-password')?.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    document.getElementById('password')?.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
    document.getElementById('experience')?.addEventListener('input', function() {
        document.getElementById('experienceValue').textContent = `${this.value} лет`;
    });
    document.querySelectorAll('.camera-type-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.camera-type-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    setupFileUpload();
    setupWebcam();
    setupFormValidation();
}

function setupFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadedFiles = document.getElementById('uploadedFiles');
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function setupWebcam() {
    const startBtn = document.getElementById('startWebcam');
    const captureBtn = document.getElementById('capturePhoto');
    const retakeBtn = document.getElementById('retakePhoto');
    const video = document.getElementById('webcamVideo');
    const canvas = document.getElementById('webcamCanvas');
    const photosGrid = document.querySelector('.photos-grid');
    let stream = null;
    let capturedPhoto = null;
    startBtn.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 640, height: 480 } 
            });
            video.srcObject = stream;
            captureBtn.disabled = false;
            startBtn.style.display = 'none';
            retakeBtn.style.display = 'none';
        } catch (err) {
            alert('Ошибка доступа к камере: ' + err.message);
        }
    });
    captureBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        capturedPhoto = canvas.toDataURL('image/png');
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${capturedPhoto}" alt="Фото">
            <button class="photo-remove" onclick="removePhoto(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        photosGrid.appendChild(photoItem);
        registrationData.documents.push({
            type: 'webcam_photo',
            data: capturedPhoto,
            timestamp: new Date().toISOString()
        });
        saveRegistrationData();
        updateSummary();
        captureBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
    });
    retakeBtn.addEventListener('click', () => {
        captureBtn.style.display = 'inline-block';
        retakeBtn.style.display = 'none';
    });
}

function setupFormValidation() {
    document.getElementById('email')?.addEventListener('blur', function() {
        const status = document.getElementById('emailStatus');
        if (this.value && !isValidEmail(this.value)) {
            status.textContent = 'Неверный формат email';
            status.style.color = 'var(--accent-red)';
        } else {
            status.textContent = '';
        }
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressLine').style.width = `${progress}%`;
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        if (index + 1 < currentStep) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else if (index + 1 === currentStep) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });

    document.querySelectorAll('.badge').forEach((badge, index) => {
        if (index + 1 < currentStep) {
            badge.classList.add('completed');
        } else {
            badge.classList.remove('completed');
        }
    });
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            const teamName = document.getElementById('teamName').value;
            if (!teamName) {
                alert('Введите название команды');
                return false;
            }
            registrationData.team = {
                name: teamName,
                description: document.getElementById('teamDescription').value,
                inviteCode: generateInviteCode()
            };
            break;
        case 2:
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (!firstName || !lastName || !email || !password) {
                alert('Заполните все обязательные поля');
                return false;
            }
            if (!isValidEmail(email)) {
                alert('Введите корректный email');
                return false;
            }
            if (password.length < 8) {
                alert('Пароль должен быть не менее 8 символов');
                return false;
            }
            registrationData.profile = {
                firstName,
                lastName,
                email,
                iin: document.getElementById('iin').value,
                role: document.getElementById('role').value,
                experience: document.getElementById('experience').value
            };
            break;
    }
    saveRegistrationData();
    updateSummary();
    return true;
}

function saveRegistrationData() {
    localStorage.setItem('aeroassist_registration', JSON.stringify(registrationData));
}

function updatePasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    strengthFill.className = 'strength-fill';
    if (strength <= 1) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Слабый';
    } else if (strength <= 2) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Средний';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Надежный';
    }
}

function createTeam() {
    const teamName = document.getElementById('teamName').value;
    if (!teamName) {
        alert('Введите название команды');
        return;
    }
    registrationData.team = {
        name: teamName,
        description: document.getElementById('teamDescription').value,
        inviteCode: generateInviteCode()
    };
    alert(`Команда "${teamName}" создана!\nИнвайт-код: ${registrationData.team.inviteCode}`);
    updateSummary();
}

function joinTeam() {
    const inviteCode = document.getElementById('inviteCode').value;
    if (!inviteCode) {
        alert('Введите инвайт-код');
        return;
    }
    if (inviteCode === 'AERO2024' || inviteCode === 'SPACEX' || inviteCode === 'NASA') {
        registrationData.team = {
            name: `Команда ${inviteCode}`,
            inviteCode: inviteCode,
            joined: true
        };
        const preview = document.getElementById('invitePreview');
        preview.innerHTML = `
            <div class="preview-header">
                <i class="fas fa-satellite"></i>
                <div>
                    <h4>Команда ${inviteCode}</h4>
                    <p>Готовы принять вас на борт!</p>
                </div>
            </div>
            <div class="team-stats">
                <div class="stat">
                    <i class="fas fa-users"></i>
                    <span>5 участников</span>
                </div>
                <div class="stat">
                    <i class="fas fa-camera"></i>
                    <span>12 камер</span>
                </div>
                <div class="stat">
                    <i class="fas fa-rocket"></i>
                    <span>3 активные миссии</span>
                </div>
            </div>
        `;
        alert('Вы успешно присоединились к команде!');
        updateSummary();
    } else {
        alert('Неверный инвайт-код. Попробуйте: AERO2024, SPACEX или NASA');
    }
}

function addCamera() {
    const cameraName = document.getElementById('cameraName').value;
    if (!cameraName) {
        alert('Введите название камеры');
        return;
    }
    const cameraType = document.querySelector('.camera-type-card.active')?.dataset.type || 'ambient';
    const cameraId = `CAM_${Date.now()}`;
    const camera = {
        id: cameraId,
        name: cameraName,
        type: cameraType,
        streamUrl: document.getElementById('streamUrl').value || `demo://camera/${cameraType}`,
        settings: {
            crackDetection: document.querySelector('input[type="checkbox"]:checked') !== null,
            heatmap: true,
            autoAlerts: false
        }
    };
    registrationData.cameras.push(camera);
    const camerasList = document.getElementById('camerasList');
    if (camerasList.querySelector('.empty-state')) {
        camerasList.innerHTML = '';
    }
    const cameraItem = document.createElement('div');
    cameraItem.className = 'camera-item';
    cameraItem.innerHTML = `
        <div class="camera-item-icon">
            <i class="fas fa-${getCameraIcon(cameraType)}"></i>
        </div>
        <div class="camera-item-info">
            <h5>${cameraName}</h5>
            <p>${getCameraTypeName(cameraType)} • ID: ${cameraId}</p>
        </div>
        <button class="btn small-btn danger" onclick="removeCamera('${cameraId}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    camerasList.appendChild(cameraItem);
    document.getElementById('cameraName').value = '';
    document.getElementById('streamUrl').value = '';
    saveRegistrationData();
    updateSummary();
    cameraItem.style.opacity = '0';
    cameraItem.style.transform = 'translateY(20px)';
    setTimeout(() => {
        cameraItem.style.transition = 'all 0.3s ease';
        cameraItem.style.opacity = '1';
        cameraItem.style.transform = 'translateY(0)';
    }, 10);
}

function removeCamera(cameraId) {
    registrationData.cameras = registrationData.cameras.filter(cam => cam.id !== cameraId);
    const camerasList = document.getElementById('camerasList');
    camerasList.querySelector(`[onclick="removeCamera('${cameraId}')"]`)?.closest('.camera-item').remove();
    if (registrationData.cameras.length === 0) {
        camerasList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-camera-slash"></i>
                <p>Еще нет добавленных камер</p>
            </div>
        `;
    }
    saveRegistrationData();
    updateSummary();
}

function handleFiles(files) {
    const uploadedFiles = document.getElementById('uploadedFiles');
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`Файл ${file.name} слишком большой (макс. 10MB)`);
            return;
        }
        const fileId = `DOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fileType = file.type.split('/')[0];
        const fileIcon = getFileIcon(file.name);
        registrationData.documents.push({
            id: fileId,
            name: file.name,
            type: fileType,
            size: formatFileSize(file.size),
            file: file
        });
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="fas fa-${fileIcon}"></i>
                </div>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <div class="file-actions">
                <button onclick="removeFile('${fileId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        uploadedFiles.appendChild(fileItem);
        fileItem.style.opacity = '0';
        fileItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            fileItem.style.transition = 'all 0.3s ease';
            fileItem.style.opacity = '1';
            fileItem.style.transform = 'translateY(0)';
        }, 10);
    });
    saveRegistrationData();
    updateSummary();
}

function removeFile(fileId) {
    registrationData.documents = registrationData.documents.filter(doc => doc.id !== fileId);
    updateSummary();
    saveRegistrationData();
}

function removePhoto(button) {
    const photoItem = button.closest('.photo-item');
    const index = Array.from(photoItem.parentNode.children).indexOf(photoItem);
    registrationData.documents.splice(index, 1);
    photoItem.remove();
    saveRegistrationData();
    updateSummary();
}

function updateSummary() {
    const teamSummary = document.getElementById('teamSummary');
    if (registrationData.team) {
        teamSummary.innerHTML = `
            <h5>${registrationData.team.name}</h5>
            <p>Код: ${registrationData.team.inviteCode}</p>
            ${registrationData.team.description ? `<p>${registrationData.team.description}</p>` : ''}
        `;
        document.getElementById('teamBadge').classList.add('completed');
    }
    const profileSummary = document.getElementById('profileSummary');
    if (registrationData.profile) {
        profileSummary.innerHTML = `
            <h5>${registrationData.profile.firstName} ${registrationData.profile.lastName}</h5>
            <p>${registrationData.profile.email}</p>
            ${registrationData.profile.role ? `<p>Роль: ${registrationData.profile.role}</p>` : ''}
            ${registrationData.profile.experience ? `<p>Опыт: ${registrationData.profile.experience} лет</p>` : ''}
        `;
        document.getElementById('profileBadge').classList.add('completed');
    }
    const camerasSummary = document.getElementById('camerasSummary');
    camerasSummary.innerHTML = `
        <h5>${registrationData.cameras.length} камер</h5>
        ${registrationData.cameras.slice(0, 2).map(cam => 
            `<p>• ${cam.name} (${getCameraTypeName(cam.type)})</p>`
        ).join('')}
        ${registrationData.cameras.length > 2 ? `<p>...и еще ${registrationData.cameras.length - 2}</p>` : ''}
    `;
    if (registrationData.cameras.length > 0) {
        document.getElementById('cameraBadge').classList.add('completed');
    }
    const documentsSummary = document.getElementById('documentsSummary');
    documentsSummary.innerHTML = `
        <h5>${registrationData.documents.length} файлов</h5>
        ${registrationData.documents.slice(0, 2).map(doc => 
            `<p>• ${doc.name || 'Фото'}</p>`
        ).join('')}
        ${registrationData.documents.length > 2 ? `<p>...и еще ${registrationData.documents.length - 2}</p>` : ''}
    `;
    if (registrationData.documents.length > 0) {
        document.getElementById('docsBadge').classList.add('completed');
    }
}

function submitRegistration() {
    const terms = document.getElementById('termsAgreement').checked;
    const data = document.getElementById('dataAgreement').checked;
    const notifications = document.getElementById('notificationsAgreement').checked;
    if (!terms) {
        alert('Необходимо согласиться с условиями использования');
        return;
    }
    registrationData.agreements = { terms, data, notifications };
    const submitBtn = document.getElementById('submitRegistration');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    setTimeout(() => {
        document.querySelector('.final-actions').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        localStorage.removeItem('aeroassist_registration');
        showConfetti();
        simulateEmailConfirmation();
        console.log('Registration data:', registrationData);
    }, 2000);
}

function downloadSummary() {
    alert('В реальном приложении здесь будет генерация PDF с данными регистрации');
}

function generateInviteCode() {
    return 'AERO-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getCameraIcon(type) {
    const icons = {
        rocket: 'rocket',
        suit: 'user-astronaut',
        medical: 'heartbeat',
        ambient: 'video'
    };
    return icons[type] || 'camera';
}

function getCameraTypeName(type) {
    const names = {
        rocket: 'Ракетная',
        suit: 'Скафандр',
        medical: 'Медицинская',
        ambient: 'Окружение'
    };
    return names[type] || 'Неизвестный тип';
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'file-pdf';
    if (['doc', 'docx'].includes(ext)) return 'file-word';
    return 'file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function loadSampleData() {
    const invitePreview = document.getElementById('invitePreview');
    invitePreview.innerHTML = `
        <div class="preview-header">
            <i class="fas fa-lightbulb"></i>
            <div>
                <h4>Демо коды</h4>
                <p>Попробуйте: AERO2024, SPACEX, NASA</p>
            </div>
        </div>
    `;
}

function pasteFromClipboard() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById('inviteCode').value = text;
        })
        .catch(err => {
            alert('Не удалось получить текст из буфера обмена');
        });
}

function showConfetti() {
    const colors = ['#00f3ff', '#9d4edd', '#00ff9d', '#ff375f'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            border-radius: 2px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(confetti);
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        animation.onfinish = () => confetti.remove();
    }
}

function simulateEmailConfirmation() {
    const emailContent = `
        Уважаемый ${registrationData.profile?.firstName || 'пользователь'}!
        
        Ваша регистрация в AeroAssist успешно завершена!
        
        Детали регистрации:
        • Команда: ${registrationData.team?.name || 'Не указана'}
        • Email: ${registrationData.profile?.email || 'Не указан'}
        • Камеры: ${registrationData.cameras.length} шт.
        • Документы: ${registrationData.documents.length} шт.

        Для активации аккаунта перейдите по ссылке:
        https://aeroassist.com/verify?code=${registrationData.team?.inviteCode || 'DEMO'}
        
        С уважением,
        Команда AeroAssist 🚀
    `;
    console.log('Email sent:', emailContent);
}

window.createTeam = createTeam;
window.joinTeam = joinTeam;
window.addCamera = addCamera;
window.removeCamera = removeCamera;
window.removeFile = removeFile;
window.removePhoto = removePhoto;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.downloadSummary = downloadSummary;
window.submitRegistration = submitRegistration;
window.pasteFromClipboard = pasteFromClipboard;
window.AeroAssistCapabilities = {
    showModeSelect: showModeSelectModal,
    simulateCrack: simulateCrackDetection,
    simulateAnalysis: simulateAIAnalysis,
    toggleVoiceControl: () => document.getElementById('voiceToggle')?.click()
};

document.addEventListener('DOMContentLoaded', () => {
    initRegister();
});

function initRegister() {
    setupPasswordToggle();
    setupPasswordStrength();
    setupFormValidation();
    setupAssistantHelp();
    setupSocialButtons();
}

function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        const icon = toggleBtn.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        let width = '0%';
        let color = '#ff375f';
        if (password.length === 0) {
            width = '0%';
        } else if (strength <= 1) {
            width = '33%';
            color = '#ff375f';
        } else if (strength === 2) {
            width = '66%';
            color = '#ff9900';
        } else {
            width = '100%';
            color = '#00ff9d';
        }
        strengthFill.style.width = width;
        strengthFill.style.background = color;
        strengthFill.style.transition = 'all 0.3s ease';
    });
}

function setupFormValidation() {
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const emailStatus = document.getElementById('emailStatus');
    const confirmStatus = document.getElementById('confirmStatus');
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailStatus.textContent = 'Неверный формат email';
            emailStatus.className = 'input-status error';
        } else {
            emailStatus.textContent = '';
        }
    });
    confirmInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const confirm = confirmInput.value;
        if (confirm && password !== confirm) {
            confirmStatus.textContent = 'Пароли не совпадают';
            confirmStatus.className = 'input-status error';
        } else if (confirm) {
            confirmStatus.textContent = '✓ Пароли совпадают';
            confirmStatus.className = 'input-status success';
        } else {
            confirmStatus.textContent = '';
        }
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const submitBtn = form.querySelector('.register-btn');
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
        submitBtn.disabled = true;
        try {
            await simulateRegistration();
            showSuccessModal();
            saveUserData();
            
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
            submitBtn.innerHTML = originalHtml;
            submitBtn.disabled = false;
        }
    });
}

function setupAssistantHelp() {
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            let message = '';
            switch(action) {
                case 'password-help':
                    message = 'Пароль должен содержать минимум 8 символов, включая цифры и заглавные буквы. Используйте уникальный пароль, который не используется в других сервисах.';
                    break;
                case 'email-help':
                    message = 'Введите действующий email адрес. На него придет письмо с подтверждением регистрации. Пример: user@example.com';
                    break;
                case 'account-help':
                    message = 'Личный аккаунт - для обычных пользователей. Pro аккаунт - для профессионалов, дает доступ к AI анализу и расширенным функциям.';
                    break;
            }
            addAssistantMessage(message, 'bot');
        });
    });
}

function setupSocialButtons() {
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google') ? 'Google' :
                           btn.classList.contains('github') ? 'GitHub' : 'NASA';
            
            alert(`В реальном приложении здесь будет авторизация через ${provider}`);
        });
    });
}

function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    if (!firstName || firstName.length < 2) {
        alert('Введите имя (минимум 2 символа)');
        return false;
    }
    if (!lastName) {
        alert('Введите фамилию');
        return false;
    }
    if (!isValidEmail(email)) {
        alert('Введите корректный email');
        return false;
    }
    if (password.length < 8) {
        alert('Пароль должен быть не менее 8 символов');
        return false;
    }
    if (password !== confirm) {
        alert('Пароли не совпадают');
        return false;
    }
    if (!terms) {
        alert('Необходимо согласиться с условиями');
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function simulateRegistration() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.1;
            if (success) {
                resolve({ status: 'success', userId: 'USER_' + Date.now() });
            } else {
                reject(new Error('Сервер временно недоступен'));
            }
        }, 1500);
    });
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    createConfetti();
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function saveUserData() {
    const userData = {
        id: 'USER_' + Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        accountType: document.querySelector('input[name="accountType"]:checked').value,
        newsletter: document.getElementById('newsletter').checked,
        registeredAt: new Date().toISOString()
    };
    localStorage.setItem('aeroassist_user', JSON.stringify(userData));
    console.log('User registered:', userData);
}

function createConfetti() {
    const colors = ['#00f3ff', '#9d4edd', '#00ff9d', '#ff375f', '#ff9900'];
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -20px;
            left: ${Math.random() * 100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 10000;
            pointer-events: none;
            transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(confetti);
        const duration = 2000 + Math.random() * 3000;
        const animation = confetti.animate([
            { 
                transform: `translateY(0) rotate(0deg)`,
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight + 100}px) rotate(${360 + Math.random() * 360}deg)`,
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.1, 0.8, 0.1, 1)'
        });
        animation.onfinish = () => confetti.remove();
    }
}

async function startEmotionRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            await analyzeEmotion(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        document.getElementById('startRecording').disabled = true;
        document.getElementById('stopRecording').disabled = false;
        document.getElementById('emotionStatus').textContent = 'Запись...';
        document.getElementById('emotionWave').classList.add('recording');
        let seconds = 0;
        recordingInterval = setInterval(() => {
            seconds++;
            document.getElementById('emotionStatus').textContent = `Запись... ${seconds}с`;
        }, 1000);
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                stopEmotionRecording();
            }
        }, 5000);
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showNotification('Ошибка доступа к микрофону', 'error');
    }
}

function stopEmotionRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        if (recordingInterval) {
            clearInterval(recordingInterval);
            recordingInterval = null;
        }
        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
        document.getElementById('emotionStatus').textContent = 'Анализ...';
        document.getElementById('emotionWave').classList.remove('recording');
    }
}

async function analyzeEmotion(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    try {
        const response = await fetch('/api/emotion/detect', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.error) {
            showNotification(result.error, 'error');
            document.getElementById('emotionStatus').textContent = 'Ошибка';
            return;
        }
        updateEmotionDisplay(result);
        addToEmotionHistory(result);
        document.getElementById('emotionStatus').textContent = 'Готов';
    } catch (error) {
        console.error('Error analyzing emotion:', error);
        showNotification('Ошибка анализа', 'error');
        document.getElementById('emotionStatus').textContent = 'Ошибка';
    }
}

function updateEmotionDisplay(result) {
    const primary = result.primary;
    const emotion = primary.emotion;
    const confidence = Math.round(primary.confidence * 100);

    const colors = {
        'anger': '#ff375f',
        'disgust': '#00ff9d',
        'fear': '#9d4edd',
        'happiness': '#00f3ff',
        'sadness': '#4a6fa5',
        'enthusiasm': '#ff9900',
        'neutral': '#cccccc'
    };

    const icons = {
        'anger': 'fa-angry',
        'disgust': 'fa-face-disgust',
        'fear': 'fa-face-fearful',
        'happiness': 'fa-smile',
        'sadness': 'fa-sad-tear',
        'enthusiasm': 'fa-grin-stars',
        'neutral': 'fa-meh'
    };

    const color = colors[emotion] || '#00f3ff';
    const icon = icons[emotion] || 'fa-smile';
    const emotionIcon = document.getElementById('emotionIcon');
    if (emotionIcon) {
        emotionIcon.innerHTML = `<i class="fas ${icon}"></i>`;
        emotionIcon.style.background = color;
    }
    const emotionName = document.getElementById('emotionName');
    if (emotionName) emotionName.textContent = translateEmotion(emotion);
    const emotionConfidence = document.getElementById('emotionConfidence');
    if (emotionConfidence) emotionConfidence.textContent = `${confidence}%`;
    const emotionBar = document.querySelector('.emotion-bar');
    if (emotionBar) emotionBar.style.width = `${confidence}%`;
}

function addToEmotionHistory(result) {
    const historyList = document.getElementById('emotionHistoryList');
    const primary = result.primary;
    const emotion = primary.emotion;
    const confidence = Math.round(primary.confidence * 100);

    const icons = {
        'anger': 'fa-angry',
        'disgust': 'fa-face-disgust',
        'fear': 'fa-face-fearful',
        'happiness': 'fa-smile',
        'sadness': 'fa-sad-tear',
        'enthusiasm': 'fa-grin-stars',
        'neutral': 'fa-meh'
    };

    const colors = {
        'anger': '#ff375f',
        'disgust': '#00ff9d',
        'fear': '#9d4edd',
        'happiness': '#00f3ff',
        'sadness': '#4a6fa5',
        'enthusiasm': '#ff9900',
        'neutral': '#cccccc'
    };

    const time = new Date().toLocaleTimeString();
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-icon" style="background: ${colors[emotion] || '#00f3ff'}">
            <i class="fas ${icons[emotion] || 'fa-smile'}"></i>
        </div>
        <div class="history-details">
            <div class="history-emotion">${translateEmotion(emotion)}</div>
            <div class="history-time">${time}</div>
        </div>
        <div class="history-confidence">${confidence}%</div>
    `;
    historyList.insertBefore(historyItem, historyList.firstChild);
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function translateEmotion(emotion) {
    const translations = {
        'anger': 'Гнев',
        'disgust': 'Отвращение',
        'fear': 'Страх',
        'happiness': 'Счастье',
        'sadness': 'Грусть',
        'enthusiasm': 'Энтузиазм',
        'neutral': 'Нейтрально'
    };
    return translations[emotion] || emotion;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/emotion/status')
        .then(r => r.json())
        .then(data => {
            if (data.loaded) {
                console.log(' Emotion model ready');
            } else {
                console.log(' Emotion model not loaded');
            }
        })
        .catch(err => console.log('Emotion API not available'));
});

let cameraMapping = {
    'camera1': null,
    'camera2': null,
    'camera3': null
};

const cameraModels = {
    'camera1': 'rocket',
    'camera2': 'suit',
    'camera3': 'medical'
};

const cameraSources = {
    'camera1': '0',
    'camera2': '1',
    'camera3': '2'
};

async function initializeThreeCameras() {
    console.log(' Initializing 3 cameras...');
    try {
        const response = await fetch('/api/cameras');
        const existingCameras = await response.json();
        console.log(' Existing cameras:', existingCameras);
        if (existingCameras.length >= 3) {
            cameraMapping.camera1 = existingCameras[0].id;
            cameraMapping.camera2 = existingCameras[1].id;
            cameraMapping.camera3 = existingCameras[2].id;
            console.log('✅ Using existing cameras');
        } else {
            for (let cam of existingCameras) {
                await fetch(`/api/cameras/${cam.id}`, { method: 'DELETE' });
            }
            const cam1 = await fetch('/api/cameras', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: 'Ракетная камера',
                    type: 'rocket',
                    model_type: 'rocket',
                    source: cameraSources.camera1
                })
            }).then(r => r.json());
            cameraMapping.camera1 = cam1.id;
            const cam2 = await fetch('/api/cameras', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: 'Скафандр камера',
                    type: 'suit',
                    model_type: 'suit',
                    source: cameraSources.camera2
                })
            }).then(r => r.json());
            cameraMapping.camera2 = cam2.id;
            const cam3 = await fetch('/api/cameras', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: 'Медицинская камера',
                    type: 'medical',
                    model_type: 'medical',
                    source: cameraSources.camera3
                })
            }).then(r => r.json());
            cameraMapping.camera3 = cam3.id;
            console.log(' All 3 cameras created:', cameraMapping);
        }
        startAllVideoFeeds();
        setInterval(updateAllCameraStats, 2000);
    } catch (error) {
        console.error(' Error initializing cameras:', error);
        showCameraError();
    }
}

function startAllVideoFeeds() {
    console.log(' Starting all video feeds...');
    for (let i = 1; i <= 3; i++) {
        const cameraId = `camera${i}`;
        startVideoFeed(cameraId);
    }
}

function startVideoFeed(cameraId) {
    const backendId = cameraMapping[cameraId];
    if (!backendId) {
        console.warn(` No backend ID for ${cameraId}`);
        return;
    }
    const img = document.getElementById(`${cameraId}-feed`);
    const placeholder = document.getElementById(`${cameraId}-placeholder`);
    const status = document.getElementById(`${cameraId}-status`);
    if (!img || !placeholder) {
        console.error(`❌ Elements not found for ${cameraId}`);
        return;
    }
    img.src = `/video_feed/${backendId}?t=${Date.now()}`;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
   img.onload = () => {
        console.log(`✅ ${cameraId} feed loaded`);
        placeholder.style.display = 'none';
        if (status) {
            status.className = 'camera-status online';
            status.textContent = 'ONLINE';
        }
    };
    img.onerror = () => {
        console.error(`❌ ${cameraId} failed to load`);
        img.style.display = 'none';
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
            <i class="fas fa-video-slash"></i>
            <p>Камера недоступна</p>
            <small>ID: ${backendId}</small>
            <button onclick="retryCamera('${cameraId}')" class="btn small-btn" style="margin-top: 10px;">
                Повторить
            </button>
        `;
        if (status) {
            status.className = 'camera-status offline';
            status.textContent = 'OFFLINE';
        }
    };
}

async function retryCamera(cameraId) {
    console.log(` Retrying ${cameraId}...`);
    const backendId = cameraMapping[cameraId];
    if (backendId) {
        const img = document.getElementById(`${cameraId}-feed`);
        if (img) {
            img.src = `/video_feed/${backendId}?t=${Date.now()}`;
        }
    }
}

async function updateAllCameraStats() {
    try {
        const response = await fetch('/api/cameras');
        const cameras = await response.json();
        cameras.forEach(camera => {
            let cameraId = null;
            if (camera.id === cameraMapping.camera1) cameraId = 'camera1';
            if (camera.id === cameraMapping.camera2) cameraId = 'camera2';
            if (camera.id === cameraMapping.camera3) cameraId = 'camera3';
            if (cameraId) {
                const fpsSpan = document.getElementById(`${cameraId}-fps`);
                if (fpsSpan) fpsSpan.textContent = camera.fps || 0;
                const detSpan = document.getElementById(`${cameraId}-detections`);
                if (detSpan) detSpan.textContent = camera.detections || 0;
            }
        });

    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

async function toggleCamera(cameraId) {
    const backendId = cameraMapping[cameraId];
    if (!backendId) {
        alert('Камера не настроена');
        return;
    }
    try {
        const response = await fetch(`/api/cameras/${backendId}/toggle`, {
            method: 'POST'
        });
        const data = await response.json();
        const status = document.getElementById(`${cameraId}-status`);
        if (data.status === 'active') {
            status.className = 'camera-status online';
            status.textContent = 'ONLINE';
            const img = document.getElementById(`${cameraId}-feed`);
            if (img) img.src = `/video_feed/${backendId}?t=${Date.now()}`;
        } else {
            status.className = 'camera-status offline';
            status.textContent = 'OFFLINE';
        }
        showNotification(`Камера ${data.status === 'active' ? 'включена' : 'выключена'}`, 'success');
    } catch (error) {
        console.error('Error toggling camera:', error);
        showNotification('Ошибка переключения камеры', 'error');
    }
}

async function startAnalysis(cameraId) {
    const backendId = cameraMapping[cameraId];
    if (!backendId) {
        alert('Камера не настроена');
        return;
    }

    const card = document.getElementById(cameraId);
    if (card) {
        card.style.borderColor = 'var(--accent-green)';
        card.style.boxShadow = '0 0 20px var(--accent-green)';
        const modelType = cameraModels[cameraId] || 'rocket';
        showNotification(`Анализ запущен на ${cameraId} (модель: ${modelType})`, 'success');
        setTimeout(() => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
        }, 2000);
    }
}

async function takeSnapshot(cameraId) {
    const backendId = cameraMapping[cameraId];
    if (!backendId) {
        alert('Камера не настроена');
        return;
    }
    try {
        const response = await fetch(`/api/cameras/${backendId}/snapshot`, {
            method: 'POST'
        });
        const data = await response.json();
        if (data.status === 'success') {
            showNotification(`Снимок сохранен: ${data.filename}`, 'success');
            const preview = document.getElementById(`${cameraId}Preview`);
            if (preview) {
                preview.style.opacity = '0.5';
                setTimeout(() => preview.style.opacity = '1', 200);
            }
            const link = document.createElement('a');
            link.href = data.url;
            link.download = data.filename;
            link.click();
        }
    } catch (error) {
        console.error('Error taking snapshot:', error);
        showNotification('Ошибка создания снимка', 'error');
    }
}

function showCameraInfo(cameraId) {
    const backendId = cameraMapping[cameraId];
    const modelType = cameraModels[cameraId] || 'unknown';
    const source = cameraSources[cameraId] || '?';
    const info = `
         Камера: ${cameraId}
         ID: ${backendId || 'не назначен'}
         Модель: ${modelType}
         Источник: ${source}
         Статус: ${backendId ? 'Активна' : 'Ожидание'}
    `;
    alert(info);
}

function showCameraError() {
    for (let i = 1; i <= 3; i++) {
        const placeholder = document.getElementById(`camera${i}-placeholder`);
        if (placeholder) {
            placeholder.innerHTML = `
                <i class="fas fa-exclamation-triangle" style="color: var(--accent-red);"></i>
                <p>Ошибка подключения</p>
                <small>Проверьте backend</small>
                <button onclick="initializeThreeCameras()" class="btn small-btn" style="margin-top: 10px;">
                    Повторить
                </button>
            `;
        }
    }
}
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('camera1') &&
        document.getElementById('camera2') &&
        document.getElementById('camera3')) {
        console.log(' 3-camera page detected');
        initializeThreeCameras();
    }
});
window.toggleCamera = toggleCamera;
window.startAnalysis = startAnalysis;
window.takeSnapshot = takeSnapshot;
window.showCameraInfo = showCameraInfo;
window.retryCamera = retryCamera;
window.initializeThreeCameras = initializeThreeCameras;