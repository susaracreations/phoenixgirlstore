class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.querySelector('link[href*="css/header.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/header.css';
            document.head.appendChild(link);
        }

        // This component no longer handles auth state. It just renders the structure.
        // user-auth.js will populate the #user-auth-section.
        this.render();
        this.initMobileMenu();
        this.initScrollBehavior();
    }

    render() {
        this.innerHTML = `
            <header>
                <div class="header-container">
                    <a href="/" class="logo"><span>Phoenix</span> Girl</a>
                    <div class="header-right">
                        <nav class="main-nav" id="main-nav">
                            <a href="/products.html">Mods</a>
                            <a href="/about.html">About</a>
                        </nav>
                        
                        <div class="user-auth" id="user-auth-section">
                             <!-- Auth UI is rendered here by user-auth.js -->
                        </div>

                        <button id="mobile-menu-toggle" class="mobile-menu-toggle" aria-label="Menu">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </button>
                    </div>
                </div>
            </header>
        `;

        // Immediately trigger auth update now that the DOM elements exist
        if (window.updateUserNav) {
            window.updateUserNav();
        }
    }

    initScrollBehavior() {
        const header = this.querySelector('header');
        if (!header) return;

        // Add a class on scroll for dynamic styling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true }); // Use passive listener for better scroll performance
    }

    initMobileMenu() {
        const toggleBtn = this.querySelector('#mobile-menu-toggle');
        const nav = this.querySelector('#main-nav');
        const bars = this.querySelectorAll('.bar');
        
        if (toggleBtn && nav) {
            toggleBtn.addEventListener('click', () => {
                const isActive = nav.classList.toggle('active');
                bars[0].style.transform = isActive ? 'rotate(-45deg) translate(-5px, 5px)' : 'none';
                bars[1].style.opacity = isActive ? '0' : '1';
                bars[2].style.transform = isActive ? 'rotate(45deg) translate(-5px, -5px)' : 'none';
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
        }
    }
}

customElements.define('header-component', HeaderComponent);