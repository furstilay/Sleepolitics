// רשימת הכריות והשמיכות הגלובליות הנוספות (אקסטרה) שיופיעו אצל כל הדמויות כמסיחים:
const globalExtraPillows = [
    "images/extra_pillow_1.png",
    "images/extra_pillow_2.png",
    "images/extra_pillow_3.png"
];

const globalExtraBlankets = [
    "images/extra_blanket_1.png",
    "images/extra_blanket_2.png",
    "images/extra_blanket_3.png"
];

// List of characters with their specific correct pillows, blankets, body and head images
const charactersData = [
    {
        name: "ביבי",
        body: "images/bibi_1.png",
        headAwake: "images/bibi_2.png",
        headSleep: "images/bibi_3.png",
        correctPillow: "images/bibi_pillow.png",
        correctBlanket: "images/bibi_blanket.png"
    },
    {
        name: "בנט",
        body: "images/benet_1.png",
        headAwake: "images/benet_2.png",
        headSleep: "images/benet_3.png",
        correctPillow: "images/benet_pillow.png",
        correctBlanket: "images/benet_blanket.png"
    },
    {
        name: "ליברמן",
        body: "images/liberman_1.png",
        headAwake: "images/liberman_2.png",
        headSleep: "images/liberman_3.png",
        correctPillow: "images/liberman_pillow.png",
        correctBlanket: "images/liberman_blanket.png"
    },
    {
        name: "סמוטריץ",
        body: "images/smotrich_1.png",
        headAwake: "images/smotrich_2.png",
        headSleep: "images/smotrich_3.png",
        correctPillow: "images/smotrich_pillow.png",
        correctBlanket: "images/smotrich_blanket.png"
    },
    {
        name: "דרעי",
        body: "images/deri_1.png",
        headAwake: "images/deri_2.png",
        headSleep: "images/deri_3.png",
        correctPillow: "images/deri_pillow.png",
        correctBlanket: "images/deri_blanket.png"
    }
];

let gameCharacters = [];
let currentCharIndex = 0;
let currentPillowsList = [];
let currentBlanketsList = [];
let pillowIndex = 0;
let blanketIndex = 0;
let isTransitioning = false;
let correctMatchTimer = null;

function initGame() {
    gameCharacters = [...charactersData].sort(() => Math.random() - 0.5);
    currentCharIndex = 0;
    loadCharacter(currentCharIndex);
}

function loadCharacter(index) {
    if (correctMatchTimer) {
        clearTimeout(correctMatchTimer);
        correctMatchTimer = null;
    }

    if (index >= gameCharacters.length) {
        showVictory();
        return;
    }

    const char = gameCharacters[index];
    
    // לוקחים את הכריות/שמיכות של הדמויות שטרם נפתרו (כדי שאלה שכבר נפתרו ייעלמו)
    const remainingChars = gameCharacters.slice(index + 1);
    const remainingPillows = remainingChars.map(c => c.correctPillow);
    const remainingBlankets = remainingChars.map(c => c.correctBlanket);
    
    // בניית הרשימות הסופיות: תשובה נכונה + שאר הדמויות שלא נפתרו + הכריות/שמיכות הגלובליות הנוספות
    currentPillowsList = [char.correctPillow, ...remainingPillows, ...globalExtraPillows].sort(() => Math.random() - 0.5);
    currentBlanketsList = [char.correctBlanket, ...remainingBlankets, ...globalExtraBlankets].sort(() => Math.random() - 0.5);
    
    pillowIndex = 0;
    blanketIndex = 0;

    document.getElementById('charBody').src = char.body;
    document.getElementById('charHead').src = char.headAwake;

    const wrapper = document.getElementById('characterWrapper');
    const scene = document.querySelector('.scene-container');
    const characterEl = document.getElementById('character');
    const pillowBox = document.getElementById('pillowCarousel');
    const blanketBox = document.getElementById('blanketCarousel');

    scene.classList.remove('active-sleep');
    characterEl.classList.remove('sleeping');
    pillowBox.classList.remove('subtle-pulse', 'success-pulse');
    blanketBox.classList.remove('subtle-pulse', 'success-pulse');
    
    wrapper.classList.remove('slide-out-right');
    wrapper.classList.add('slide-in-left');

    updateCarouselView('pillowCarousel', currentPillowsList, pillowIndex);
    updateCarouselView('blanketCarousel', currentBlanketsList, blanketIndex);
    isTransitioning = false;
}

function updateCarouselView(carouselId, items, idx) {
    const container = document.getElementById(carouselId);
    const imgEl = container.querySelector('.carousel-img');
    if (items.length > 0 && imgEl) {
        imgEl.src = items[idx];
    }
}

