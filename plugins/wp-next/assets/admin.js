/**
 * WP Next Admin Script
 * Alpine.js reactive UI handling
 */

document.addEventListener('alpine:init', () => {
    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.href.split('tab=')[1];
            const activeTab = document.querySelector('.nav-tab-active');
            const activePane = document.querySelector('.tab-pane.active');

            activeTab.classList.remove('nav-tab-active');
            activePane.classList.remove('active');

            this.classList.add('nav-tab-active');
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
});