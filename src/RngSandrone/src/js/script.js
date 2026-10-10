const PULL_CONFIG = {
    cost: 165,
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
    storageKey: "sandrone-rng-save-v2",
    oldInventoryKey: "sandrone-rng-inventory",
    shopPath: "src/data/shop.json",
};

const SHOP_FALLBACK = {
    autoclickers: [
        { id: "clockwork_helper", name: "Clockwork Helper", description: "Generates Sandrocoin every second.", baseCost: 75, costMultiplier: 1.18, coinsPerSecond: 1 },
        { id: "sandrone_worker", name: "Sandrone Worker", description: "A stronger automatic Sandrocoin source.", baseCost: 450, costMultiplier: 1.22, coinsPerSecond: 7 },
        { id: "automatron", name: "Automatron", description: "Expensive, but prints coins fast.", baseCost: 2500, costMultiplier: 1.28, coinsPerSecond: 45 },
    ],
    clickUpgrades: [
        { id: "polished_coin", name: "Polished Coin", description: "Each manual click gives more Sandrocoin.", baseCost: 250, costMultiplier: 1.75, clickPower: 1 },
        { id: "golden_glove", name: "Golden Glove", description: "A heavy upgrade for active clicking.", baseCost: 1500, costMultiplier: 2.1, clickPower: 5 },
    ],
};

const ACHIEVEMENT_CHAINS = [
    {
        id: "pulls",
        name: "Pull Milestone",
        description: (target) => `Reach ${target} total pulls.`,
        targets: [1, 10, 50, 100, 250, 500, 1000],
        progress: () => game.stats.totalPulls,
    },
    {
        id: "coins",
        name: "Sandrocoin Vault",
        description: (target) => `Earn ${target} lifetime Sandrocoin.`,
        targets: [100, 1000, 5000, 10000, 50000, 100000],
        progress: () => game.stats.lifetimeCoins,
    },
    {
        id: "clicks",
        name: "Manual Work",
        description: (target) => `Click ${target} times.`,
        targets: [25, 100, 500, 1000, 5000],
        progress: () => game.stats.manualClicks,
    },
    {
        id: "r5",
        name: "R5 Hunter",
        description: (target) => `Find ${target} R5 cards.`,
        targets: [1, 3, 10, 25, 50],
        progress: () => game.stats.rarityPulls.r5 ?? 0,
    },
    {
        id: "r6",
        name: "R6 Miracle",
        description: (target) => `Find ${target} R6 cards.`,
        targets: [1, 2, 5, 10, 25],
        progress: () => game.stats.rarityPulls.r6 ?? 0,
    },
    {
        id: "autoclickers",
        name: "Factory Builder",
        description: (target) => `Own ${target} autoclickers total.`,
        targets: [1, 5, 10, 25, 50, 100],
        progress: () => getOwnedAutoclickers(),
    },
    {
        id: "collection",
        name: "Card Collector",
        description: (target) => `Discover ${target} unique cards.`,
        targets: [3, 6, 10, 15, 19],
        progress: () => groupInventory().length,
    },
];

const TIER_NAMES = ["I", "II", "III", "IV", "V", "VI", "VII"];
const ACHIEVEMENTS = ACHIEVEMENT_CHAINS.flatMap((chain) => (
    chain.targets.map((target, index) => ({
        id: `${chain.id}_${target}`,
        name: `${chain.name} ${TIER_NAMES[index] ?? index + 1}`,
        description: chain.description(target),
        target,
        tier: TIER_NAMES[index] ?? String(index + 1),
        progress: chain.progress,
    }))
));

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

let shopConfig = cloneData(SHOP_FALLBACK);
let inventoryFilter = "all";

const manifest = window.CARD_DATABASE?.rarities ?? {};
const pullCards = Object.entries(manifest)
    .filter(([rarity]) => rarity !== "r0")
    .flatMap(([, cards]) => cards);

