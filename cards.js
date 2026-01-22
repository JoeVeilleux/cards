      const numSymbol = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
      const suiteSymbol = ["\u{2665}", "\u{2666}", "\u{2663}", "\u{2660}"];
      const suiteColor = ["red", "red", "black", "black"];

      /* Utility function to perform an animation; this is a simplified version of 
        code found at: https://javascript.info/js-animation */
      function animate({drawFunc, duration}) {
        let start = performance.now();
        requestAnimationFrame(function animate(time) {
          //console.log(`animate: start=${start} time=${time} duration=${duration}`);
          let timeFraction = Math.min((time - start) / duration, 1);
          drawFunc(timeFraction);
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }
        });
      }
      function animateMoveTo(elid, endX, endY, duration) {
        let el = document.getElementById(elid);
        // Get starting location from the element's properties
        let startX = parseInt(el.style.left); // Ignore the trailing '%' and convert to number
        let startY = parseInt(el.style.top); // Ignore the trailing '%' and convert to number
        console.log(`animateMoveTo(${elid}): start=(${startX},${startY}) end=(${endX},${endY}) duration=${duration}`);
        animate({
          duration: duration,
          drawFunc: function(progress) {
            let newX = startX + (endX - startX) * progress;
            el.style.left = newX + "%"; //"vw";
            let newY = startY + (endY - startY) * progress;
            el.style.top = newY + "%"; //"vw";
          }
        });
      }
      function animateFlip(elid, duration) {
        console.log(`animateFlip('${elid}'): duration=${duration}`);
        let el = document.getElementById(elid);
        console.log(`animateFlip('${elid}'): initial card state was: ${el.cardState}`);
        let newState = el.cardState == 'face-up' ? 'face-down' : 'face-up';
        let doneFlip = false;
        animate({
          duration: duration,
          drawFunc: function(progress) {
            let newWidth = 0;
            if (progress < 0.5) {
              newWidth = 15 * (0.5 - progress) * 2;
            } else {
              if (! doneFlip) {
                setCardState(el.id, newState);
                doneFlip = true;
              }
              newWidth = 15 * (progress - 0.5) * 2;
            }
            el.style.width = newWidth + "vw";
          }
        });
      }
      function setCardState(elid, state) {
        console.log(`setCardState(${elid}): state=${state}`);
        let el = document.getElementById(elid);
        console.log(`setCardState(${elid}): initial card state was: ${el.cardState}`);
        el.cardState = state;
        // Alter the appearance to reflect the new state
        if (state == 'face-up') {
          // face-up: background=white, all details visible (NOT hidden)
          el.querySelector('.card-body').style.backgroundColor = 'white';
          let details = ['.card-body-number-top', '.card-body-number-bottom',
            '.card-body-suite-top', '.card-body-suite-bottom', '.card-body-interior'];
          for (att of details) {
            el.querySelector(att).hidden = false;
          }
        } else if (state == 'face-down') {
          // face-down: background=blue, all details hidden
          el.querySelector('.card-body').style.backgroundColor = 'blue';
          let details = ['.card-body-number-top', '.card-body-number-bottom',
            '.card-body-suite-top', '.card-body-suite-bottom', '.card-body-interior'];
          for (att of details) {
            el.querySelector(att).hidden = true;
          }
        } else {
          console.log(`setCardState(${elid}): ERROR: Unrecognized new state '${state}'`);
        }
      }
      var cards = [];
      var shuffled = [];
      function showCards() {
        for (let c=0; c < cards.length; c++) {
          console.log(`cards[${c}]: ${JSON.stringify(cards[c].outerHTML)}`);
        }
      }
      function addCard(elid, number, suite, posX, posY) {
        //console.log(`addCard: elid='${elid}' number=${number} suite=${suite} pos=(${posX},${posY})`);
        const newCard = mkCard(elid, number, suite, posX, posY);
        document.getElementById('cardwindow').appendChild(newCard);
        cards.push(newCard);
      }
      function mkCard(elid, number, suite, posX, posY) {
        //console.log(`mkCard: elid='${elid}' number=${number} suite=${suite} pos=(${posX},${posY})`);
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
        
        return newCard;
      }
      function showPos(elid) {
        let el = document.getElementById(elid);
        let elPar = el.offsetParent;
        console.log(`showPos(${elid}): style.left=${el.style.left} style.top=${el.style.top}`);
      }
      function setElBackground(elid, c) {
        let el = document.getElementById(elid);
        el.style.backgroundColor = c;
      }
      function setZ(elid, z) {
        console.log(`setZ(${elid}): z=${z}`);
        let el = document.getElementById(elid);
        console.log(`setZ(${elid}): initial zIndex was: ${el.style.zIndex}`);
        el.style.zIndex = z;
      }
      function shuffle() {
        console.log('shuffle: Shuffling cards');
        // First, flip all cards face-down...
        for (let c=0; c < cards.length; c++) {
          if (cards[c].cardState == 'face-up') {
            animateFlip(cards[c].id, 500);
          }
        }
        // Shuffle the cards by deriving a list of the cards' ids, ramdomizing it, then
        // moving each card on the now-randomized list to the 'next' location across the board
        shuffled = [];
        for (let c=0; c < cards.length; c++) {
          shuffled.push(cards[c].id);
        }
        console.log(`shuffle: initial list of card ids: ${JSON.stringify(shuffled)}`);
        // Randomize the list by going through the list and swapping each element with
        // a random other element
        for (let c=0; c < shuffled.length; c++) {
          let c2 = Math.floor(Math.random() * (shuffled.length));
          let cId = shuffled[c];
          shuffled[c] = shuffled[c2];
          shuffled[c2] = cId;
        }
        console.log(`shuffle: after shuffling: ${JSON.stringify(shuffled)}`);
        // Reposition the cards across the board in their shuffled order...
        let z=0;
        for (let c=0; c < shuffled.length; c++) {
          let x = c % 13;
          let y = Math.floor(c / 13);
          animateMoveTo(shuffled[c], x * 5 + x + 1, y * 15 + x + 1, 500);
          setZ(shuffled[c], z);
          z++;
        }
        // Next, move all cards to the left-hand pile, ready to be flipped
        // (in the shuffled order)...
        z=0;
        for (let c=0; c < shuffled.length; c++) {
          animateMoveTo(shuffled[c], 30 + Math.random() * 2, 20 + Math.random() * 3, 500);
          setZ(shuffled[c], z);
          z++;
        }
        // Enable the "Flip Next Card" button
        document.getElementById('FlipNextCardButton').disabled = false;
      }
      function flipNextCard() {
        console.log(`flipNextCard: shuffled=${JSON.stringify(shuffled)}`);
        if (shuffled.length == 0) {
          alert("Shuffle the cards first!");
        } else {
          let nextCardId = shuffled.pop();
          console.log(`flipNextCard: next card=${nextCardId}`);
          animateFlip(nextCardId, 500);
          animateMoveTo(nextCardId, 60 + Math.random() * 2, 20 + Math.random() * 2, 1000);
          z = cards.length - shuffled.length;
          setZ(nextCardId, z);
        }
        // If the 'shuffled' pile is empty, disable the 'Flip next card' button
        if (shuffled.length == 0) {
          document.getElementById('FlipNextCardButton').disabled = true;
        }
      }
