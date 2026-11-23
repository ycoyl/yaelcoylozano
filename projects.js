document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const details = document.getElementById('project-details');
    const backButton = details.querySelector('.back-to-projects');
    const cards = grid.querySelectorAll('[data-project]');
    const panels = details.querySelectorAll('.project-detail');
    let lastSelectedCard = null;
    let pageScrollY = 0;
    let previousHtmlOverflow = '';
    let previousBodyOverflow = '';

    function lockPageScroll() {
        pageScrollY = window.scrollY;
        previousHtmlOverflow = document.documentElement.style.overflow;
        previousBodyOverflow = document.body.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function restorePageScroll() {
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;
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
            details.scrollTop = 0;
            panel.focus({ preventScroll: true });
        });
    });

    backButton.addEventListener('click', closeProject);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !details.hidden) closeProject();
    });
});
