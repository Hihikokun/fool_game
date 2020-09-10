function Card(value, suit) {
    this.value = value;
    this.suit = suit;
    return [value, suit];
}

function makeDeck() {
    var cards = new Array;
    for (let i = 6; i < 15; i++) {
        cards.push(Card(i, 'spade'), Card(i, 'diamonds'), Card(i, 'clubs'), Card(i, 'hearts'));
    }
    console.log("Deck created");
    return cards;
}

var preGame = true;

function drawHand() {
    if (preGame) {
        deck.shuffle();
    }
    preGame = false;
    var hand = new Array;
    for (let i = 0; i < 6; i++) {
        hand.push(deck.cards[0]);
        deck.cards.splice(0, 1);
    }
    return hand;
}

function pickTrumpCard() {
    console.log(`Trump card selected, %c${deck.cards[deck.cards.length - 1]}`, "color: red");
    return deck.cards[deck.cards.length - 1];
}

function renderDeck() {
    deck.cards.forEach(element => {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.classList.add("deck", element[1]); 
        card.style.backgroundImage = `url('Cards/blue_back.png')`;
        card.style.backgroundSize = "cover";
        if (element === trumpCard) {
            card.classList.add("trump_card");
            card.style.backgroundImage = `url('Cards/${element[0] + element[1].charAt(0)}.png')`;
            card.style.backgroundSize = "cover";
        }
        document.body.appendChild(card);
    });
}

function renderPlayerHand() {
    console.log(playerHand);
    playerHand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.style.backgroundImage = `url('Cards/${element[0] + element[1].charAt(0)}.png')`;
        card.style.backgroundSize = "cover"; 
        card.classList.add("player_hand", element[1], `p${index + 1}c`);
        document.body.appendChild(card);
    });
}

function renderBotHand() {
    console.log(botHand);
    botHand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.style.backgroundImage = `url('Cards/blue_back.png')`;
        card.style.backgroundSize = "cover";
        card.classList.add("bot_hand", element[1], `b${index + 1}c`);
        document.body.appendChild(card);
    });
}

function renderEverything() {
    renderDeck();
    renderPlayerHand();
    renderBotHand();
    console.log("Cards rendered")
}

function determineOrder() {
    var bTrump = 20;
    var pTrump = 20;
    botHand.forEach(function (element) {
        if (element[1] === trumpCard[1]) {
            if (element[0] < bTrump) {
                bTrump = trumpCard[0];
            }
        }
    });
    playerHand.forEach(function (element, index) {
        if (element[1] === trumpCard[1]) {
            if (element[0] < pTrump) {
                pTrump = trumpCard[0];
            }
        }
    });
    if (bTrump < pTrump) {
        playerTurn = false;
        console.log("Bot plays first");
        return "Bot";
    } else if (pTrump < bTrump) {
        playerTurn = true;
        console.log("Player plays first");
        return "Player";
    } else {
        var num = Math.floor((Math.random() * 2)) + 1;
        if (num === 2) {
            playerTurn = false;
            console.log("Bot plays first");
            return "Bot";
        } else {
            playerTurn = true;
            console.log("Player plays first");
            return "Player";
        }
    }
}

function checkWin() {
    if (deck.cards.length === 0 && playerHand.length === 0 && botHand.length > 0) {
        return "Victory";
    } else if (deck.cards.length === 0 && botHand.length === 0 && playerHand.length > 0) {
        return "Loss";
    } else if (deck.cards.length === 0 && botHand.length === 0 && playerHand.length === 0) {
        return "Draw";
    } else {
        return "Neither";
    }
}

function takeCards() {
    document.querySelectorAll(".played_card").forEach(element => {
        if (whoTurn === "Bot") {
            playerHand.push(playedCards[playedCards.length - 1]);
            element.classList.add("player_hand");
            element.removeAttribute("id");
            element.id = `p${botHand.length + 1}c`;
            element.classList.remove("played_card");
            console.log("Player took");
        } else {
            botHand.push(playedCards[playedCards.length - 1]);
            element.classList.add("bot_hand");
            element.removeAttribute("id");
            element.id = `b${botHand.length + 1}c`;
            element.classList.remove("played_card");
            console.log("Bot took");
        }
        playedCards.pop();
    });
    console.log("Current defender takes");
}