const elements = {
    pullTrack: document.querySelector("#pullTrack"),
    pullResult: document.querySelector("#pullResult"),
    pullX1: document.querySelector("#pullx1"),
    pullX10: document.querySelector("#pullx10"),
    autoPullToggle: document.querySelector("#autoPullToggle"),
    autoPullState: document.querySelector("#autoPullState"),
    inventoryCards: document.querySelector("#inventoryCards"),
    inventoryFilters: document.querySelector("#inventoryFilters"),
    clearInventory: document.querySelector("#clearInventory"),
    resetAllData: document.querySelector("#resetAllData"),
    coinAmount: document.querySelector("#coinAmount"),
    coinRate: document.querySelector("#coinRate"),
    totalPulls: document.querySelector("#totalPulls"),
    sinceR5: document.querySelector("#sinceR5"),
    sinceR6: document.querySelector("#sinceR6"),
    pullCostLabel: document.querySelector("#pullCostLabel"),
    coinClickButton: document.querySelector("#coinClickButton"),
    clickPowerLabel: document.querySelector("#clickPowerLabel"),
    shopItems: document.querySelector("#shopItems"),
    historyList: document.querySelector("#historyList"),
    x10Results: document.querySelector("#x10Results"),
    cardIndexGrid: document.querySelector("#cardIndexGrid"),
    achievementGrid: document.querySelector("#achievementGrid"),
    cardViewer: document.querySelector("#cardViewer"),
    cardViewerClose: document.querySelector("#cardViewerClose"),
    cardViewerImage: document.querySelector("#cardViewerImage"),
    cardViewerRarity: document.querySelector("#cardViewerRarity"),
    cardViewerName: document.querySelector("#cardViewerName"),
};

const game = {
    coins: 0,
    inventory: [],
    cardFlags: {},
    history: [],
    shop: {},
    autoPull: false,
    stats: {
        totalPulls: 0,
        lifetimeCoins: 0,
        manualClicks: 0,
        lastR5PullAt: null,
        lastR6PullAt: null,
        rarityPulls: {},
    },
    achievements: {},
    isPulling: false,
};

function getDefaultGameState() {
    return {
        coins: 0,
        inventory: [],
        cardFlags: {},
        history: [],
        shop: {},
        autoPull: false,
        stats: {
            totalPulls: 0,
            lifetimeCoins: 0,
            manualClicks: 0,
            lastR5PullAt: null,
            lastR6PullAt: null,
            rarityPulls: {},
        },
        achievements: {},
        isPulling: false,
    };
}

function formatNumber(value) {
    return Math.floor(value).toLocaleString("en-US");
}

function cardKey(card) {
    return `${card.rarity}:${card.name}`;
}

function normalizeCard(card) {
    return {
        id: card.id,
        name: card.name,
        rarity: card.rarity,
        rarityLevel: card.rarityLevel,
        image: card.image,
        pulledAt: card.pulledAt ?? new Date().toISOString(),
    };
}

function getFallbackCard() {
    return pullCards[0] ?? {
        id: "missing-card",
        name: "Missing card",
        rarity: "r1",
        rarityLevel: 1,
        image: "",
    };
}

async function loadShopConfig() {
    try {
        const response = await fetch(PULL_CONFIG.shopPath);
        if (response.ok) {
            shopConfig = await response.json();
        }
    } catch {
        shopConfig = cloneData(SHOP_FALLBACK);
    }
}

