// Таймер обратного отсчета до 7 февраля 2026 года, 10:00 (Москва, GMT+3)
class SportsCountdown {
    constructor() {
        // Устанавливаем целевую дату: 7 февраля 2026, 10:00 по Москве (GMT+3)
        this.targetDate = new Date('2026-02-07T10:00:00+03:00'); // 10:00 MSK
        
        console.log('Целевая дата установлена:', this.targetDate.toLocaleString('ru-RU'));
        
        // Элементы DOM
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            dayProgress: document.getElementById('dayProgress'),
            hourProgress: document.getElementById('hourProgress'),
            minuteProgress: document.getElementById('minuteProgress'),
            secondProgress: document.getElementById('secondProgress'),
            statusBadge: document.getElementById('statusBadge'),
            currentTime: document.getElementById('currentTime'),
            currentDate: document.getElementById('currentDate'),
            motivationText: document.getElementById('motivationText')
        };
        
        console.log('Найденные элементы:', this.elements);
        
        // Мотивационные сообщения
        this.motivations = [
            "Горы зовут тех, чья душа им по росту! Готовьтесь к самому захватывающему спортивному событию года.",
            "Сильнейшие команды страны готовятся к битве за вершину. Кто станет чемпионом?",
            "Приключение начинается с первого шага. Осталось совсем немного до старта!",
            "Спортивный туризм - это искусство побеждать себя и покорять вершины.",
            "В горах нет легких путей, но есть те, что ведут к победе. Готовьтесь!",
            "24 команды, 6 дисциплин, 1 цель - стать лучшими в стране!",
            "Снежные вершины ждут своих героев. Остались считанные дни до старта!",
            "Подготовка, выносливость, команда - ключи к победе в горных соревнованиях.",
            "Каждая секунда отсчета приближает нас к началу великих состязаний.",
            "Горный воздух, адреналин и дух соперничества - всё это ждет участников!"
        ];
        
        // Статусы
        this.statuses = {
            normal: { text: "СОРЕВНОВАНИЯ НАЧНУТСЯ", color: "#4facfe", icon: "fa-spinner" },
            soon: { text: "СКОРО СТАРТ!", color: "#ffd700", icon: "fa-bolt" },
            verySoon: { text: "ОСТАЛОСЬ МЕНЬШЕ СУТОК!", color: "#ff9800", icon: "fa-hourglass-half" },
            immediate: { text: "СТАРТ УЖЕ СЕГОДНЯ!", color: "#ff5722", icon: "fa-running" },
            ended: { text: "СОРЕВНОВАНИЯ НАЧАЛИСЬ!", color: "#4CAF50", icon: "fa-flag-checkered" }
        };
        
        this.updateInterval = null;
        this.currentTimeInterval = null;
        this.motivationInterval = null;
        