function moveToDiscard() {
    document.querySelectorAll(".played_card").forEach(element => {
        element.removeAttribute("class");
        element.removeAttribute("id");
        element.classList.add("discarded");
    });
    playedCards.length = 0;
    playedValues.length = 0;
    botExtra.length = 0;
    console.log("Played cards moved to Discard Pile");
}

function endTurn() {
    if (playedCards.length === 0) return;
    if (whoTurn === "Player") {
        if (hasResponse === false) {
            console.log("Some cards not beaten");
            takeCards();
        } else if (hasResponse) {
            whoTurn = "Bot";
            console.log("All cards beaten");
            moveToDiscard();
        }
    } else if (whoTurn === "Bot") {
        if (hasResponse === false) {
            console.log("Some cards not beaten");
            takeCards();
        } else if (hasResponse) {
            whoTurn = "Player";
            console.log("All cards beaten");
            moveToDiscard();
        }
    }
    if (deck.length != 0) {
        drawUntilFull();
        renderAfterDraw();
    }
    var status = checkWin();
    if (status != "Neither") {
        if (status === "Victory") {
            playerWin();
        } else if (status === "Loss") {
            botWin();
        } else if (status === "Draw") {
            gameDraw();
        }
    }
    numTurns = 0;
    if (whoTurn === "Player") {
        console.log("Turn is passed on to %cPlayer", "color: red")
        playerTurnFunc();
    } else {
        console.log("Turn is passed on to %cBot", "color: red")
        botStart();
    }
}

function playerWin() {
    endMessage = "Congratulations! You won!";
    endGame("Player");
}

function botWin() {
    endMessage = "Better luck next time!";
    endGame("Bot");
}

function gameDraw() {
    endMessage = "It's a Draw!";
    endGame("Neither");
}

function endGame(winner) {
    var restartBtn = document.createElement("button");
    restartBtn.id = "restart_btn";
    restartBtn.classList.add("btn");
    restartBtn.innerHTML = "Play Again";
    restartBtn.setAttribute('onclick', "reloadPage();");
    document.body.appendChild(restartBtn);
    console.log("ok");
}

function reloadPage() {
    deck.shuffle();
    location.reload();
    return false;   
}

function drawUntilFull() {
    while (playerHand.length < 6 && deck.length != 0) {
        playerHand.push(deck.cards[0]);
        deck.cards.splice(0, 1);
    }
    playerHand = playerHand.filter(element => element != undefined);
    while (botHand.length < 6 && deck.length != 0) {
        botHand.push(deck.cards[0]);
        deck.cards.splice(0, 1);
    }
    botHand = botHand.filter(element => element != undefined);
    console.log("Hands filled");
}

function renderAfterDraw() {
    document.querySelectorAll(".player_hand, .bot_hand, .deck").forEach(element => {
        element.remove();
    });
    renderPlayerHand();
    renderBotHand();
    if (deck.length != 0) {
        renderDeck();
    }
    console.log("Hands re-rendered");
}

function playerTurnFunc() {
    if (checkWin() != "Neither") endGame(outcome);
    document.querySelectorAll(".player_hand").forEach(card => {
        card.setAttribute('onclick', "startTurn(this);");
    });
}

function botFindPlay() {
    numTurns++;
    document.querySelectorAll(".player_hand").forEach(card => {
        card.removeAttribute('onclick', "startTurn(this);");
    });
    var botPlay; //Array element
    botHand.forEach(element => {
        if (element[1] != trumpCard[1]) {
            if (botPlay === undefined || element[0] < botPlay[0] || botPlay[1] === trumpCard[1]) {
                botPlay = element;
            }
        } else if (botPlay === undefined && element[1] === trumpCard[1]) {
            botPlay = element;
        }
    })
    console.log(`The bot's best play is %c${botPlay}`, "color: blue");
    moveCard(botHand, botPlay, "Attack");
    return botPlay;
}

