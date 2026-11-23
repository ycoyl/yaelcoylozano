document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const details = document.getElementById('project-details');
    const backButton = details.querySelector('.back-to-projects');
    const cards = grid.querySelectorAll('[data-project]');
    const panels = details.querySelectorAll('.project-detail');
    let lastSelectedCard = null;
    let pageScrollY = 0;

    function lockPageScroll() {
        pageScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${pageScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
    }

    function restorePageScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, pageScrollY);
    }

    function closeProject() {
        details.hidden = true;
        panels.forEach((panel) => { panel.hidden = true; });
        grid.hidden = false;
        restorePageScroll();
        if (lastSelectedCard) lastSelectedCard.focus({ preventScroll: true });
    }

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const panel = document.getElementById(`detail-${card.dataset.project}`);
            if (!panel) return;

            lastSelectedCard = card;
            lockPageScroll();
            grid.hidden = true;
            panels.forEach((item) => { item.hidden = item !== panel; });
            details.hidden = false;
            panel.focus();
            details.scrollTop = 0;
        });
    });

    backButton.addEventListener('click', closeProject);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !details.hidden) closeProject();
    });
});