function loadGame() {
    try {
        const saved = JSON.parse(localStorage.getItem(PULL_CONFIG.storageKey) ?? "{}");
        Object.assign(game, saved);
    } catch {
        // Keep default state when localStorage contains invalid data.
    }

    if (!Array.isArray(game.inventory)) {
        game.inventory = [];
    }

    if (!game.inventory.length) {
        try {
            const oldInventory = JSON.parse(localStorage.getItem(PULL_CONFIG.oldInventoryKey) ?? "[]");
            if (Array.isArray(oldInventory)) {
                game.inventory = oldInventory.map(normalizeCard).filter((card) => card.rarity !== "r0");
            }
        } catch {
            game.inventory = [];
        }
    }

    game.cardFlags ??= {};
    game.history ??= [];
    game.shop ??= {};
    game.achievements ??= {};
    game.stats ??= {};
    game.stats.rarityPulls ??= {};
    game.stats.totalPulls ??= game.inventory.length;
    game.stats.lifetimeCoins ??= game.coins;
    game.stats.manualClicks ??= 0;
    game.stats.lastR5PullAt ??= null;
    game.stats.lastR6PullAt ??= null;

    if (game.stats.lastR5PullAt === null || game.stats.lastR6PullAt === null) {
        rebuildRareCountersFromInventory();
    }

    game.autoPull = Boolean(game.autoPull);
    game.isPulling = false;
}

function rebuildRareCountersFromInventory() {
    let totalPulls = 0;
    let lastR5PullAt = null;
    let lastR6PullAt = null;
    const rarityPulls = {};

    for (const card of game.inventory) {
        totalPulls += 1;
        rarityPulls[card.rarity] = (rarityPulls[card.rarity] ?? 0) + 1;

        if (card.rarity === "r5") {
            lastR5PullAt = totalPulls;
        }

        if (card.rarity === "r6") {
            lastR6PullAt = totalPulls;
        }
    }

    game.stats.totalPulls = Math.max(game.stats.totalPulls ?? 0, totalPulls);
    game.stats.rarityPulls = { ...rarityPulls, ...game.stats.rarityPulls };
    game.stats.lastR5PullAt ??= lastR5PullAt;
    game.stats.lastR6PullAt ??= lastR6PullAt;
}

function saveGame() {
    localStorage.setItem(PULL_CONFIG.storageKey, JSON.stringify({
        coins: game.coins,
        inventory: game.inventory,
        cardFlags: game.cardFlags,
        history: game.history,
        shop: game.shop,
        autoPull: game.autoPull,
        stats: game.stats,
        achievements: game.achievements,
    }));
}

function addCoins(amount) {
    game.coins += amount;
    game.stats.lifetimeCoins += Math.max(0, amount);
    saveGame();
    renderEconomy();
    renderShop();
    renderAchievements();
}

function getClickPower() {
    const upgradePower = (shopConfig.clickUpgrades ?? []).reduce((total, item) => {
        const owned = game.shop[item.id] ?? 0;
        return total + owned * (item.clickPower ?? 0);
    }, 0);

    return 1 + upgradePower;
}

function getCoinsPerSecond() {
    return (shopConfig.autoclickers ?? []).reduce((total, item) => {
        const owned = game.shop[item.id] ?? 0;
        return total + owned * (item.coinsPerSecond ?? 0);
    }, 0);
}

function getOwnedAutoclickers() {
    return (shopConfig.autoclickers ?? []).reduce((total, item) => total + (game.shop[item.id] ?? 0), 0);
}

function getItemCost(item) {
    const owned = game.shop[item.id] ?? 0;
    return Math.floor(item.baseCost * Math.pow(item.costMultiplier, owned));
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
    return cards[Math.floor(Math.random() * cards.length)] ?? getFallbackCard();
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

function createMiniResult(card) {
    const item = document.createElement("div");
    item.className = `mini-result rarity-${card.rarity}`;

    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.name;

    const label = document.createElement("span");
    label.textContent = `${card.rarity.toUpperCase()} ${card.name}`;

    item.append(image, label);
    return item;
}

function animatePull(finalCard) {
    const finalIndex = PULL_CONFIG.animationCards - 4;
    const cards = [];

    elements.pullTrack.classList.remove("is-animating");
    elements.pullTrack.style.transition = "none";
    elements.pullTrack.style.transform = "translateX(0)";
    elements.pullTrack.replaceChildren();

    for (let index = 0; index < PULL_CONFIG.animationCards; index += 1) {
        const card = index === finalIndex ? finalCard : pullCards[Math.floor(Math.random() * pullCards.length)] ?? getFallbackCard();
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
        window.setTimeout(resolve, PULL_CONFIG.animationDurationMs + 120);
    });
}

