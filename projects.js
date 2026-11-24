document.addEventListener('DOMContentLoaded', () => {
    // Álbum de fotos de la sección «Sobre mí».
    const profileFrame = document.querySelector('.about-image');
    const profileImage = profileFrame?.querySelector('img');

    if (profileFrame && profileImage) {
        const profilePhotos = [
            { src: 'Fondo perfil.jpeg', alt: 'Yael Coy Lozano' },
            { src: 'images/Presentación1.jpeg', alt: 'Presentación de Yael Coy Lozano, foto 1' },
            { src: 'images/Presentación2.jpeg', alt: 'Presentación de Yael Coy Lozano, foto 2' }
        ];
        let currentPhoto = 0;

        profileFrame.classList.add('profile-carousel');
        profileImage.id = 'profile-carousel-image';
        profileImage.setAttribute('aria-live', 'polite');

        const previousButton = document.createElement('button');
        previousButton.className = 'profile-carousel-control profile-carousel-previous';
        previousButton.type = 'button';
        previousButton.setAttribute('aria-label', 'Ver foto anterior');
        previousButton.innerHTML = '<span aria-hidden="true">&#10094;</span>';

        const nextButton = document.createElement('button');
        nextButton.className = 'profile-carousel-control profile-carousel-next';
        nextButton.type = 'button';
        nextButton.setAttribute('aria-label', 'Ver foto siguiente');
        nextButton.innerHTML = '<span aria-hidden="true">&#10095;</span>';

        function showPhoto(index) {
            currentPhoto = (index + profilePhotos.length) % profilePhotos.length;
            profileImage.src = profilePhotos[currentPhoto].src;
            profileImage.alt = profilePhotos[currentPhoto].alt;
        }

        previousButton.addEventListener('click', () => showPhoto(currentPhoto - 1));
        nextButton.addEventListener('click', () => showPhoto(currentPhoto + 1));
        profileFrame.append(previousButton, nextButton);
    }

    // Barra de contacto inmediatamente después de «Sobre mí».
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const contactBar = document.createElement('aside');
        contactBar.className = 'contact-bar';
        contactBar.setAttribute('aria-label', 'Información de contacto');
        contactBar.innerHTML = `
            <div class="contact-bar-inner">
                <strong>Contáctame:</strong>
                <a href="tel:+573108864802">+57 310 8864 802</a>
                <span class="contact-separator" aria-hidden="true">|</span>
                <a href="mailto:yaelcoy@gmail.com">yaelcoy@gmail.com</a>
                <span class="contact-separator" aria-hidden="true">|</span>
                <a href="https://www.linkedin.com/in/yaelcoy" target="_blank" rel="noopener noreferrer">www.linkedin.com/in/yaelcoy</a>
            </div>
        `;
        aboutSection.insertAdjacentElement('afterend', contactBar);
    }

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

        // Delegación para que «Volver» siempre cierre el detalle activo.
        details.addEventListener('click', (event) => {
            const backButton = event.target.closest('.back-to-projects');
            if (!backButton) return;
            event.preventDefault();
            closeProject();
        });

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
                    event.preventDefault();
                    openImage(image);
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
