// Fisher-Yates-algoritmi satunnaiseen järjestämiseen
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle the leaves for the currently visible container
function shuffleLeaves() {
    // Get the currently visible section
    const currentSection = document.querySelector('section:not([style*="display: none"])');
    
    if (!currentSection) {
        console.error('No active section to shuffle!');
        return;
    }

    // Find the .letter-container within the current section
    const currentContainer = currentSection.querySelector('.letter-container');

    if (!currentContainer) {
        console.error('No letter container found in the current section!');
        return;
    }

    const leaves = Array.from(currentContainer.children); // Get all the leaves

    // Log before shuffling
    console.log("Before shuffle:", leaves.map(leaf => leaf.getAttribute('data-letter')));

    // Shuffle the leaves
    const shuffledLeaves = shuffleArray(leaves);

    // Clear the current container and append shuffled leaves
    currentContainer.innerHTML = '';
    shuffledLeaves.forEach(leaf => currentContainer.appendChild(leaf));

    // Log after shuffling
    console.log("After shuffle:", shuffledLeaves.map(leaf => leaf.getAttribute('data-letter')));

    // Update drag functionality
    updateDragFunctionality();
}

// Tallenna alkuperäiset paikat
const originalPositions = [];
const letterContainer = document.querySelector('.letter-container');

// Tallenna alkuperäiset paikat elementeille
document.querySelectorAll('.lumpeenlehti').forEach((elem, index) => {
    const rect = elem.getBoundingClientRect();
    originalPositions[index] = { left: rect.left, top: rect.top };
});

function updateDragFunctionality() {
    // Clear previous interact handlers
    interact('.lumpeenlehti').unset();

    interact('.lumpeenlehti').draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent', // Rajoittaa elementin liikkumisen .letter-containerin sisälle
                endOnly: true
            })
        ],
        listeners: {
            move: dragMoveListener,
            end(event) {
                checkForSwap(event.target);
                resetPositionIfTouchingBounds(event.target);
            }
        }
    });
}

function dragMoveListener(event) {
    const target = event.target;
    if (isElementInCorrectPosition(target)) {
        // Prevent dragging if the element is in the correct position
        return;
    }

    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = 0; // Vain vaakasuuntainen liike

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
}

function checkForSwap(draggedElem) {
    const draggedIndex = [...draggedElem.parentNode.children].indexOf(draggedElem);
    let closestElem = null;
    let closestDistance = Infinity;

    document.querySelectorAll('.lumpeenlehti').forEach((elem) => {
        if (elem !== draggedElem && !isElementInCorrectPosition(elem)) {
            const rect = elem.getBoundingClientRect();
            const draggedRect = draggedElem.getBoundingClientRect();
            const distance = Math.abs(draggedRect.left - rect.left);

            if (distance < closestDistance) {
                closestElem = elem;
                closestDistance = distance;
            }
        }
    });

    if (closestElem && closestDistance < 100) {
        swapElements(draggedElem, closestElem);
    }

    resetPositions();
    checkIfCorrectOrder(); // Tarkista järjestys swapin jälkeen
}

// Tarkista, ovatko kirjaimet oikeassa järjestyksessä
function checkIfCorrectOrder() {
    // Get the currently visible section
    const currentSection = document.querySelector('section:not([style*="display: none"])');
    
    if (!currentSection) {
        console.error('No active section found!');
        return;
    }

    // Find the .letter-container within the current section
    const currentContainer = currentSection.querySelector('.letter-container');

    if (!currentContainer) {
        console.error('No active letter container found in the current section!');
        return;
    }

    // Get the letters from the currently visible container
    const letters = [...currentContainer.querySelectorAll('.lumpeenlehti')].map(elem => elem.getAttribute('data-letter'));

    // Define the correct order based on the current section
    let correctOrder;
    switch (currentSection.id) {
        case 'page-a-e':
            correctOrder = ['A', 'B', 'C', 'D', 'E'];
            break;
        case 'page-f-j':
            correctOrder = ['F', 'G', 'H', 'I', 'J'];
            break;
        case 'page-k-o':
            correctOrder = ['K', 'L', 'M', 'N', 'O'];
            break;
        case 'page-p-t':
            correctOrder = ['P', 'Q', 'R', 'S', 'T'];
            break;
        case 'page-u-y':
            correctOrder = ['U', 'V', 'W', 'X', 'Y'];
            break;
        case 'page-z-ö':
            correctOrder = ['Y', 'Z', 'Å', 'Ä', 'Ö'];
            break;
        default:
            console.error('Unknown page ID:', currentSection.id);
            return;
    }

    console.log('Current order:', letters);
    console.log('Correct order:', correctOrder);

    // Compare the current order with the correct order
    if (JSON.stringify(letters) === JSON.stringify(correctOrder)) {
        goToNextPage(); // If correct, go to the next page
    }
}


function swapElements(elem1, elem2) {
    const parent = elem1.parentNode;
    const tempElem = document.createElement('div');

    parent.insertBefore(tempElem, elem1);
    parent.insertBefore(elem1, elem2);
    parent.insertBefore(elem2, tempElem);

    parent.removeChild(tempElem);

    // Tarkista järjestys vaihdon jälkeen
    checkIfCorrectOrder();
}

function isElementInCorrectPosition(elem) {
    const index = [...elem.parentNode.children].indexOf(elem);
    const correctOrder = getCorrectOrderForCurrentSection();
    return elem.getAttribute('data-letter') === correctOrder[index];
}

function getCorrectOrderForCurrentSection() {
    const currentSection = document.querySelector('section:not([style*="display: none"])');
    let correctOrder;
    switch (currentSection.id) {
        case 'page-a-e':
            correctOrder = ['A', 'B', 'C', 'D', 'E'];
            break;
        case 'page-f-j':
            correctOrder = ['F', 'G', 'H', 'I', 'J'];
            break;
        case 'page-k-o':
            correctOrder = ['K', 'L', 'M', 'N', 'O'];
            break;
        case 'page-p-t':
            correctOrder = ['P', 'Q', 'R', 'S', 'T'];
            break;
        case 'page-u-y':
            correctOrder = ['U', 'V', 'W', 'X', 'Y'];
            break;
        case 'page-z-ö':
            correctOrder = ['Y', 'Z', 'Å', 'Ä', 'Ö'];
            break;
        default:
            console.error('Unknown page ID:', currentSection.id);
            correctOrder = [];
            break;
    }
    return correctOrder;
}

function resetPositionIfTouchingBounds(draggedElem) {
    const rect = draggedElem.getBoundingClientRect();
    const containerRect = letterContainer.getBoundingClientRect();

    // Tarkista, koskettaako lumpeenlehti letter-containerin reunoja
    if (rect.left <= containerRect.left || rect.right >= containerRect.right) {
        // Palauta alkuperäiseen sijaintiin
        const originalIndex = [...draggedElem.parentNode.children].indexOf(draggedElem);
        const originalPosition = originalPositions[originalIndex];
        draggedElem.style.transform = `translate(${originalPosition.left}px, ${originalPosition.top}px)`;
        draggedElem.setAttribute('data-x', originalPosition.left);
    }
}


function resetPositions() {
    document.querySelectorAll('.lumpeenlehti').forEach((elem, index) => {
        const { left } = originalPositions[index];
        elem.style.transform = `translate(${left}px, 0)`;
        elem.setAttribute('data-x', left);
    });
}

// Sekoita lehdet alussa
shuffleLeaves();