function triggerRareEffect(card) {
    if (card.rarity !== "r5" && card.rarity !== "r6") {
        return;
    }

    document.body.classList.remove("rare-flash", "legendary-flash");
    void document.body.offsetWidth;
    document.body.classList.add(card.rarity === "r6" ? "legendary-flash" : "rare-flash");

    window.setTimeout(() => {
        document.body.classList.remove("rare-flash", "legendary-flash");
    }, 1100);
}

function addPulledCard(card) {
    const savedCard = normalizeCard(card);
    game.inventory.push(savedCard);
    game.history.unshift(savedCard);
    game.history = game.history.slice(0, 12);
    game.stats.totalPulls += 1;
    game.stats.rarityPulls[card.rarity] = (game.stats.rarityPulls[card.rarity] ?? 0) + 1;

    if (card.rarity === "r5") {
        game.stats.lastR5PullAt = game.stats.totalPulls;
    }

    if (card.rarity === "r6") {
        game.stats.lastR6PullAt = game.stats.totalPulls;
    }

    triggerRareEffect(card);
}

function setResult(card, prefix = "Found") {
    elements.pullResult.textContent = `${prefix}: ${card.name} (${card.rarity.toUpperCase()})`;
}

function renderIdleCard() {
    const fallback = getFallbackCard();
    elements.pullTrack.replaceChildren(createPullCard(fallback));
    setResult(fallback, "Ready");
}

function canAffordPull(amount) {
    return game.coins >= PULL_CONFIG.cost * amount;
}

async function handlePull(amount) {
    if (game.isPulling || !pullCards.length || !canAffordPull(amount)) {
        renderEconomy();
        return [];
    }

    game.isPulling = true;
    game.coins -= PULL_CONFIG.cost * amount;
    setButtonsDisabled(true);
    elements.x10Results.replaceChildren();

    const results = Array.from({ length: amount }, () => pickCard());
    const featured = [...results].sort((a, b) => b.rarityLevel - a.rarityLevel)[0] ?? results[results.length - 1];

    await animatePull(featured);

    for (const card of results) {
        addPulledCard(card);
    }

    if (amount > 1) {
        elements.x10Results.replaceChildren(...results.map(createMiniResult));
        setResult(featured, `Best of ${amount}`);
    } else {
        setResult(featured);
    }

    game.isPulling = false;
    saveGame();
    renderAll();
    setButtonsDisabled(false);
    return results;
}

function groupInventory() {
    const grouped = new Map();

    for (const card of game.inventory) {
        const key = cardKey(card);
        const item = grouped.get(key);

        if (item) {
            item.amount += 1;
        } else {
            grouped.set(key, { card, amount: 1, key });
        }
    }

    return [...grouped.values()].sort((a, b) => {
        const flagsA = game.cardFlags[a.key] ?? {};
        const flagsB = game.cardFlags[b.key] ?? {};
        if (Boolean(flagsB.favorite) !== Boolean(flagsA.favorite)) {
            return Number(Boolean(flagsB.favorite)) - Number(Boolean(flagsA.favorite));
        }
        if (b.card.rarityLevel !== a.card.rarityLevel) {
            return b.card.rarityLevel - a.card.rarityLevel;
        }
        return a.card.name.localeCompare(b.card.name);
    });
}

function passesInventoryFilter(item) {
    const flags = game.cardFlags[item.key] ?? {};
    if (inventoryFilter === "all") {
        return true;
    }
    if (inventoryFilter === "favorite") {
        return Boolean(flags.favorite);
    }
    if (inventoryFilter === "locked") {
        return Boolean(flags.locked);
    }
    return item.card.rarity === inventoryFilter;
}

