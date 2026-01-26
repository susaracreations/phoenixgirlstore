document.addEventListener('DOMContentLoaded', () => {
    // Configuration: Add multiple URLs to this array to use images (SVG/PNG). Leave empty to use text characters.
    const snowflakeImageUrls = [
        ""
    ]; 

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
            width: 0.5em;
            height: 0.5em;
        }
        .snowflake-inner {
            width: 100%;
            height: 100%;
            display: block;
            will-change: transform;
        }
        .snowflake img {
            width: 100%;
            height: 100%;
            display: block;
        }
        @keyframes fall {
            0% { transform: translateY(-10vh); opacity: 1; }
            100% { transform: translateY(110vh); opacity: 0.2; }
        }
        @keyframes sway1 {
            0% { transform: translateX(-25px) rotate(0deg); }
            50% { transform: translateX(25px) rotate(180deg); }
            100% { transform: translateX(-25px) rotate(360deg); }
        }
        @keyframes sway2 {
            0% { transform: translateX(25px) rotate(0deg); }
            50% { transform: translateX(-25px) rotate(-180deg); }
            100% { transform: translateX(25px) rotate(-360deg); }
        }
    `;
    document.head.appendChild(style);

    // Function to create a single snowflake
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        const inner = document.createElement('div');
        inner.classList.add('snowflake-inner');

        if (snowflakeImageUrls.length > 0) {
            const img = document.createElement('img');
            img.src = snowflakeImageUrls[Math.floor(Math.random() * snowflakeImageUrls.length)];
            inner.appendChild(img);
        } else {
            inner.textContent = ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
        }
        
        snowflake.appendChild(inner);

        const startLeft = Math.random() * 100; // Random horizontal position (0-100vw)
        const duration = Math.random() * 5 + 5; // Random fall duration (5-10s)
        const size = Math.random() * 1 + 0.8; // Random size (0.8-1.8rem)
        
        snowflake.style.left = `${startLeft}vw`;
        snowflake.style.fontSize = `${size}rem`;
        snowflake.style.animation = `fall ${duration}s linear`;
        
        // Add random sway animation to inner element
        const swayType = Math.floor(Math.random() * 2) + 1; // 1 or 2
        const swayDuration = Math.random() * 4 + 3; // 3-7s
        inner.style.animation = `sway${swayType} ${swayDuration}s ease-in-out infinite`;

        document.body.appendChild(snowflake);
        
        // Remove the snowflake after it finishes falling to prevent memory leaks
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    // Start the snow effect
    setInterval(createSnowflake, 300);
});