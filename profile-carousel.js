const profilePhotos = [
    {
        src: 'images/Presentaci%C3%B3n1.jpeg',
        alt: 'Yael Coy Lozano — foto 1 de 3'
    },
    {
        src: 'images/Presentaci%C3%B3n2.jpeg',
        alt: 'Yael Coy Lozano — foto 2 de 3'
    },
    {
        src: 'images/Presentaci%C3%B3n3.jpeg',
        alt: 'Yael Coy Lozano — foto 3 de 3'
    }
];

const profilePhoto = document.querySelector('#profile-photo');
const profilePhotoCounter = document.querySelector('#profile-photo-counter');
const previousPhotoButton = document.querySelector('.profile-carousel-previous');
const nextPhotoButton = document.querySelector('.profile-carousel-next');

if (profilePhoto && profilePhotoCounter && previousPhotoButton && nextPhotoButton) {
    let currentPhotoIndex = 0;

    const showPhoto = (index) => {
        currentPhotoIndex = (index + profilePhotos.length) % profilePhotos.length;
        const photo = profilePhotos[currentPhotoIndex];
        profilePhoto.src = photo.src;
        profilePhoto.alt = photo.alt;
        profilePhotoCounter.textContent = `${currentPhotoIndex + 1} / ${profilePhotos.length}`;
    };

    previousPhotoButton.addEventListener('click', () => showPhoto(currentPhotoIndex - 1));
    nextPhotoButton.addEventListener('click', () => showPhoto(currentPhotoIndex + 1));
}
