document.addEventListener('DOMContentLoaded', () => {
    // Hoja de estilos compacta para mostrar tres tarjetas por fila en escritorio.
    const projectGridStyles = document.createElement('link');
    projectGridStyles.rel = 'stylesheet';
    projectGridStyles.href = 'projects-grid.css';
    document.head.append(projectGridStyles);

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

    // Acceso a la hoja de vida justo debajo de la presentación «Sobre mí».
    const aboutContent = document.querySelector('#about .about-content');
    if (aboutContent) {
        const resumeActions = document.createElement('div');
        resumeActions.className = 'resume-actions';
        resumeActions.innerHTML = `
            <a class="resume-button" href="Yael_Coy_Lozano_Resume_comp.pdf" target="_blank" rel="noopener noreferrer" aria-label="Abrir hoja de vida en PDF en una pestaña nueva">
                Ver hoja de vida <span aria-hidden="true">&#8599;</span>
            </a>
            <a class="resume-download" href="Yael_Coy_Lozano_Resume_comp.pdf" download="Yael_Coy_Lozano_Resume_comp.pdf">
                Descargar PDF
            </a>
        `;

        const resumeStyles = document.createElement('style');
        resumeStyles.textContent = `
            .resume-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 18px; margin: 24px 0 0; }
            .resume-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border: 1px solid #38bdf8; border-radius: 999px; background: rgba(56, 189, 248, 0.14); color: #7dd3fc; font: inherit; font-size: 1rem; font-weight: 700; text-decoration: none; transition: background-color 0.2s ease, transform 0.2s ease; }
            .resume-button:hover { transform: translateY(-2px); background: rgba(56, 189, 248, 0.25); }
            .resume-button:focus-visible, .resume-download:focus-visible { outline: 3px solid #38bdf8; outline-offset: 4px; }
            .resume-download { color: #cbd5e1; font-size: 0.95rem; text-underline-offset: 4px; }
            .resume-download:hover { color: #7dd3fc; }
            @media (max-width: 480px) { .resume-actions { gap: 10px; } }
        `;
        document.head.append(resumeStyles);
        aboutContent.insertAdjacentElement('afterend', resumeActions);
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

    const projectFiles = [
        'project-cubesat.html',
        'project-plato.html',
        'project-zamak.html',
        'project-recubrimiento.html'
    ];

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
        const backButtons = details.querySelectorAll('.back-to-projects');
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

        // Añade el manejador directamente a cada botón después de cargar las plantillas.
        backButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                closeProject();
            });
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