function toggleCardFlag(key, flag) {
    game.cardFlags[key] ??= {};
    game.cardFlags[key][flag] = !game.cardFlags[key][flag];
    saveGame();
    renderInventory();
}

function openCardViewer(card) {
    elements.cardViewerImage.src = card.image;
    elements.cardViewerImage.alt = card.name;
    elements.cardViewerRarity.textContent = card.rarity.toUpperCase();
    elements.cardViewerName.textContent = card.name;
    elements.cardViewer.classList.add("is-open");
    elements.cardViewer.setAttribute("aria-hidden", "false");
}

function closeCardViewer() {
    elements.cardViewer.classList.remove("is-open");
    elements.cardViewer.setAttribute("aria-hidden", "true");
}

function createInventoryCard(item) {
    const flags = game.cardFlags[item.key] ?? {};
    const cardElement = document.createElement("div");
    cardElement.className = `inventory-card rarity-${item.card.rarity}`;

    const tools = document.createElement("div");
    tools.className = "card-tools";

    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.textContent = flags.favorite ? "Favorite" : "Fav";
    favorite.className = flags.favorite ? "is-active" : "";
    favorite.addEventListener("click", (event) => event.stopPropagation());
    favorite.addEventListener("click", () => toggleCardFlag(item.key, "favorite"));

    const locked = document.createElement("button");
    locked.type = "button";
    locked.textContent = flags.locked ? "Locked" : "Lock";
    locked.className = flags.locked ? "is-active" : "";
    locked.addEventListener("click", (event) => event.stopPropagation());
    locked.addEventListener("click", () => toggleCardFlag(item.key, "locked"));

    tools.append(favorite, locked);

    const image = document.createElement("img");
    image.className = "image-inv";
    image.src = item.card.image;
    image.alt = item.card.name;

    const name = document.createElement("p");
    name.className = "card-name";
    name.textContent = item.card.name;

    const meta = document.createElement("span");
    meta.className = "card-meta";
    meta.textContent = `${item.card.rarity.toUpperCase()} x${item.amount}`;

    cardElement.addEventListener("click", () => openCardViewer(item.card));
    cardElement.append(tools, image, name, meta);
    return cardElement;
}

function renderInventoryFilters() {
    const filters = ["all", "favorite", "locked", ...Object.keys(PULL_CONFIG.rarityWeights)];
    elements.inventoryFilters.replaceChildren();

    for (const filter of filters) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = filter;
        button.className = filter === inventoryFilter ? "is-active" : "";
        button.addEventListener("click", () => {
            inventoryFilter = filter;
            renderInventory();
        });
        elements.inventoryFilters.append(button);
    }
}

function renderInventory() {
    renderInventoryFilters();
    elements.inventoryCards.replaceChildren();

    const cards = groupInventory().filter(passesInventoryFilter);
    if (!cards.length) {
        const empty = document.createElement("p");
        empty.className = "empty-inventory";
        empty.textContent = "Inventory empty";
        elements.inventoryCards.append(empty);
        return;
    }

    elements.inventoryCards.append(...cards.map(createInventoryCard));
}

function renderHistory() {
    elements.historyList.replaceChildren();
    if (!game.history.length) {
        const empty = document.createElement("span");
        empty.className = "history-empty";
        empty.textContent = "No pulls yet";
        elements.historyList.append(empty);
        return;
    }

    for (const card of game.history) {
        const item = document.createElement("div");
        item.className = `history-item rarity-${card.rarity}`;
        item.textContent = `${card.rarity.toUpperCase()} ${card.name}`;
        elements.historyList.append(item);
    }
}

