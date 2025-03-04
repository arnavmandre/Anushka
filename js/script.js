document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('background-music');
    const toggleSoundBtn = document.getElementById('toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    const playMusicBtn = document.getElementById('play-music');
    const beginJourneyBtn = document.getElementById('begin-journey');
    const poemElement = document.getElementById('poem');
    const sections = document.querySelectorAll('section');
    const progressDots = document.querySelectorAll('.progress-dot');
    const choiceYesBtn = document.getElementById('choice-yes');
    const choiceYesssBtn = document.getElementById('choice-yesss');
    const replayButton = document.getElementById('replay-button');
    
    let currentSection = 0;
    let isMuted = false;

    const referenceDate = new Date();
    referenceDate.setHours(0, 0, 0, 0);

    const startDate = new Date(referenceDate);
    startDate.setMonth(referenceDate.getMonth() - 7);
    
    createFloatingElements();
    
    updateLoveCounter();
    setInterval(updateLoveCounter, 60000);
    
    backgroundMusic.load();
    
    toggleSoundBtn.addEventListener('click', toggleSound);
    beginJourneyBtn.addEventListener('click', () => navigateToSection(1));
    choiceYesBtn.addEventListener('click', () => navigateToSection(3));
    choiceYesssBtn.addEventListener('click', () => navigateToSection(3));
    replayButton.addEventListener('click', resetJourney);
    
    playMusicBtn.addEventListener('click', function() {
        playAudio();
        this.textContent = "Music Playing! 🎵";
        setTimeout(() => {
            this.style.opacity = "0.5";
        }, 2000);
    });
    
    initHeartCursor();
    
    function playAudio() {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play()
            .then(() => {
                console.log("Audio playing successfully");
                soundIcon.classList.remove('fa-volume-mute');
                soundIcon.classList.add('fa-volume-up');
                isMuted = false;
            })
            .catch(e => {
                console.error("Audio play failed:", e);
                alert("Please click the 'Play Music' button to enable sound!");
            });
    }
    
    function toggleSound() {
        if (isMuted) {
            playAudio();
        } else {
            backgroundMusic.pause();
            soundIcon.classList.remove('fa-volume-up');
            soundIcon.classList.add('fa-volume-mute');
        }
        isMuted = !isMuted;
    }
    
    function navigateToSection(index) {
        sections[currentSection].classList.remove('active');
        progressDots[currentSection].classList.remove('active');
        
        sections[index].classList.add('active');
        progressDots[index].classList.add('active');
        
        if (index === 1) {
            typeWriterEffect();
        } else if (index === 3) {
            triggerConfetti();
            
            setTimeout(() => navigateToSection(4), 3000);
        }
        
        currentSection = index;
    }
    
    function typeWriterEffect() {
        const poem = [
            "Seven months of falling deeper in love,",
            "Into the ocean of your eyes",
            "Seven months of growing stronger together,",
            "With every laugh and every smile",
            "",
            "Your smile Brightens my darkest days,",
            "Your touch calms my biggest fears",
            "Each moment spent in you my love,",
            "Is worth more than a thousand years",
            "",
            "Seven months passed by so quickly,",
            "In the blink of an eye",
            "But every second with you, my love,",
            "Has been nothing less than a dream come true",
            "",
            "Here's to us, to more tomorrows,",
            "To memories we are yet to make.",
            "Seven months of falling deeper in love with you,",
            "With you, everything is just right"
        ];
        
        let i = 0;
        let line = 0;
        poemElement.textContent = "";
        
        function type() {
            if (line < poem.length) {
                if (i < poem[line].length) {
                    poemElement.textContent += poem[line].charAt(i);
                    i++;
                    setTimeout(type, 50);
                } else {
                    poemElement.textContent += "\n";
                    line++;
                    i = 0;
                    setTimeout(type, 500);
                }
            } else {
                setTimeout(() => navigateToSection(2), 2000);
            }
        }
        
        type();
    }
    
    function triggerConfetti() {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 50 * (timeLeft / duration);
            
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);
    }
    
    function initHeartCursor() {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        
        const hearts = [];
        const colors = ['#ff7ac6', '#ff0a54', '#ff477e', '#ff5c8a', '#ff7096'];
        
        // Track cursor movement
        let lastX = 0;
        let lastY = 0;
        let currentX = 0;
        let currentY = 0;
        
        document.addEventListener('mousemove', function(e) {
            // Update cursor position
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Track movement
            lastX = currentX;
            lastY = currentY;
            currentX = e.clientX;
            currentY = e.clientY;
            
            // Calculate movement direction
            const directionX = currentX - lastX;
            const directionY = currentY - lastY;
            
            // Only create hearts if there's significant movement
            if (Math.abs(directionX) > 1 || Math.abs(directionY) > 1) {
                if (Math.random() > 0.7) { // Adjust frequency of hearts
                    createHeart(e.clientX, e.clientY, directionX, directionY);
                }
            }
        });
        
        function createHeart(x, y, dirX, dirY) {
            const heart = document.createElement('div');
            heart.classList.add('heart-particle');
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            heart.innerHTML = '❤';
            heart.style.position = 'fixed';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            
            document.body.appendChild(heart);
            
            // Calculate direction based on cursor movement
            // Add some randomness but keep general direction
            const randomFactor = 0.3; // Lower = more aligned with cursor
            const angle = Math.atan2(dirY, dirX);
            const randomAngle = angle + (Math.random() - 0.5) * randomFactor;
            
            hearts.push({
                element: heart,
                x: x,
                y: y,
                // Use the cursor direction with slight randomness
                direction: randomAngle,
                // Slower speed for smoother trail
                speed: 0.5 + Math.random() * 1.5,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                opacity: 1,
                // Slower fade for longer trail
                fadeSpeed: 0.005 + Math.random() * 0.005
            });
            
            if (hearts.length > 100) {
                const removedHeart = hearts.shift();
                document.body.removeChild(removedHeart.element);
            }
        }
        
        function animateHearts() {
            for (let i = 0; i < hearts.length; i++) {
                const heart = hearts[i];
                heart.x += Math.cos(heart.direction) * heart.speed;
                heart.y += Math.sin(heart.direction) * heart.speed;
                heart.rotation += heart.rotationSpeed;
                heart.opacity -= heart.fadeSpeed;
                
                heart.element.style.left = heart.x + 'px';
                heart.element.style.top = heart.y + 'px';
                heart.element.style.transform = `translate(-50%, -50%) rotate(${heart.rotation}rad) scale(${heart.opacity})`;
                heart.element.style.opacity = heart.opacity;
                
                if (heart.opacity <= 0) {
                    document.body.removeChild(heart.element);
                    hearts.splice(i, 1);
                    i--;
                }
            }
            
            requestAnimationFrame(animateHearts);
        }
        
        animateHearts();
    }
    
    function createFloatingElements() {
        const containers = document.querySelectorAll('.floating-elements');
        
        containers.forEach(container => {
            for (let i = 0; i < 20; i++) {
                const element = document.createElement('div');
                element.classList.add('floating-element');
                
                if (i % 2 === 0) {
                    element.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23ffffff" viewBox="0 0 16 16"><path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748z"/></svg>\')';
                } else {
                    element.style.backgroundImage = 'url(\'assets/images/rose-petals.png\')';
                }
                
                const size = Math.random() * 30 + 10;
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                
                element.style.left = `${Math.random() * 100}%`;
                
                const duration = Math.random() * 10 + 10;
                element.style.animationDuration = `${duration}s`;
                
                element.style.animationDelay = `${Math.random() * 10}s`;
                
                container.appendChild(element);
            }
        });
    }
    
    function updateLoveCounter() {
        const currentDate = new Date();
        const diff = currentDate - startDate;
        
        const months = 7;
        
        const daysSinceReference = Math.floor((currentDate - referenceDate) / (1000 * 60 * 60 * 24));
        
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = daysSinceReference;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
    }
    
    function resetJourney() {
        navigateToSection(0);
    }
    
    document.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('glowing-heart')) {
            event.target.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                event.target.style.transform = '';
            }, 300);
        }
    });
    
    document.addEventListener('click', function() {
        const audio = document.getElementById('background-music');
        audio.volume = 0.5;
        
        audio.play().then(() => {
            console.log("Audio started automatically after first click");
            document.getElementById('sound-icon').classList.remove('fa-volume-mute');
            document.getElementById('sound-icon').classList.add('fa-volume-up');
            document.getElementById('play-music').textContent = "Music Playing! 🎵";
            document.getElementById('play-music').style.opacity = "0.5";
        }).catch(err => {
            console.error("Could not autoplay:", err);
        });
    }, { once: true });
    
    beginJourneyBtn.addEventListener('click', function() {
        playAudio();
    });
});

document.getElementById('play-music').addEventListener('click', function() {
    console.log('Play button clicked');
    const audio = document.getElementById('background-music');
    audio.play().then(() => {
        console.log('Audio playing successfully');
    }).catch(err => {
        console.error('Audio play failed:', err);
    });
}); 