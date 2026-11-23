document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('projects-grid');
    const details = document.getElementById('project-details');

    if (!grid || !details) return;

    try {
        const response = await fetch('project-zamak.html');
        if (response.ok) {
            const projectMarkup = new DOMParser().parseFromString(await response.text(), 'text/html');
            const cardTemplate = projectMarkup.getElementById('project-zamak-card-template');
            const detailTemplate = projectMarkup.getElementById('project-zamak-detail-template');
            if (cardTemplate && detailTemplate) {
                grid.append(cardTemplate.content.cloneNode(true));
                details.append(detailTemplate.content.cloneNode(true));
            }
        }
    } catch (error) {
        console.error('No se pudo cargar el detalle del proyecto de la potencia.', error);
    }

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
    imageDialog.innerHTML = `
        <button class="image-lightbox-close" type="button" aria-label="Cerrar imagen ampliada">&times;</button>
        <img class="image-lightbox-preview" alt="">
    `;
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

    details.querySelectorAll('.project-header-gallery').forEach((gallery) => {
        const images = [...gallery.querySelectorAll('img')];
        const setColumnRatio = () => {
            if (images.every((image) => image.complete && image.naturalWidth && image.naturalHeight)) {
                gallery.style.gridTemplateColumns = images.map((image) => `${image.naturalWidth / image.naturalHeight}fr`).join(' ');
            }
        };
        images.forEach((image) => image.addEventListener('load', setColumnRatio, { once: true }));
        setColumnRatio();
    });

    details.querySelectorAll('.project-fea-gallery img, .project-image-gallery img').forEach((image) => {
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-haspopup', 'dialog');
        image.setAttribute('aria-label', `${image.alt} Abrir imagen ampliada`);
        image.addEventListener('click', () => openImage(image));
        image.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openImage(image);
            }
        });
    });

    closeImageButton.addEventListener('click', closeImage);
    imageDialog.addEventListener('click', (event) => {
        if (event.target === imageDialog) closeImage();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !details.hidden && !imageDialog.open) closeProject();
    });
});
