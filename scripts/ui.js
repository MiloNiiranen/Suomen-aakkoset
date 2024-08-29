function showSection(sectionId) {
    // Piilota kaikki section-elementit
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.style.display = 'none');

    // Näytä haluttu section
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('start-button').addEventListener('click', function() {
    showSection("page-a-e");
});