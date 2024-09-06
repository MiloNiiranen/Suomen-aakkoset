// Fisher-Yates-algoritmi satunnaiseen järjestämiseen
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Satunnaistaa lumpeenlehtien järjestyksen
function shuffleLeaves() {
    const container = document.querySelector('.letter-container');
    const leaves = Array.from(container.children);

    // Sekoita lumpeenlehdet
    const shuffledLeaves = shuffleArray(leaves);

    // Tyhjennä kontti ja lisää sekoitetut lehdet
    container.innerHTML = '';
    shuffledLeaves.forEach(leaf => container.appendChild(leaf));
}

// Tallenna alkuperäiset paikat
const originalPositions = [];
const letterContainer = document.querySelector('.letter-container');

// Tallenna alkuperäiset paikat elementeille
document.querySelectorAll('.lumpeenlehti').forEach((elem, index) => {
    const rect = elem.getBoundingClientRect();
    originalPositions[index] = { left: rect.left, top: rect.top };
});

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

function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = 0; // Vain vaakasuuntainen liike

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
}

function checkForSwap(draggedElem) {
    const draggedIndex = [...draggedElem.parentNode.children].indexOf(draggedElem);
    let closestElem = null;
    let closestDistance = Infinity;

    document.querySelectorAll('.lumpeenlehti').forEach((elem, index) => {
        if (elem !== draggedElem) {
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
}

function swapElements(elem1, elem2) {
    const parent = elem1.parentNode;
    const tempElem = document.createElement('div');

    parent.insertBefore(tempElem, elem1);
    parent.insertBefore(elem1, elem2);
    parent.insertBefore(elem2, tempElem);

    parent.removeChild(tempElem);
}

function resetPositionIfTouchingBounds(draggedElem) {
    const rect = draggedElem.getBoundingClientRect();
    const containerRect = letterContainer.getBoundingClientRect();

    // Tarkista, koskettaako lumpeenlehti letter-containerin reunoja
    if (rect.left <= containerRect.left || rect.right >= containerRect.right) {
        // Palauta alkuperäiseen sijaintiin
        const originalIndex = [...draggedElem.parentNode.children].indexOf(draggedElem);
        const { left } = originalPositions[originalIndex];

        draggedElem.style.transform = `translate(${left - containerRect.left}px, 0)`;
        draggedElem.setAttribute('data-x', left - containerRect.left);
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
