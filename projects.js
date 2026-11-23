document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const details = document.getElementById('project-details');

    if (!grid || !details) return;

    const backButton = details.querySelector('.back-to-projects');
    const cards = grid.querySelectorAll('[data-project]');
    const panels = details.querySelectorAll('.project-detail');
    let lastSelectedCard = null;
    let pageScrollY = 0;

    function lockPageScroll() {
        pageScrollY = window.scrollY;
        document.documentElement.classList.add('project-open');
        document.body.classList.add('project-open');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    function restorePageScroll() {
        document.documentElement.classList.remove('project-open');
        document.body.classList.remove('project-open');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
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