function moveCard(player, play, action) {
    var hand;
    if (player === botHand) {
        hand = ".bot_hand";
    } else if (player === playerHand) {
        hand = ".player_hand";
    }
    playedCards.push(play);
    playedValues.push(play[0]);
    player.splice(player.indexOf(play), 1);
    document.querySelectorAll(hand).forEach(card => {
        if (parseInt(card.dataset.value) === play[0] && card.dataset.suit === play[1]) {
            if (action === "Attack") card.id = `a${numTurns}c`;
            else if (action === "Defend") card.id = `d${numTurns}c`;
            card.classList.remove("bot_hand", "player_hand");
            card.classList.add("played_card");
            card.style.backgroundImage = `url('Cards/${play[0] + play[1].charAt(0)}.png')`;
            card.classList.remove(hand);
        }
    });
}

async function botStart() {
    let bot_card = await botFindPlay();
    hasResponse = false;
    console.log(`%cThe bot played the first card.`, "color: red");
    await playerDefense(bot_card);
}

async function botContinue() {
    await botFindExtra();
    console.log(botExtra);
    console.log(`%c^^^ Bot will add`, "color: red");
    if (botExtra.length > 0) {
        var botCard = await botPlayExtra();
        hasResponse = false;
        await playerDefense(botCard);
    }
}

async function startTurn(el) {
    await playCard(el);
    var bot_card = await botDefense(el);
    console.log(`%cThe player played a card.`, "color: blue");
    console.log(hasResponse);
    if (hasResponse === true || hasResponse === undefined) {
        console.log(`%c${bot_card}`, "color: orange");
        await botResponse(bot_card);
        console.log(`%cThe bot defended from a card.`, "color: red");
    }
    await findExtra();
}

function botFindExtra() {
    botExtra.length = 0;
    playedValues.forEach(value => {
        botHand.forEach(arr => {
            if (arr[0] === value) {
                botExtra.push(arr);
                console.log("Card added");
            }
        })
    })
}

function moveMenu() {
    var menu = document.getElementById("menu");
    menu
    menu.style.gridRow = '1/4';
    menu.style.gridColumn = '1/2'; 
    var buttons = menu.children;
    buttons[0].style.width = "8vw";
    buttons[1].style.width = "8vw";
    buttons[0].style.margin = "1vh 2vh";
    buttons[1].style.margin = "1vh 2vh";
    console.log(menu.children);
}

function botPlayExtra() {
    document.querySelectorAll(".bot_hand").forEach(card => {
        if (card.dataset.suit === botExtra[0][1] && parseInt(card.dataset.value) === botExtra[0][0]) {
            playedValues.push(botExtra[0][0]);
            playedCards.push(botExtra[0]);
            card.classList.add("played_card");
            card.classList.remove("bot_hand");
            card.style.backgroundImage = `url('Cards/${botExtra[0][0] + botExtra[0][1].charAt(0)}.png')`;
            numTurns++;
            card.id = `a${numTurns}c`;
            botHand.splice(botHand.indexOf(botExtra[0]), 1);
        }
    })
    return botExtra[0];
}

function playerDefense(el) {
    document.querySelectorAll(".player_hand").forEach(card => {
        if (card.dataset.suit === el[1] && card.dataset.value > el[0]) {
            card.setAttribute('onclick', "playerResponse(this);");
        } else if (card.dataset.suit === trumpCard[1]) {
            if (el[1] === trumpCard[1] && card.dataset.value > el[0]) {
                card.setAttribute('onclick', "playerResponse(this);")
            } else if (el[1] != trumpCard[1] && card.dataset.suit === trumpCard[1]) {
                card.setAttribute('onclick', "playerResponse(this);")
            }
        }
    });
}