function renderCardIndex() {
    const ownedKeys = new Set(game.inventory.map(cardKey));
    elements.cardIndexGrid.replaceChildren();

    for (const card of pullCards) {
        const discovered = ownedKeys.has(cardKey(card));
        const item = document.createElement("button");
        item.type = "button";
        item.className = `index-card rarity-${card.rarity} ${discovered ? "is-discovered" : "is-hidden"}`;
        item.disabled = !discovered;

        const image = document.createElement("img");
        image.src = card.image;
        image.alt = discovered ? card.name : "Undiscovered card";

        const name = document.createElement("strong");
        name.textContent = discovered ? card.name : "Undiscovered";

        const rarity = document.createElement("span");
        rarity.textContent = card.rarity.toUpperCase();

        item.append(image, name, rarity);

        if (discovered) {
            item.addEventListener("click", () => openCardViewer(card));
        }

        elements.cardIndexGrid.append(item);
    }
}

function renderEconomy() {
    const pullCost = PULL_CONFIG.cost;
    const sinceR5 = game.stats.lastR5PullAt === null ? "Never" : formatNumber(game.stats.totalPulls - game.stats.lastR5PullAt);
    const sinceR6 = game.stats.lastR6PullAt === null ? "Never" : formatNumber(game.stats.totalPulls - game.stats.lastR6PullAt);

    elements.coinAmount.textContent = formatNumber(game.coins);
    elements.coinRate.textContent = `+${formatNumber(getCoinsPerSecond())}/s`;
    elements.clickPowerLabel.textContent = formatNumber(getClickPower());
    elements.totalPulls.textContent = formatNumber(game.stats.totalPulls);
    elements.sinceR5.textContent = sinceR5;
    elements.sinceR6.textContent = sinceR6;
    elements.pullCostLabel.textContent = `${formatNumber(pullCost)} each`;
    elements.pullX1.querySelector("small").textContent = `${formatNumber(pullCost)} Sandrocoin`;
    elements.pullX10.querySelector("small").textContent = `${formatNumber(pullCost * 10)} Sandrocoin`;
    elements.autoPullState.textContent = game.autoPull ? "on" : "off";
    elements.autoPullToggle.classList.toggle("is-active", game.autoPull);
    elements.pullX1.disabled = game.isPulling || !canAffordPull(1);
    elements.pullX10.disabled = game.isPulling || !canAffordPull(10);
}

function renderShop() {
    elements.shopItems.replaceChildren();
    const shopGroups = [
        { title: "Autoclicker", items: shopConfig.autoclickers ?? [], stat: (item) => `+${item.coinsPerSecond}/s` },
        { title: "Click Power", items: shopConfig.clickUpgrades ?? [], stat: (item) => `+${item.clickPower}/click` },
    ];

    for (const group of shopGroups) {
        for (const item of group.items) {
            const owned = game.shop[item.id] ?? 0;
            const cost = getItemCost(item);
            const card = document.createElement("div");
            card.className = "shop-card";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const type = document.createElement("span");
            type.className = "shop-type";
            type.textContent = `${group.title} - ${group.stat(item)}`;

            const description = document.createElement("p");
            description.textContent = item.description;

            const buy = document.createElement("button");
            buy.type = "button";
            buy.disabled = game.coins < cost;
            buy.textContent = `Buy ${formatNumber(cost)} - owned ${owned}`;
            buy.addEventListener("click", () => buyShopItem(item.id));

            card.append(type, title, description, buy);
            elements.shopItems.append(card);
        }
    }
}

function renderAchievements() {
    elements.achievementGrid.replaceChildren();

    for (const achievement of ACHIEVEMENTS) {
        const progress = Math.min(achievement.progress(), achievement.target);
        if (progress >= achievement.target && !game.achievements[achievement.id]) {
            game.achievements[achievement.id] = new Date().toISOString();
            saveGame();
        }

        const unlocked = Boolean(game.achievements[achievement.id]);
        const item = document.createElement("div");
        item.className = `achievement-card ${unlocked ? "is-unlocked" : ""}`;

        const tier = document.createElement("span");
        tier.className = "achievement-tier";
        tier.textContent = `Tier ${achievement.tier}`;

        const title = document.createElement("h3");
        title.textContent = achievement.name;

        const description = document.createElement("p");
        description.textContent = achievement.description;

        const meter = document.createElement("div");
        meter.className = "achievement-meter";
        meter.style.setProperty("--progress", `${(progress / achievement.target) * 100}%`);

        const count = document.createElement("span");
        count.textContent = unlocked ? "Unlocked" : `${formatNumber(progress)} / ${formatNumber(achievement.target)}`;

        item.append(tier, title, description, meter, count);
        elements.achievementGrid.append(item);
    }
}

