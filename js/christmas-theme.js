document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS for the snowflakes
    const style = document.createElement('style');
    style.textContent = `
        .snowflake {
            position: fixed;
            top: -2rem;
            z-index: 9999;
            color: #ffffff;
            text-shadow: 0 0 3px rgba(0,0,0,0.3);
            font-family: sans-serif;
            user-select: none;
            pointer-events: none;
            will-change: transform;
        }
        @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0.2; }
        }
    `;
    document.head.appendChild(style);

    // Function to create a single snowflake
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
        
        const startLeft = Math.random() * 100; // Random horizontal position (0-100vw)
        const duration = Math.random() * 5 + 5; // Random fall duration (5-10s)
        const size = Math.random() * 1 + 0.8; // Random size (0.8-1.8rem)
        
        snowflake.style.left = `${startLeft}vw`;
        snowflake.style.fontSize = `${size}rem`;
        snowflake.style.animation = `fall ${duration}s linear`;
        
        document.body.appendChild(snowflake);
        
        // Remove the snowflake after it finishes falling to prevent memory leaks
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    // Start the snow effect
    setInterval(createSnowflake, 300);
});