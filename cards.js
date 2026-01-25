/* 
  Utility functions for playing-card functions on web pages
*/
const numSymbol = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suiteSymbol = ["\u{2665}", "\u{2666}", "\u{2663}", "\u{2660}"];
const suiteColor = ["red", "red", "black", "black"];

var cards = [];
var shuffled = [];

/* Define the "home" positions of each card */
function homeX(s, n) {
  return n * 6 + s + 1;
}
function homeY(s, n) {
  return s * 14 + n + 1;
}

/** Initialize the deck of cards, laid-out face-up across the canvas */
function initCards() {
  console.log(`initCards: Initializing cards...`);
  cards = [];
  for (let s=0; s < suiteSymbol.length; s++) {
    for (let n=0; n < numSymbol.length; n++) {
      addCard('card' + numSymbol[n] + suiteSymbol[s], n, s, homeX(s, n), homeY(s, n));
    }
  }
}

/** Create a new card and add it to the canvas at a specified location */
function addCard(elid, number, suite, posX, posY) {
  //console.log(`addCard: elid='${elid}' number=${number} suite=${suite} pos=(${posX},${posY})`);
  const newCard = document.createElement('div');
  newCard.className = "card";
  newCard.id = elid;
  const newCardBody = document.createElement('div');
  newCardBody.className = "card-body faceup";

  newCardBodyNumberTop = document.createElement('div');
  newCardBodyNumberTop.className = "card-body-number card-body-number-top";
  newCardBodyNumberTop.textContent = numSymbol[number];
  newCardBodyNumberTop.style.color = suiteColor[suite];
  newCardBody.appendChild(newCardBodyNumberTop);

  newCardBodySuiteTop = document.createElement('div');
  newCardBodySuiteTop.className = "card-body-suite-top";
  newCardBodySuiteTop.textContent = suiteSymbol[suite];
  newCardBodySuiteTop.style.color = suiteColor[suite];
  newCardBody.appendChild(newCardBodySuiteTop);
  
  newCardBodySuiteBottom = document.createElement('div');
  newCardBodySuiteBottom.className = "card-body-suite-bottom";
  newCardBodySuiteBottom.textContent = suiteSymbol[suite];
  newCardBodySuiteBottom.style.color = suiteColor[suite];
  newCardBody.appendChild(newCardBodySuiteBottom);

  newCardBodyNumberBottom = document.createElement('div');
  newCardBodyNumberBottom.className = "card-body-number card-body-number-bottom";
  newCardBodyNumberBottom.textContent = numSymbol[number];
  newCardBodyNumberBottom.style.color = suiteColor[suite];
  newCardBody.appendChild(newCardBodyNumberBottom);
  
  newCardBodyInterior = document.createElement('div');
  newCardBodyInterior.className = "card-body-interior";
  newCardBodyInterior.textContent = suiteSymbol[suite];
  newCardBodyInterior.style.color = suiteColor[suite];
  newCardBody.appendChild(newCardBodyInterior);
  newCard.appendChild(newCardBody);
  newCard.style.left = posX + '%'; //'vw';
  newCard.style.top = posY + '%'; //'vw';
  
  // Set the card's state initially to face-up:
  newCard.cardState = "face-up";
  
  // Add the new card element to the page, and to the 'cards' array
  document.getElementById('cardwindow').appendChild(newCard);
  cards.push(newCard);
}

