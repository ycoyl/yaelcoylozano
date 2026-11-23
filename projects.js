document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const details = document.getElementById('project-details');
    const backButton = details.querySelector('.back-to-projects');
    const cards = grid.querySelectorAll('[data-project]');
    const panels = details.querySelectorAll('.project-detail');

    function closeProject() {
        details.hidden = true;
        panels.forEach((panel) => { panel.hidden = true; });
        grid.hidden = false;
        const projectsHeading = document.querySelector('#projects h2');
        projectsHeading.setAttribute('tabindex', '-1');
        projectsHeading.focus();
    }

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const panel = document.getElementById(`detail-${card.dataset.project}`);
            if (!panel) return;

            grid.hidden = true;
            panels.forEach((item) => { item.hidden = item !== panel; });
            details.hidden = false;
            panel.focus();
            details.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    backButton.addEventListener('click', closeProject);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !details.hidden) closeProject();
    });
});
