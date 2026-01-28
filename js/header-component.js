class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!document.querySelector('link[href="/css/header.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/header.css';
            document.head.appendChild(link);
        }

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
                             <a href="/login.html" class="login-btn-shared">Login</a>
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

        this.initMobileMenu();
    }

    initMobileMenu() {
        const toggleBtn = this.querySelector('#mobile-menu-toggle');
        const nav = this.querySelector('#main-nav');
        
        if (toggleBtn && nav) {
            toggleBtn.addEventListener('click', () => {
                const isActive = nav.classList.toggle('active');
                // Simple bar change
                const bars = this.querySelectorAll('.bar');
                bars[0].style.transform = isActive ? 'rotate(-45deg) translate(-5px, 5px)' : 'none';
                bars[1].style.opacity = isActive ? '0' : '1';
                bars[2].style.transform = isActive ? 'rotate(45deg) translate(-5px, -5px)' : 'none';
                
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
        }
    }
}

customElements.define('header-component', HeaderComponent);