/** Set a card's "state" (face-up or face-down) */
function setCardState(elid, state) {
  //console.log(`setCardState(${elid}): target state=${state}`);
  let el = document.getElementById(elid);
  //console.log(`setCardState(${elid}): initial card state was: ${el.cardState}`);
  el.cardState = state;
  // Alter the appearance to reflect the new state
  let details = ['.card-body-number-top', '.card-body-number-bottom',
    '.card-body-suite-top', '.card-body-suite-bottom', '.card-body-interior'];
  if (state == 'face-up') {
    // face-up: background=white, all details visible (NOT hidden)
    el.querySelector('.card-body').style.backgroundColor = 'white';
    for (att of details) {
      el.querySelector(att).hidden = false;
    }
  } else if (state == 'face-down') {
    // face-down: background=blue, all details hidden
    el.querySelector('.card-body').style.backgroundColor = 'blue';
    for (att of details) {
      el.querySelector(att).hidden = true;
    }
  } else {
    console.log(`setCardState(${elid}): ERROR: Unrecognized target state '${state}'`);
  }
}

/** Set an aelement's 'Z' position, i.e. its stacking order */
function setZ(elid, z) {
  let el = document.getElementById(elid);
  //console.log(`setZ(${elid}): zIndex was: ${el.style.zIndex}. Setting to: ${z}`);
  el.style.zIndex = z;
}

/* Utility function to perform an animation; loosely based on: https://javascript.info/js-animation */
function animate({elid, drawFunc, duration, parms}) {
  return new Promise((resolve, reject) => {
    let el = document.getElementById(elid);
    let startX = parseInt(el.style.left); // Ignore the trailing '%' and convert to number
    let startY = parseInt(el.style.top); // Ignore the trailing '%' and convert to number
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      let timeFraction = Math.max(Math.min((time - start) / duration, 1), 0);
      //console.log(`animate: elid=${elid} start=${start} time=${time} timeFraction=${timeFraction}`);
      drawFunc(el, startX, startY, parms, timeFraction);
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
		resolve("SUCCESS!");
	  }
    });
  });
}

function drawFuncMoveTo(el, startX, startY, parms, progress) {
  //console.log(`drawFuncMoveTo: el.id=${el.id}, startX=${startX}, startY=${startY}, parms=${JSON.stringify(parms)}, progress=${progress}`);
  let newX = startX + (parms.endX - startX) * progress;
  el.style.left = newX + "%"; //"vw";
  let newY = startY + (parms.endY - startY) * progress;
  el.style.top = newY + "%"; //"vw";
  //console.log(`drawFuncMoveTo: Moved element to X=${newX}, Y=${newY}`);
}

function drawFuncFlip(el, startX, startY, parms, progress) {
  //console.log(`drawFuncFlip: el.id=${el.id}, startX=${startX}, startY=${startY}, parms=${JSON.stringify(parms)}, progress=${progress}`);
  let newWidth = 0;
  if (progress < 0.5) {
    newWidth = 15 * (0.5 - progress) * 2;
  } else {
    if (! parms.doneFlip) {
      setCardState(el.id, parms.newState);
      parms.doneFlip = true;
    }
    newWidth = 15 * (progress - 0.5) * 2;
  }
  el.style.width = newWidth + "vw";
}

function animateMoveAllCardsToHomePositions() {
  let promises = [ ];
  for (let s=0; s < suiteSymbol.length; s++) {
    for (let n=0; n < numSymbol.length; n++) {
      setZ('card' + numSymbol[n] + suiteSymbol[s], s * 13 + n);
      promises.push(animate({
	    elid: 'card' + numSymbol[n] + suiteSymbol[s],
        drawFunc: drawFuncMoveTo,
        duration: 300,
        parms: {endX: homeX(s, n), endY: homeY(s, n)}
      }));
    }
  }
  //console.log(`animateMoveAllCardsToHomePositions: after moving all cards, promises.length=${promises.length}`);
  return Promise.all(promises);
}

function animateMoveAllCardsToShuffledPositions(shuffled) {
  let promises = [ ];
  // Reposition the cards across the board in their shuffled order...
  for (let c=0; c < shuffled.length; c++) {
    let x = c % 13;
    let y = Math.floor(c / 13);
    setZ(shuffled[c], c);
    promises.push(animate({
      elid: shuffled[c],
      drawFunc: drawFuncMoveTo,
      duration: 2000,
      parms: {endX: x * 5 + x + 1, endY: y * 15 + x + 1}
    }));
  }
  //console.log(`animateMoveAllCardsToShuffledPositions: after moving all cards, promises.length=${promises.length}`);
  return Promise.all(promises);
}

