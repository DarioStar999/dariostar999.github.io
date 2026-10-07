const PULL_CONFIG = {
    rarityWeights: {
        r1: 60,
        r2: 25,
        r3: 10,
        r4: 4,
        r5: 0.9,
        r6: 0.1,
    },
    animationCards: 34,
    animationDurationMs: 3200,
    storageKey: "sandrone-rng-inventory",
};

const state = {
    inventory: [],
    isPulling: false,
};

const elements = {
    pullTrack: document.querySelector("#pullTrack"),
    pullResult: document.querySelector("#pullResult"),
    pullX1: document.querySelector("#pullx1"),
    pullX10: document.querySelector("#pullx10"),
    inventoryCards: document.querySelector("#inventoryCards"),
    clearInventory: document.querySelector("#clearInventory"),
};

const manifest = window.CARD_DATABASE?.rarities ?? {};
const allCards = Object.values(manifest).flat();

function getCardKey(card) {
    return `${card.rarity}:${card.name}`;
}

function getFallbackCard() {
    return allCards[0] ?? {
        id: "missing-card",
        name: "Missing card",
        rarity: "r1",
        rarityLevel: 1,
        image: "",
    };
}

function getAvailableRarities() {
    return Object.entries(PULL_CONFIG.rarityWeights)
        .filter(([rarity, weight]) => weight > 0 && manifest[rarity]?.length)
        .map(([rarity, weight]) => ({ rarity, weight }));
}

function pickWeightedRarity() {
    const rarities = getAvailableRarities();
    const totalWeight = rarities.reduce((total, item) => total + item.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const item of rarities) {
        roll -= item.weight;
        if (roll <= 0) {
            return item.rarity;
        }
    }

    return rarities[rarities.length - 1]?.rarity ?? "r1";
}

function pickCard() {
    const rarity = pickWeightedRarity();
    const cards = manifest[rarity] ?? [];

    if (!cards.length) {
        return getFallbackCard();
    }

    return cards[Math.floor(Math.random() * cards.length)];
}

function pickDisplayCard(finalCard, finalIndex, currentIndex) {
    if (currentIndex === finalIndex) {
        return finalCard;
    }

    return allCards[Math.floor(Math.random() * allCards.length)] ?? getFallbackCard();
}

function createPullCard(card) {
    const cardElement = document.createElement("div");
    cardElement.className = `card rarity-${card.rarity}`;

    const image = document.createElement("img");
    image.className = "image-pull";
    image.src = card.image;
    image.alt = card.name;

    cardElement.append(image);
    return cardElement;
}

function createInventoryCard(card, amount) {
    const cardElement = document.createElement("div");
    cardElement.className = `inventory-card rarity-${card.rarity}`;

    const image = document.createElement("img");
    image.className = "image-inv";
    image.src = card.image;
    image.alt = card.name;

    const name = document.createElement("p");
    name.className = "card-name";
    name.textContent = card.name;

    const meta = document.createElement("span");
    meta.className = "card-meta";
    meta.textContent = `${card.rarity.toUpperCase()} x${amount}`;

    cardElement.append(image, name, meta);
    return cardElement;
}

function saveInventory() {
    localStorage.setItem(PULL_CONFIG.storageKey, JSON.stringify(state.inventory));
}

function loadInventory() {
    try {
        const saved = JSON.parse(localStorage.getItem(PULL_CONFIG.storageKey) ?? "[]");
        state.inventory = Array.isArray(saved) ? saved : [];
    } catch {
        state.inventory = [];
    }
}

function addToInventory(card) {
    state.inventory.push({
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        rarityLevel: card.rarityLevel,
        image: card.image,
        pulledAt: new Date().toISOString(),
    });

    saveInventory();
    renderInventory();
}

