document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const details = document.getElementById('project-details');
    if (!grid || !details) return;

    const projectFiles = ['project-plato.html', 'project-zamak.html'];

    async function loadProjectTemplates() {
        for (const file of projectFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) continue;
                const markup = await response.text();
                const container = document.createElement('template');
                container.innerHTML = markup;
                container.content.childNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TEMPLATE') {
                        if (node.id.includes('-card-template')) grid.append(node.content.cloneNode(true));
                        if (node.id.includes('-detail-template')) details.append(node.content.cloneNode(true));
                    }
                });
            } catch (error) {
                console.warn(`No se pudo cargar ${file}`, error);
            }
        }

        setupProjects();
    }

    function setupProjects() {
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

        const imageDialog = document.createElement('dialog');
        imageDialog.className = 'image-lightbox';
        imageDialog.setAttribute('aria-label', 'Imagen ampliada del proyecto');
        imageDialog.innerHTML = '<button class="image-lightbox-close" type="button" aria-label="Cerrar imagen ampliada">&times;</button><img class="image-lightbox-preview" alt="">';
        document.body.append(imageDialog);

        const preview = imageDialog.querySelector('.image-lightbox-preview');
        const closeImageButton = imageDialog.querySelector('.image-lightbox-close');

        function openImage(image) {
            preview.src = image.src;
            preview.alt = image.alt;
            imageDialog.showModal();
            closeImageButton.focus();
        }

        function closeImage() {
            if (imageDialog.open) imageDialog.close();
        }

        details.querySelectorAll('.project-figure img, .project-fea-gallery img').forEach((image) => {
            image.tabIndex = 0;
            image.setAttribute('role', 'button');
            image.setAttribute('aria-haspopup', 'dialog');
            image.setAttribute('aria-label', `${image.alt}. Abrir imagen ampliada`);
            image.addEventListener('click', () => openImage(image));
            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventEventDefault();
                }
            });
        });

        closeImageButton.addEventListener('click', closeImage);
        imageDialog.addEventListener('click', (event) => { if (event.target === imageDialog) closeImage(); });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !details.hidden) closeProject();
        });
    }

    loadProjectTemplates();
});
