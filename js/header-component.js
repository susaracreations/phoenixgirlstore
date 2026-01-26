// g:\Pictures\Websites\Phoenix Girl Website\Phoenix Girl v1 - Testing - Copy\js\header-component.js
class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Dynamically inject the CSS file
        if (!document.querySelector('link[href="/css/header.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/header.css';
            document.head.appendChild(link);
        }

        this.innerHTML = `
            <header>
                <div class="header-container">
                    <a href="/" class="logo">Phoenix Girl</a>
                    <div class="header-right">
                        <nav class="main-nav" id="main-nav">
                            <a href="/products.html">Mods</a>
                            <a href="/about.html">About</a>
                        </nav>
                        <div id="user-auth-section" class="user-auth"></div>
                        <button id="mobile-menu-toggle" class="mobile-menu-toggle" aria-label="Toggle navigation">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>
                    </div>
                </div>
            </header>
        `;

        this.highlightActiveLink();
        this.initMobileMenu();
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = this.querySelectorAll('.main-nav a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Highlight if path matches or if it's the home page
            if ((href !== '/' && currentPath.includes(href)) || 
                (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html')))) {
                link.classList.add('active');
            }
        });
    }

    initMobileMenu() {
        const toggleBtn = this.querySelector('#mobile-menu-toggle');
        const nav = this.querySelector('#main-nav');
        const bars = this.querySelectorAll('.bar');
        
        if(toggleBtn && nav) {
            toggleBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                const isActive = nav.classList.contains('active');
                
                // Hamburger animation
                if (isActive) {
                    bars[0].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(45deg) translate(-6px, -6px)';
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                } else {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking a link
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                    document.body.style.overflow = '';
                });
            });
        }
    }
}

customElements.define('header-component', HeaderComponent);
