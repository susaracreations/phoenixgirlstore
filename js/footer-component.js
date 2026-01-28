class FooterComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Ensure the CSS is loaded only once
        if (!document.querySelector('link[href="/css/footer.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/footer.css';
            document.head.appendChild(link);
        }

        this.innerHTML = `
            <footer class="site-footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <h3>Phoenix Girl</h3>
                        <p>Creating immersive mods and digital experiences. Join our community to stay updated with the latest releases and exclusive content.</p>
                    </div>
                    <div class="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="products.html">Mods</a></li>
                            <li><a href="about.html">About Us</a></li>
                        </ul>
                    </div>
                    <div class="footer-links">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="https://discord.com/invite/NPpsXz5RzR" id="footer-discord-link" target="_blank">Discord</a></li>
                            <li><a href="https://www.youtube.com/@GenuraCreations-m3e" id="footer-youtube-link" target="_blank">YouTube</a></li>
                            <li><a href="https://api.whatsapp.com/send/?phone=%2B94772702422&text&type=phone_number&app_absent=0">Whatsapp</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Phoenix Girl Mods Store. Based in Sri Lanka.</p>
                </div>
            </div>
        </footer>
        `;
    }
}

customElements.define('footer-component', FooterComponent);