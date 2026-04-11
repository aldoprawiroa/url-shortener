document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleAdvanced');
    const advancedOptions = document.getElementById('advancedOptions');
    const shortenForm = document.getElementById('shortenForm');
    const shortenBtn = document.getElementById('shortenBtn');
    const resultCard = document.getElementById('resultCard');
    const copyBtn = document.getElementById('copyBtn');
    const generatedUrl = document.getElementById('generatedUrl');

    // --- Modal Sign In Logic ---
    const openLoginBtn = document.getElementById('openLoginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    // Buka Modal
    openLoginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    // Tutup Modal via Tombol X
    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Tutup Modal jika mengklik area gelap di luarnya
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Simulasi Sign In dan redirect ke Dashboard
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('button');
        btn.textContent = 'Authenticating...';
        btn.style.opacity = '0.8';
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    });

    // --- Advanced Options Toggle ---
    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        advancedOptions.classList.toggle('show');
        
        const span = toggleBtn.querySelector('span');
        if (advancedOptions.classList.contains('show')) {
            span.textContent = 'Hide Advanced Options';
        } else {
            span.textContent = 'Advanced Options';
        }
    });

    // --- Mock Submit & Loading State (Bisa digunakan tanpa Sign In!) ---
    shortenForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const originalText = shortenBtn.innerHTML;
        
        shortenBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
            Processing...
        `;
        shortenBtn.style.opacity = '0.8';
        shortenBtn.disabled = true;

        if (!document.getElementById('spinnerStyle')) {
            const style = document.createElement('style');
            style.id = 'spinnerStyle';
            style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            shortenBtn.innerHTML = originalText;
            shortenBtn.style.opacity = '1';
            shortenBtn.disabled = false;

            const customAlias = document.getElementById('customAlias').value;
            const alias = customAlias || Math.random().toString(36).substring(2, 8);
            generatedUrl.textContent = `slice.link/${alias}`; // Sudah diubah ke Slice

            resultCard.style.display = 'block';
            requestAnimationFrame(() => {
                resultCard.classList.add('active');
            });

            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        }, 1200); 
    });

    // --- Copy to Clipboard Functionality ---
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(generatedUrl.textContent);
            
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
            `;
            copyBtn.style.color = '#4ade80';
            copyBtn.style.borderColor = '#4ade80';

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard.');
        }
    });
});