function playerResponse(el) {
    return new Promise((resolve, reject) => {
        document.querySelectorAll(".player_hand").forEach(card => {
            card.removeAttribute('onclick', "playerResponse(this);");
        })
        var value = parseInt(el.dataset.value);
        var suit = el.dataset.suit;
        var refCard; //Array element
        playerHand.forEach(card => {
            if (card[0] === value && card[1] === suit) {
                refCard = card;
            }
        });
        moveCard(playerHand, refCard, "Defend");
        hasResponse = true;
        resolve(botContinue());
    });
}

function playCard(el) {
    return new Promise((resolve, reject) => {
        numTurns++;
        var value = parseInt(el.dataset.value);
        var suit = el.dataset.suit;
        var cards = document.querySelectorAll('span');
        var refCard; //Array element, NOT span
        // Dealing with arrays
        playerHand.forEach(card => {
            if (card[0] === value && card[1] === suit) {
                refCard = card;
            }
        });
        moveCard(playerHand, refCard, "Attack")
        cards.forEach(element => {
            element.removeAttribute("onclick", "startTurn(this);");
        });
        resolve(el);
    })
}

function botDefense(card) {
    return new Promise((resolve, reject) => {
        if(hasResponse === false) {
            reject("No response");
            return;
        }
        var num = card.dataset.value;
        var suit = card.dataset.suit;
        var response = undefined; //Array element
        botHand.forEach(element => { //Determines the weakest possible answer
            if (suit === trumpCard[1] && element[1] === suit && element[0] > num) {
                if (response === undefined || element[0] < response[0]) {
                    response = element;
                }
            } else if (suit != trumpCard[1] && element[1] === suit && element[0] > num) {
                if (response === undefined || response[1] === trumpCard[1] || element[0] < response[0]) {
                    response = element;
                }
            } else if (suit != trumpCard[1] && element[1] === trumpCard[1]) {
                if (response === undefined || (response[1] === trumpCard[1] && element[0] < response[0])) {
                    response = element;
                }
            }
        });
        console.log(`%c${response}`, "color: red");
        if (response === undefined) {
            hasResponse = false;
            findExtra();
            reject("No response");
        } else {
            hasResponse = true;
            playedCards.push(response);
            playedValues.push(response[0]);
            resolve(response);
        }
    })
}

function botResponse(response) {
    return new Promise((resolve, reject) => {
        var respCard = document.querySelector(`[data-value="${response[0]}"][data-suit="${response[1]}"]`);
        console.log(`%c${respCard}`, "color: purple");
        respCard.id = `d${numTurns}c`;
        respCard.style.backgroundImage = `url('Cards/${response[0] + response[1].charAt(0)}.png')`;
        respCard.classList.add("played_card");
        hasResponse = true;
        botHand.splice(botHand.indexOf(response), 1);
        resolve(response);
    })
}

function findExtra() {
    return new Promise((resolve, reject) => {
        document.querySelectorAll(".player_hand").forEach(card => {
            if (playedValues.includes(parseInt(card.dataset.value))) {
                card.setAttribute('onclick', "startTurn(this);");
                card.classList.add("playable_card");
            }
        });
        resolve("Cards found");
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global Variables/Objects

var deck = {
    cards: makeDeck(),
    shuffle: function () {
        for (var i = 0; i < 1000; i++) {
            var card1 = Math.floor((Math.random() * this.cards.length));
            var card2 = Math.floor((Math.random() * this.cards.length));
            var temp = this.cards[card1];

            this.cards[card1] = this.cards[card2];
            this.cards[card2] = temp;

            console.log("Deck shuffled")
        }
    }
}



var playerHand = drawHand();

var botHand = drawHand();

var trumpCard = pickTrumpCard();

var firstPlayer = determineOrder();

var whoTurn = firstPlayer;

var outcome = checkWin();

var playedCards = new Array;

var playedValues = new Array;

var botExtra = new Array;

var hasResponse;

var numTurns = 0;

var endMessage;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Logic

async function startGame() {
    await renderEverything();
    if (whoTurn === "Player")
        playerTurnFunc();
    else botStart();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////