function renderAll() {
    renderEconomy();
    renderShop();
    renderHistory();
    renderInventory();
    renderCardIndex();
    renderAchievements();
}

function setButtonsDisabled(disabled) {
    game.isPulling = disabled;
    renderEconomy();
}

function buyShopItem(id) {
    const item = [...(shopConfig.autoclickers ?? []), ...(shopConfig.clickUpgrades ?? [])].find((entry) => entry.id === id);
    if (!item) {
        return;
    }

    const cost = getItemCost(item);
    if (game.coins < cost) {
        return;
    }

    game.coins -= cost;
    game.shop[id] = (game.shop[id] ?? 0) + 1;
    saveGame();
    renderAll();
}

function clearInventory() {
    game.inventory = game.inventory.filter((card) => game.cardFlags[cardKey(card)]?.locked);
    saveGame();
    renderAll();
}

function resetAllData() {
    if (!window.confirm("Reset all Sandrone RNG data? This will delete coins, inventory, shop, achievements and history.")) {
        return;
    }

    localStorage.removeItem(PULL_CONFIG.storageKey);
    localStorage.removeItem(PULL_CONFIG.oldInventoryKey);
    Object.assign(game, getDefaultGameState());
    inventoryFilter = "all";
    closeCardViewer();
    elements.x10Results.replaceChildren();
    renderIdleCard();
    saveGame();
    renderAll();
}

function handleCoinClick(event) {
    const amount = getClickPower();
    game.stats.manualClicks += 1;
    addCoins(amount);

    const pop = document.createElement("span");
    pop.className = "coin-pop";
    pop.textContent = `+${formatNumber(amount)}`;
    pop.style.left = `${event.offsetX}px`;
    pop.style.top = `${event.offsetY}px`;
    elements.coinClickButton.append(pop);
    window.setTimeout(() => pop.remove(), 700);
}

function toggleAutoPull() {
    game.autoPull = !game.autoPull;
    saveGame();
    renderEconomy();
}

function startTimers() {
    window.setInterval(() => {
        const coinsPerSecond = getCoinsPerSecond();
        if (coinsPerSecond > 0) {
            addCoins(coinsPerSecond);
        }
    }, 1000);

    window.setInterval(() => {
        if (game.autoPull && !game.isPulling && canAffordPull(1)) {
            handlePull(1);
        }
    }, 1500);
}

async function init() {
    await loadShopConfig();
    loadGame();

    if (!pullCards.length) {
        elements.pullResult.textContent = "No cards found. Run the manifest script after adding assets.";
        elements.pullX1.disabled = true;
        elements.pullX10.disabled = true;
        return;
    }

    renderIdleCard();
    renderAll();

    elements.pullX1.addEventListener("click", () => handlePull(1));
    elements.pullX10.addEventListener("click", () => handlePull(10));
    elements.autoPullToggle.addEventListener("click", toggleAutoPull);
    elements.coinClickButton.addEventListener("click", handleCoinClick);
    elements.clearInventory.addEventListener("click", clearInventory);
    elements.resetAllData.addEventListener("click", resetAllData);
    elements.cardViewerClose.addEventListener("click", closeCardViewer);
    elements.cardViewer.addEventListener("click", (event) => {
        if (event.target === elements.cardViewer) {
            closeCardViewer();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCardViewer();
        }
    });

    startTimers();
}

init();