        // Инициализация
        this.init();
    }
    
    init() {
        console.log('Инициализация таймера...');
        
        try {
            // Запускаем обновление времени
            this.update();
            this.updateInterval = setInterval(() => this.update(), 1000);
            
            // Обновляем текущее время
            this.updateCurrentTime();
            this.currentTimeInterval = setInterval(() => this.updateCurrentTime(), 1000);
            
            // Меняем мотивационные сообщения каждые 30 секунд
            this.changeMotivation();
            this.motivationInterval = setInterval(() => this.changeMotivation(), 30000);
            
            console.log('Таймер успешно инициализирован');
        } catch (error) {
            console.error('Ошибка при инициализации таймера:', error);
        }
    }
    
    update() {
        try {
            const now = new Date();
            const timeDiff = this.targetDate - now;
            
            // Если время наступило
            if (timeDiff <= 0) {
                this.handleCountdownEnd();
                return;
            }
            
            // Рассчитываем оставшееся время
            const totalSeconds = Math.floor(timeDiff / 1000);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            // Обновляем отображение
            if (this.elements.days) this.elements.days.textContent = days.toString().padStart(2, '0');
            if (this.elements.hours) this.elements.hours.textContent = hours.toString().padStart(2, '0');
            if (this.elements.minutes) this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
            if (this.elements.seconds) this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
            
            // Обновляем прогресс-бары
            if (this.elements.dayProgress) {
                this.elements.dayProgress.style.width = `${100 - (days % 30) * 3.33}%`;
            }
            if (this.elements.hourProgress) {
                this.elements.hourProgress.style.width = `${100 - (hours % 24) * 4.17}%`;
            }
            if (this.elements.minuteProgress) {
                this.elements.minuteProgress.style.width = `${100 - (minutes % 60) * 1.67}%`;
            }
            if (this.elements.secondProgress) {
                this.elements.secondProgress.style.width = `${100 - (seconds % 60) * 1.67}%`;
            }
            
            // Обновляем статус
            this.updateStatus(days, hours);
            
            // Добавляем анимацию для последней минуты
            if (days === 0 && hours === 0 && minutes < 5) {
                this.addFinalMinuteAnimation();
            }
        } catch (error) {
            console.error('Ошибка в update:', error);
        }
    }
    
    updateStatus(days, hours) {
        try {
            let status;
            
            if (days > 7) {
                status = this.statuses.normal;
            } else if (days > 1) {
                status = this.statuses.soon;
            } else if (days === 1) {
                status = this.statuses.verySoon;
            } else if (days === 0 && hours > 1) {
                status = this.statuses.immediate;
            } else {
                status = this.statuses.immediate;
            }
            
            if (this.elements.statusBadge) {
                this.elements.statusBadge.innerHTML = `<i class="fas ${status.icon}"></i><span>${status.text}</span>`;
                this.elements.statusBadge.style.background = `linear-gradient(135deg, ${status.color} 0%, ${this.lightenColor(status.color, 20)} 100%)`;
                
                // Добавляем пульсацию для срочных статусов
                if (days < 2) {
                    this.elements.statusBadge.classList.add('pulse-animation');
                } else {
                    this.elements.statusBadge.classList.remove('pulse-animation');
                }
            }
        } catch (error) {
            console.error('Ошибка в updateStatus:', error);
        }
    }
    
    updateCurrentTime() {
        try {
            const now = new Date();
            
            // Форматируем время
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                timeZone: 'Europe/Moscow'
            };
            
            const dateOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Europe/Moscow'
            };
            
            if (this.elements.currentTime) {
                this.elements.currentTime.textContent = now.toLocaleTimeString('ru-RU', timeOptions);
            }
            
            if (this.elements.currentDate) {
                this.elements.currentDate.textContent = now.toLocaleDateString('ru-RU', dateOptions);
            }
        } catch (error) {
            console.error('Ошибка в updateCurrentTime:', error);
        }
    }
    
    handleCountdownEnd() {
        try {
            console.log('Счетчик достиг нуля!');
            
            // Время наступило
            if (this.elements.days) this.elements.days.textContent = '00';
            if (this.elements.hours) this.elements.hours.textContent = '00';
            if (this.elements.minutes) this.elements.minutes.textContent = '00';
            if (this.elements.seconds) this.elements.seconds.textContent = '00';
            
            // Обновляем статус
            const status = this.statuses.ended;
            if (this.elements.statusBadge) {
                this.elements.statusBadge.innerHTML = `<i class="fas ${status.icon}"></i><span>${status.text}</span>`;
                this.elements.statusBadge.style.background = `linear-gradient(135deg, ${status.color} 0%, ${this.lightenColor(status.color, 20)} 100%)`;
            }
            
            // Останавливаем интервалы
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            if (this.currentTimeInterval) {
                clearInterval(this.currentTimeInterval);
            }
            if (this.motivationInterval) {
                clearInterval(this.motivationInterval);
            }
            
            // Запускаем праздничную анимацию
            this.startCelebration();
        } catch (error) {
            console.error('Ошибка в handleCountdownEnd:', error);
        }
    }
    
    addFinalMinuteAnimation() {
        try {
            // Добавляем класс анимации для элементов таймера
            const numbers = [
                this.elements.days,
                this.elements.hours,
                this.elements.minutes,
                this.elements.seconds
            ];
            
            numbers.forEach(el => {
                if (el) {
                    el.classList.add('pulse-animation');
                    
                    // Удаляем анимацию через 1 секунду
                    setTimeout(() => {
                        el.classList.remove('pulse-animation');
                    }, 1000);
                }
            });
        } catch (error) {
            console.error('Ошибка в addFinalMinuteAnimation:', error);
        }
    }
    
    changeMotivation() {
        try {
            if (this.elements.motivationText) {
                const randomIndex = Math.floor(Math.random() * this.motivations.length);
                this.elements.motivationText.textContent = this.motivations[randomIndex];
                
                // Добавляем анимацию появления
                this.elements.motivationText.classList.add('fade-in');
                setTimeout(() => {
                    if (this.elements.motivationText) {
                        this.elements.motivationText.classList.remove('fade-in');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Ошибка в changeMotivation:', error);
        }
    }
    
    startCelebration() {
        try {
            console.log("Запуск праздничной анимации!");
            
            // Добавляем CSS для анимаций
            const style = document.createElement('style');
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                
                .confetti {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background-color: #4CAF50;
                    top: -10px;
                    z-index: 9999;
                    pointer-events: none;
                    animation: confetti-fall 3s linear forwards;
                }
            `;
            document.head.appendChild(style);
            
            // Запускаем конфетти-эффект
            this.createConfetti();
        } catch (error) {
            console.error('Ошибка в startCelebration:', error);
        }
    }
    
    createConfetti() {
        try {
            const colors = ['#4facfe', '#00f2fe', '#ffd700', '#4CAF50', '#ff9800'];
            const confettiCount = 100;
            
            for (let i = 0; i < confettiCount; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = `${Math.random() * 100}vw`;
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.width = `${Math.random() * 10 + 5}px`;
                    confetti.style.height = `${Math.random() * 10 + 5}px`;
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
                    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
                    
                    document.body.appendChild(confetti);
                    
                    // Удаляем после анимации
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    }, 5000);
                }, i * 30);
            }
        } catch (error) {
            console.error('Ошибка в createConfetti:', error);
        }
    }
    
    lightenColor(color, percent) {
        try {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.min(255, (num >> 16) + amt);
            const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
            const B = Math.min(255, (num & 0x0000FF) + amt);
            
            return "#" + (
                0x1000000 +
                R * 0x10000 +
                G * 0x100 +
                B
            ).toString(16).slice(1);
        } catch (error) {
            console.error('Ошибка в lightenColor:', error);
            return color;
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем таймер...');
    
    try {
        const countdown = new SportsCountdown();
        window.sportsCountdown = countdown; // Для отладки в консоли
        
        console.log('Таймер создан, можно обратиться через window.sportsCountdown');
    } catch (error) {
        console.error('Критическая ошибка при создании таймера:', error);
        alert('Произошла ошибка при загрузке таймера. Пожалуйста, обновите страницу.');
    }
});

// Добавляем базовые CSS анимации
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .pulse-animation {
            animation: pulse 1s ease-in-out infinite;
        }
        
        .fade-in {
            animation: fadeIn 1s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Анимация для чисел таймера при изменении */
        .countdown-number {
            transition: all 0.3s ease;
        }
        
        .countdown-number.changing {
            animation: numberChange 0.5s ease;
        }
        
        @keyframes numberChange {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    console.log('CSS анимации добавлены');
})();