function animateMoveAllCardsToStack(shuffled, stackX, stackY) {
  let promises = [ ];
  // Move all cards to the left-hand pile, ready to be flipped
  // (in the shuffled order)...
  for (let c=0; c < shuffled.length; c++) {
    setZ(shuffled[c], c);
    promises.push(animate({
      elid: shuffled[c],
      drawFunc: drawFuncMoveTo,
      duration: 300,
      parms: {endX: stackX + Math.random() * 2, endY: stackY + Math.random() * 3}
    }));
  }
  //console.log(`animateMoveAllCardsToStack: after moving all cards, promises.length=${promises.length}`);
  return Promise.all(promises);
}

function animateFlip(elid, duration) {
  //console.log(`animateFlip('${elid}'): duration=${duration}`);
  let el = document.getElementById(elid);
  //console.log(`animateFlip('${elid}'): initial card state was: ${el.cardState}`);
  let newState = el.cardState == 'face-up' ? 'face-down' : 'face-up';
  return animate({
	elid: elid,
    drawFunc: drawFuncFlip,
    duration: duration,
    parms: { newState: newState, doneFlip: false }
  });
}

function animateFlipAllCards(newState) {
  let promises = [ ];
  for (let c = 0; c < cards.length; c++) {
	let cardId = cards[c].id;
    setZ(cardId, c);
    let el = document.getElementById(cardId);
    if (el.cardState != newState) {
      promises.push(animateFlip(cardId, 500));
	}
  }
  //console.log(`animateFlipAllCards: after flipping all cards, promises.length=${promises.length}`);
  return Promise.all(promises);
}

function shuffle() {
  console.log(`shuffle: START`);

  // Shuffle the cards by deriving a list of the cards' ids and ramdomizing it
  shuffled = [];
  for (let c=0; c < cards.length; c++) {
    shuffled.push(cards[c].id);
  }
  // Randomize the list by going through the list and swapping each element with
  // a random other element
  for (let c=0; c < shuffled.length; c++) {
    let c2 = Math.floor(Math.random() * (shuffled.length));
    let cId = shuffled[c];
    shuffled[c] = shuffled[c2];
    shuffled[c2] = cId;
  }
  console.log(`shuffle: shuffled list of cards: ${JSON.stringify(shuffled)}`);
  
  animateMoveAllCardsToHomePositions('face-up')
  .then(() => animateFlipAllCards())
  .then(() => animateFlipAllCards('face-down'))
  .then(() => animateMoveAllCardsToShuffledPositions(shuffled))
  .then(() => animateMoveAllCardsToStack(shuffled, 30, 20))
  ;

  // Enable the "Flip Next Card" button
  document.getElementById('FlipNextCardButton').disabled = false;
  console.log(`shuffle: END`);
}

function flipNextCard() {
  console.log(`flipNextCard: START`);
  if (shuffled.length == 0) {
    alert("Shuffle the cards first!");
  } else {
    let nextCardId = shuffled.pop();
    console.log(`flipNextCard: next card=${nextCardId}`);
    animate({
      elid: nextCardId,
      drawFunc: drawFuncMoveTo,
      duration: 300,
      parms: {endX: 60 + Math.random() * 2, endY: 20 + Math.random() * 2}
    })
    .then(() => {
      animateFlip(nextCardId, 100);
      z = cards.length - shuffled.length;
      setZ(nextCardId, z);
	})
	;
  }
  // If the 'shuffled' pile is empty, disable the 'Flip next card' button
  if (shuffled.length == 0) {
    document.getElementById('FlipNextCardButton').disabled = true;
  }
  console.log(`flipNextCard: END`);
}
