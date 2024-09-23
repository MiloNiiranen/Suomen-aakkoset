function showSection(sectionId) {
    // Piilota kaikki section-elementit
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.style.display = 'none');

    // Näytä haluttu section
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('start-button').addEventListener('click', function() {
    showSection("game-ending");
    shuffleLeaves();  // Randomoi lehdet ensimmäisellä sivulla
});

let currentPage = 0; // Keeps track of the current page
const pages = ['page-a-e', 'page-f-j', 'page-k-o', 'page-p-t', 'page-u-y', 'page-z-ö', 'game-ending', 'akrikola']; // Add more page IDs as you expand

// Siirry seuraavalle sivulle (tai osioon)
function goToNextPage() {
    const currentSection = document.getElementById(pages[currentPage]);
    if (currentSection) {
        currentSection.style.display = 'none';
    }

    currentPage++;
    if (currentPage >= pages.length) {
        currentPage = 0;
    }

    const nextSection = document.getElementById(pages[currentPage]);

    if (nextSection) {
        if (pages[currentPage] === 'game-ending') {
            nextSection.style.display = 'block';

            // Käynnistä animaatio
            const animationElement = document.getElementById('game-ending-animation');
            animationElement.style.animation = 'playAnimation 2.4s forwards';

            // Odota 4 sekuntia ennen siirtymistä akrikola-osioon
            setTimeout(() => {
                nextSection.style.display = 'none';
                const akrikolaSection = document.getElementById('akrikola');
                if (akrikolaSection) {
                    akrikolaSection.style.display = 'block';
                }
            }, 1700); // Näytä 'akrikola' 4 sekunnin kuluttua
        } else {
            nextSection.style.display = 'block';
            shuffleLeaves();
        }
    }
}

