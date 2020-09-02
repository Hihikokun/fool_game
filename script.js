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

function drawHand() {
    deck.shuffle();
    var hand = new Array;
    for (let i = 0; i < 6; i++) {
        hand.push(deck.cards[i]);
        deck.cards.splice(i, 1);
    }
    console.log("Hands distributed");
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
        card.innerHTML = element[0] + "<br />" + element[1];
        if (element === trumpCard) {
            card.classList.add("trump_card");
        }
        document.body.appendChild(card);
    });
}

function renderPlayerHand() {
    playerHand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.classList.add("face_up_card", "player_hand", element[1], `p${index + 1}c`);
        card.innerHTML = element[0] + "<br />" + element[1];
        document.body.appendChild(card);
    });
}

function renderBotHand() {
    botHand.forEach(function (element, index) {
        var card = document.createElement("span");
        card.dataset.value = element[0];
        card.dataset.suit = element[1];
        card.classList.add("face_up_card", "bot_hand", element[1], `b${index + 1}c`);
        card.innerHTML = element[0] + "<br />" + element[1];
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
        botHand.push(playedCards[playedCards.length - 1]);
        playedCards.pop();
        if(playerTurn) {
            element.classList.add("player_hand");
            element.removeAttribute("id");
            element.id = `p${botHand.length + 1}c`;
            element.classList.remove("played_card");
        } else {
            element.classList.add("bot_hand");
            element.removeAttribute("id");
            element.id = `b${botHand.length + 1}c`;
            element.classList.remove("played_card");
        }
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
    if(playedCards.length === 0) return;
    if(playedCards.length % 2 === 1) {
        hasResponse === false;
    }
    if (whoTurn === "Player") {
        if (hasResponse === false) {
            takeCards();
        } else if (hasResponse) {
            whoTurn = "Bot";
            moveToDiscard();
        }
    } else if (whoTurn === "Bot") {
        if (hasResponse === false) {
            takeCards()
        } else if (hasResponse) {
            whoTurn = "Player";
            moveToDiscard();
        }
    }
    drawUntilFull();
    renderAfterDraw();
    numTurns = 0;
    if (whoTurn === "Player") {
        console.log("Turn is passed on to %cPlayer", "color: red")
        playerTurnFunc();
    } else {
        console.log("Turn is passed on to %cBot", "color: red")
        botStart();
    }
}

function drawUntilFull() {
    while(playerHand.length < 6) {
        playerHand.push(deck.cards[deck.cards.length - 1]);
        deck.cards.pop();
    }
    while(botHand.length < 6) {
        botHand.push(deck.cards[deck.cards.length - 1]);
        deck.cards.pop();
    }
    console.log("Hands filled");
}

function renderAfterDraw() {
    document.querySelectorAll(".player_hand").forEach(element => {
        element.remove();
    });
    document.querySelectorAll(".bot_hand").forEach(element => {
        element.remove();
    });
    renderPlayerHand();
    renderBotHand();
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
    if(player = botHand) {
        hand = ".bot_hand";
        console.log("OKAY");
    }
    else if(player = playerHand) {
        hand = ".player_hand";
        console.log("WEEEE");
    }
    playedCards.push(play);
    playedValues.push(play[0]);
    player.splice(player.indexOf(play), 1);
    document.querySelectorAll(hand).forEach(card => {
        if (parseInt(card.dataset.value) === play[0] && card.dataset.suit === play[1]) {
            if(action === "Attack") card.id = `a${numTurns}c`;
            else if(action === "Defend") card.id = `d${numTurns}c`;
            card.classList.add(".played_card");
            card.classList.remove(hand);
        }
    });
}

async function botStart() {
    let bot_card = await botFindPlay();
    await playerDefense(bot_card);
}

async function botContinue() {
    await botFindExtra();
    if (botExtra.length > 0) {
        var botCard = await botPlayExtra();
        await playerDefense(botCard);
    } else {
    }
}

async function startTurn(el) {
    await playCard(el);
    var bot_card = await botDefense(el);
    await botResponse(bot_card);
    await findExtra();
}

function botFindExtra() {
    playedValues.forEach(value => {
        botHand.forEach(arr => {
            if (arr[0] === value) {
                botExtra.push(arr);
            }
        })
    })
}

function botPlayExtra() {
    document.querySelectorAll(".bot_hand").forEach(card => {
        if (card.dataset.suit === botExtra[0][1] && parseInt(card.dataset.value) === botExtra[0][0]) {
            playedValues.push(botExtra[0][0]);
            playedCards.push(botExtra[0]);
            card.classList.add("played_card");
            card.classList.remove("bot_hand");
            numTurns++;
            card.id = `a${numTurns}c`;
        }
    })
    return botExtra[0];
}

function playerDefense(el) {
    document.querySelectorAll(".player_hand").forEach(card => {
        if (card.dataset.suit === el[1] && card.dataset.value > el[0]) {
            card.setAttribute('onclick', "playerResponse(this);")
        } else if (toString(card.dataset.suit) === toString(trumpCard[1])) {
            if (el[1] === trumpCard[1] && card.dataset.value > el[0]) {
                card.setAttribute('onclick', "playerResponse(this);")
            } else if (el[1] != trumpCard[1] && toString(card.dataset.suit) === toString(trumpCard[1])) {
                card.setAttribute('onclick', "playerResponse(this);")
            }
        }
    })
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
                console.log(refCard);
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
        playedCards.push(refCard);
        playerHand.splice(playerHand.indexOf(refCard), 1);
        // Dealing with span elements
        cards.forEach(element => {
            element.removeAttribute("onclick", "startTurn(this);");
        });
        el.id = `a${numTurns}c`;
        el.classList.add("played_card");
        el.classList.remove("player_hand");
        resolve(el);
    })
}

function botDefense(card) {
    return new Promise((resolve, reject) => {
        var num = card[0];
        var suit = card[1];
        var response; //Array element
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
                if (response === undefined || (response[1] === trumpCard[1] && element[0] > response[0])) {
                    response = element;
                }
            }
        });
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
        botHand.splice(botHand.indexOf(response), 1);
        var respCard = document.querySelector(`[data-value="${response[0]}"][data-suit="${response[1]}"]`);
        respCard.id = `d${numTurns}c`;
        respCard.classList.add("played_card");
        hasResponse = true;
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

var discardedCards = new Array;

var botExtra = new Array;

var hasResponse = false;

var numTurns = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Game Logic

async function startGame() {
    await deck.shuffle(); //Done
    await renderEverything(); //Done
    if (whoTurn === "Player")
        playerTurnFunc();
    else botStart();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////