function groupInventory() {
    const grouped = new Map();

    for (const card of state.inventory) {
        const key = getCardKey(card);
        const item = grouped.get(key);

        if (item) {
            item.amount += 1;
        } else {
            grouped.set(key, { card, amount: 1 });
        }
    }

    return [...grouped.values()].sort((a, b) => {
        if (b.card.rarityLevel !== a.card.rarityLevel) {
            return b.card.rarityLevel - a.card.rarityLevel;
        }

        return a.card.name.localeCompare(b.card.name);
    });
}

function renderInventory() {
    elements.inventoryCards.replaceChildren();

    const groupedCards = groupInventory();

    if (!groupedCards.length) {
        const empty = document.createElement("p");
        empty.className = "empty-inventory";
        empty.textContent = "Inventory empty";
        elements.inventoryCards.append(empty);
        return;
    }

    for (const item of groupedCards) {
        elements.inventoryCards.append(createInventoryCard(item.card, item.amount));
    }
}

function setButtonsDisabled(disabled) {
    elements.pullX1.disabled = disabled;
    elements.pullX10.disabled = disabled;
}

function setResult(card, prefix = "Found") {
    elements.pullResult.textContent = `${prefix}: ${card.name} (${card.rarity.toUpperCase()})`;
}

function renderIdleCard() {
    const fallback = getFallbackCard();
    elements.pullTrack.replaceChildren(createPullCard(fallback));
    setResult(fallback, "Ready");
}

function animatePull(finalCard) {
    const finalIndex = PULL_CONFIG.animationCards - 4;
    const cards = [];

    elements.pullTrack.classList.remove("is-animating");
    elements.pullTrack.style.transition = "none";
    elements.pullTrack.style.transform = "translateX(0)";
    elements.pullTrack.replaceChildren();

    for (let index = 0; index < PULL_CONFIG.animationCards; index += 1) {
        const card = pickDisplayCard(finalCard, finalIndex, index);
        const cardElement = createPullCard(card);

        if (index === finalIndex) {
            cardElement.classList.add("is-winner");
        }

        cards.push(cardElement);
        elements.pullTrack.append(cardElement);
    }

    const winner = cards[finalIndex];
    const viewport = elements.pullTrack.parentElement;
    const targetOffset = winner.offsetLeft + winner.offsetWidth / 2 - viewport.clientWidth / 2;

    requestAnimationFrame(() => {
        elements.pullTrack.classList.add("is-animating");
        elements.pullTrack.style.transition = `transform ${PULL_CONFIG.animationDurationMs}ms cubic-bezier(.08,.74,.16,1)`;
        elements.pullTrack.style.transform = `translateX(-${targetOffset}px)`;
    });

    return new Promise((resolve) => {
        window.setTimeout(() => resolve(finalCard), PULL_CONFIG.animationDurationMs + 120);
    });
}

async function pullOnce({ animate = true } = {}) {
    const card = pickCard();

    if (animate) {
        await animatePull(card);
    }

    addToInventory(card);
    setResult(card);
    return card;
}

async function handlePull(amount) {
    if (state.isPulling || !allCards.length) {
        return;
    }

    state.isPulling = true;
    setButtonsDisabled(true);

    const results = [];

    for (let index = 0; index < amount; index += 1) {
        const animate = index === amount - 1;
        const card = await pullOnce({ animate });
        results.push(card);
    }

    if (amount > 1) {
        const best = [...results].sort((a, b) => b.rarityLevel - a.rarityLevel)[0];
        setResult(best, `Best of ${amount}`);
    }

    state.isPulling = false;
    setButtonsDisabled(false);
}

function clearInventory() {
    state.inventory = [];
    saveInventory();
    renderInventory();
}

function init() {
    if (!allCards.length) {
        elements.pullResult.textContent = "No cards found. Run the manifest script after adding assets.";
        setButtonsDisabled(true);
        return;
    }

    loadInventory();
    renderInventory();
    renderIdleCard();

    elements.pullX1.addEventListener("click", () => handlePull(1));
    elements.pullX10.addEventListener("click", () => handlePull(10));
    elements.clearInventory.addEventListener("click", clearInventory);
}

init();