function initCarouselControls(carouselId, type) {
    const container = document.getElementById(carouselId);
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        const items = type === 'pillow' ? currentPillowsList : currentBlanketsList;
        if (type === 'pillow') {
            pillowIndex = (pillowIndex - 1 + items.length) % items.length;
            updateCarouselView('pillowCarousel', currentPillowsList, pillowIndex);
        } else {
            blanketIndex = (blanketIndex - 1 + items.length) % items.length;
            updateCarouselView('blanketCarousel', currentBlanketsList, blanketIndex);
        }
        checkWinCondition();
    });

    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        const items = type === 'pillow' ? currentPillowsList : currentBlanketsList;
        if (type === 'pillow') {
            pillowIndex = (pillowIndex + 1) % items.length;
            updateCarouselView('pillowCarousel', currentPillowsList, pillowIndex);
        } else {
            blanketIndex = (blanketIndex + 1) % items.length;
            updateCarouselView('blanketCarousel', currentBlanketsList, blanketIndex);
        }
        checkWinCondition();
    });
}

function checkWinCondition() {
    if (isTransitioning) return;

    const char = gameCharacters[currentCharIndex];
    const selectedPillow = currentPillowsList[pillowIndex];
    const selectedBlanket = currentBlanketsList[blanketIndex];

    const pillowBox = document.getElementById('pillowCarousel');
    const blanketBox = document.getElementById('blanketCarousel');

    if (selectedPillow === char.correctPillow && selectedBlanket === char.correctBlanket) {
        if (!correctMatchTimer) {
            // חיווי עדין בזמן שממתינים את השנייה
            pillowBox.classList.add('subtle-pulse');
            blanketBox.classList.add('subtle-pulse');

            correctMatchTimer = setTimeout(() => {
                correctMatchTimer = null;
                
                // בסוף השנייה - מסירים את החיווי העדין ומפעילים את ה-success-pulse המלא!
                pillowBox.classList.remove('subtle-pulse');
                blanketBox.classList.remove('subtle-pulse');
                pillowBox.classList.add('success-pulse');
                blanketBox.classList.add('success-pulse');

                // השהיה קצרה להצגת ה-success-pulse לפני המעבר לדמות הבאה
                setTimeout(() => {
                    triggerSuccessSequence();
                }, 600);

            }, 1000); // שומרים על השילוב הנכון למשך שנייה
        }
    } else {
        // אם השחקן המשיך לדפדף לפני שעברה שנייה - מאפסים הכל
        if (correctMatchTimer) {
            clearTimeout(correctMatchTimer);
            correctMatchTimer = null;
            pillowBox.classList.remove('subtle-pulse', 'success-pulse');
            blanketBox.classList.remove('subtle-pulse', 'success-pulse');
        }
    }
}

function triggerSuccessSequence() {
    isTransitioning = true;
    const sceneContainer = document.querySelector('.scene-container');
    const characterEl = document.getElementById('character');
    const charHead = document.getElementById('charHead');
    const flyingPillow = document.getElementById('flyingPillow');
    const flyingBlanket = document.getElementById('flyingBlanket');
    const wrapper = document.getElementById('characterWrapper');

    const char = gameCharacters[currentCharIndex];

    if (flyingPillow) flyingPillow.src = char.correctPillow;
    if (flyingBlanket) flyingBlanket.src = char.correctBlanket;

    // 1. Sleep transition on character
    setTimeout(() => {
        sceneContainer.classList.add('active-sleep');
        characterEl.classList.add('sleeping');
        charHead.src = char.headSleep;
    }, 100);

    // 2. Slide out right after sleeping, then load next character sliding in from left
    setTimeout(() => {
        wrapper.classList.remove('slide-in-left');
        wrapper.classList.add('slide-out-right');

        setTimeout(() => {
            currentCharIndex++;
            loadCharacter(currentCharIndex);
        }, 800); // Wait for exit animation to finish
    }, 1200);
}

function showVictory() {
    const modal = document.getElementById('victoryModal');
    const card = document.getElementById('victoryCard');
    if (modal && card) {
        modal.classList.add('show');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }
}



function preloadAllAssets() {
    const allImages = [
        ...globalExtraPillows,
        ...globalExtraBlankets,
    ];

    charactersData.forEach(char => {
        allImages.push(
            char.body,
            char.headAwake,
            char.headSleep,
            char.correctPillow,
            char.correctBlanket
        );
    });

    allImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}


// Initialize game on load
window.addEventListener('DOMContentLoaded', () => {
    preloadAllAssets();
    initCarouselControls('pillowCarousel', 'pillow');
    initCarouselControls('blanketCarousel', 'blanket');
    initGame();
});