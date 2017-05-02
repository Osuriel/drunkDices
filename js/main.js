/*

DrunkDices.com
GAME RULES:

Each Player can roll the dices as many time as they wish until they decide to hold their point and pass the turn or they get a “one”.

If a player gets a “one” when they roll the dice, they will not get any points and their turn will be over. A player must take a shot every time they get a 1.

If a player roll the dice 6 or more times in a turn and decides to hold his points, that turn become a fire turn. If a player gets a streak of 3 fire turns in a row he will get 50 bonus points and every other player has to have a drink.

When a player gets a “one” 3 turns in a row he must have an extra drink.

The first Player to reach 250 points wins the game, and every losing player has to have a drink.

Its super easy! The game will remind you when someone has to have a drink!

*/


// ----------------------------------- SET UP -----------------------------------

var numberOfPlayers, players, winningScore, activePlayer, diceResult, currentScore, playerTurn, gameOn, diceImgs, nameInputArray, successfulRolls, errorNameInput, holdRoll, diceRolling, rollDiceButtonActive, holdPointsButtonActive;

// players = {};
// winningScore = 250;
// playerTurn = 1;
// currentScore = 0;
// gameon = false;
// diceImgs =[];
// successfulRolls = 0;
// diceRolling = false;
// rollDiceButtonActive = true;
// holdPointsButtonActive = true;
// nameInputArray = [];

//DOM elements
var lowOpacityScreenDiv= document.getElementById('low-opacity-screen');
var popupBoxDiv = document.getElementById('popup-box');
var howManyPlayersDiv = document.getElementById('how-many-players');
var nameFormDiv = document.getElementById('name-form');
var error = document.querySelector('.error');
var nameList = document.getElementById('name-list');
var currentAttempsDOM = document.getElementById('current_attemps_number');
var currentBigBoxDOM = document.getElementById('current_big_box');
var bigFlamesDOM = document.getElementById('inside-left');
var bigXDOM = document.getElementById('inside-right');
var activePlayerScoreNode = document.getElementById('active_player_score');
var activePlayerNameNode = document.getElementById('active_player_name');
var gameMessageDiv = document.getElementById('game-message');
var gameMessageText = document.getElementById('message-text');
var gameMessageOK = document.getElementById('message-ok');
var gameMessageHeading = document.getElementById('message-heading');

//DOM Elements for Player Announcements (player -turns);
var turnAnnouncement = document.getElementById('turn-announcement');
var turnAnnouncementName = document.getElementById('turn-announcement-name');
var turnAnnouncementText = document.getElementById('turn-announcement-text');
var stopLoop = false;
var gameMessageShown = false;
var gameMessageNeeded = false;

//Dom Elements Game controls
var playerBoxContainer = document.getElementById('player-box-container');
var rollDiceButton = document.getElementById('roll_dice_button');
var holdPointsButton = document.getElementById('hold_points_button');
var diceDom = document.getElementById('dice');
var currentScoreDOM = document.getElementById('current_score');





//functions:


function makeNode( type, classes , parent){
  var element = document.createElement(type);
  element.className = classes;
  parent.appendChild(element);
  return element;
}

function hide(element){
  element.classList.add('hidden');
}

function show(element){
  element.classList.remove('hidden');
}

function stillRolling(){
    var tempDice = Math.floor(Math.random() * 6) + 1;
    diceDom.src = diceImgs[tempDice];
    console.log('this is running');
}

function initializeGame(){
  numberOfPlayers = 0;
  players = {};
  winningScore = 250;
  playerTurn = 1;
  currentScore = 0;
  gameon = false;
  diceImgs =[];
  successfulRolls = 0;
  diceRolling = false;
  rollDiceButtonActive = true;
  holdPointsButtonActive = true;
  nameInputArray = [];
  nameList.innerHTML = "";

  //Set UI to empty.
  currentScoreDOM.textContent = 0;
  activePlayerNameNode.textContent = "Player1";
  bigFlamesDOM.innerHTML = "";
  bigXDOM.innerHTML = "";
  playerBoxContainer.innerHTML = "";
  currentAttempsDOM.textContent = 0;
  activePlayerScoreNode.textContent = 0;

  //Show Pop Up Boxes.
  show(lowOpacityScreenDiv);
  show(popupBoxDiv);
  show(howManyPlayersDiv);
}

function rollDice(){
  if ( rollDiceButtonActive === true ){
    //Making dice rol for .150 seconds before selecting the number
    if ( diceRolling === false ){
      interval= setInterval( stillRolling, 60);
    }
    // debugger;

    //Real Dice Roll
    function realDiceRoll (){

      clearInterval(interval)
      diceResult = Math.floor(Math.random() * 6) + 1;
      diceDom.src = diceImgs[diceResult];
      addToCurrentScore();
      console.log(diceResult);
      diceRolling = false;

    }

    setTimeout( realDiceRoll, 400);
    diceRolling = true;
    rollDiceButtonActive = false;
    rollDiceButton.className = 'roll_dice_active roll_dice_inactive';
    setTimeout ( function(){
      rollDiceButtonActive = true;
      rollDiceButton.className = '';
     } , 700);
  }
}

function addToCurrentScore(){
  if ( diceResult === 1 ){
    currentScore = 0;
    currentScoreDOM.textContent= currentScore;
    activePlayer.flames = 0;
    activePlayer.x++;

    setTimeout( function(){
      //Takes 20 points away if you have an X streak of 3.
      if ( activePlayer.x >= 3 && activePlayer.score > 20 ) {
        activePlayer.score -= 20;
        //Show Pop up saying you just lost 20 points and every other player needs a drink.
        //alert('You got 3 X in a row. you just lost 20 points');
        gameMessage( '-20 points! - "X" streak', 'You got 3 X in a row. you just lost 20 points and must take an extra drink!, This happens because you got a "1" or an X, 3 times in a row. Be wiser and hold your points next time.' );
      } else if (activePlayer.x >= 3 && activePlayer.score <= 20) {
        activePlayer.score = 0;
        //Show Pop up saying you just lost 20 points and every other player needs a drink
        gameMessage( '-20 points! - "X" streak', 'You got 3 X in a row. you just lost 20 points and must take an extra drink!, This happens because you got a "1" or an X, 3 times in a row. Be wiser and hold your points next time.' );
      } else {
        // alert('You got a 1! Take a Shot and your turn is over');
        gameMessage( 'You got a 1! ', 'You rolled a 1. Take a Shot and your turn is over. Every time you get a 1 you get an X. If you get a streak of 3 X you will lose 20 points.' );
        switchTurn();
      }

    }, 500);
  } else {
    currentScore += diceResult;
    currentScoreDOM.textContent= currentScore;
    successfulRolls++;
    currentAttempsDOM.textContent = successfulRolls;
    if ( successfulRolls === 6 ){
      currentAttempsDOM.className = 'current_attemps_streak';//Lights up the flame indicating a streak.
    }

  }
  if( (currentScore + activePlayer.score ) >= winningScore ){

    setTimeout( function(){
      alert(activePlayer.name + ' just WON the game! Every other player has to take a shot, the person in last place takes 2');
    }, 500);

  }
}

function addToPlayerScore(){
  rollDiceButtonActive = false;
  rollDiceButton.className = 'roll_dice_inactive';
  if (holdPointsButtonActive){
    holdPointsButtonActive = false;
    currentScoreDOM.className = 'moving_current_score';
    holdPointsButton.className = 'hold_points_inactive';

    setTimeout( function(){
      activePlayer.score += currentScore;
      activePlayer.x = 0;
      activePlayerScoreNode.textContent = activePlayer.score;

      if ( successfulRolls >= 6 ){
        if (activePlayer.flames < 3){
          activePlayer.flames++;
        }
      } else {
        activePlayer.flames = 0;
      }

      if ( activePlayer.flames === 6 ){
        activePlayer.score += 50;
        //Show Pop up saying you just got 50 points and every other player needs a drink.
        alert('You got 3 X in a row. you just Won 50 points, Every other player needs a drink');
      }
      updateBigStreaks( activePlayer.flames, activePlayer.x );

      setTimeout( function(){
        currentScoreDOM.className = '';
        switchTurn();
        rollDiceButtonActive = true;
        rollDiceButton.className = '';
        holdPointsButton.className = '';
      } , 1000)


    } , 1000 )

  }
}

function switchTurn(){
  activePlayer.html.score.textContent = activePlayer.score;
  currentScore = 0;
  holdPointsButtonActive = true;
  currentAttempsDOM.className = '';//Lights up the flame indicating a streak.
  currentScoreDOM.textContent = 0;
  currentAttempsDOM.textContent = 0;
  successfulRolls = 0;
  updateStreaks( activePlayer.flames, activePlayer.x );
  activePlayer.html.playerBox.classList.remove('active_player_box');
  if ( playerTurn === numberOfPlayers ){
    playerTurn = 1;
  } else {
    playerTurn++;
  }
  activePlayer = players['player' + playerTurn];
  announceNextPlayer(activePlayer.name);
  activePlayerNameNode.textContent = activePlayer.name;
  activePlayerScoreNode.textContent = activePlayer.score;
  activePlayer.html.playerBox.classList.add('active_player_box');

  updateBigStreaks( activePlayer.flames, activePlayer.x );

  if ( activePlayer.flames >= 3 ){
    currentBigBoxDOM.classList.add('fire_bg');
  }else{
    currentBigBoxDOM.classList.remove('fire_bg');
  }
}


function updateStreaks( flames, xs ){
  var flameImgs = '<img src="img/flame_icon.png" alt="Flame for Hot streak" class="small-streak-img">';
  var xImgs = '<img src="img/x_icon.png" alt="X for Hot streak" class="small-streak-img">';
  activePlayer.html.flames.innerHTML = "";
  activePlayer.html.x.innerHTML = "";

  for ( var i = 1 ; i <= flames && i <=3 ; i++ ){
    activePlayer.html.flames.innerHTML += flameImgs;
  }

  for ( var i = 1 ; i <= xs && i <=3 ; i++ ){
    activePlayer.html.x.innerHTML += xImgs;
  }
}

function updateBigStreaks ( flames, xs) {
  var flameImgs = '<img src="img/flame_icon.png" alt="Flame for Hot streak" class="big-streak-img">';
  var xImgs = '<img src="img/x_icon.png" alt="X for Hot streak" class="big-streak-img">';
  bigFlamesDOM.innerHTML = "";
  bigXDOM.innerHTML = "";

  for ( var i = 1 ; i <= flames && i <=3 ; i++ ){
      bigFlamesDOM.innerHTML += flameImgs;
  }

  for ( var i = 1 ; i <= xs && i <=3 ; i++ ){
      bigXDOM.innerHTML += xImgs;
  }
}



function setNumberOfPlayers(){
  numberOfPlayers = parseFloat(document.getElementById('number-of-players').value);
  hide(howManyPlayersDiv);
  show(nameFormDiv);
  document.getElementById('number-selected').textContent = numberOfPlayers;

  //Create input field for each player name.
  for ( var i = 1 ; i <= numberOfPlayers ; i++ ){
    var inputElement = document.createElement('input');
    var liElement = document.createElement('li');
    inputElement.setAttribute( 'type' , 'text' );
    inputElement.setAttribute ( 'id' , 'name-input-' + i );
    inputElement.setAttribute ( 'class' , 'name-input');
    inputElement.setAttribute ( 'placeholder' , 'Enter a name for player ' + i );
    liElement.appendChild(inputElement);
    nameInputArray[i] = inputElement;
    nameList.appendChild(liElement);
    inputElement.addEventListener( 'keypress' , function(event){
      if ( event.which === 13 ) {
        var i = parseInt(this.id.charAt(this.id.length -1));
        if( i < numberOfPlayers){
          document.getElementById( 'name-input-' + (i+1)).focus();
        } else {
          document.getElementById('name-form-ok').focus();
        }
      }
    } );
  }

}



function startGame(){
  //Make sure all fields are filled.
  for ( var i = 1 ; i <= numberOfPlayers ; i++ ){
    if ( nameInputArray[i].value == false){
      show(error);
      return;
    }

    if ( nameInputArray[i].value.length > 11){
      nameInputArray[i].classList.add('name-too-long');
      nameInputArray[i].value = "Name was too long. Try 11 characters or less";
      nameInputArray[i].focus();
      nameInputArray[i].setSelectionRange(0, nameInputArray[i].value.length);
      errorNameInput = nameInputArray[i];
      errorNameInput.addEventListener ( 'click', function(){
        errorNameInput.setSelectionRange(0, nameInputArray[i].value.length);
        errorNameInput.classList.remove('name-too-long');
      });
      errorNameInput.addEventListener ( 'keypress', function(){
        errorNameInput.classList.remove('name-too-long');
      });
      return;
    }
  }


  for ( var i = 1 ; i <= numberOfPlayers ; i++ ){
    //create object for each player.
    var name = nameInputArray[i].value;
    players["player" + i] = {
      name: name,
      score: 0,
      html: {},
      flames: 0,
      x: 0,
    }

    //Create a Player box for each player.
    var playerBox= document.createElement('div');
    playerBox.classList.add('player_box');
    playerBoxContainer.appendChild(playerBox);

    var playerName = document.createElement('div');
    playerName.textContent = players["player" + i].name;
    playerName.classList.add('player_names');
    playerBox.appendChild(playerName);

    var playerScoreHeading = document.createElement('div');
    playerScoreHeading.classList.add('player_score_heading');
    playerScoreHeading.textContent = "Player Score:";
    playerBox.appendChild(playerScoreHeading);

    var playerScoreDiv = document.createElement('div');
    playerScoreDiv.classList.add('player_score');
    playerBox.appendChild(playerScoreDiv);

    var playerScoreNumber = document.createElement('span');
    playerScoreNumber.classList.add('player_score_number');
    playerScoreNumber.textContent = players["player" + i].score;

    playerScoreNumber.id = "player_score_number_" + i;

    playerScoreDiv.appendChild(playerScoreNumber);

    playerScoreDiv.appendChild(document.createTextNode('pts'));

    //Set default gray flames:
    var smallFlames = makeNode('div', 'small_flames', playerBox);
    smallFlames.innerHTML =
      '<img src="img/flame_icon_gray.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/flame_icon_gray.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/flame_icon_gray.png" alt="Flame for Hot streak" class="small-streak-img">';

    //SET DEFAULT FOR COLORED RED ACTIVE flames
    var insideSmallFlame = makeNode('div', 'inside-small-flame',smallFlames);

    // insideSmallFlame.innerHTML =
    //   '<img src="img/flame_icon.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/flame_icon.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/flame_icon.png" alt="Flame for Hot streak" class="small-streak-img">';

    //SET DEFAULT FOR gray  Xs
    var smallXs = makeNode( 'div','small_xs', playerBox);

    smallXs.innerHTML =
      '<img src="img/x_icon_gray.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/x_icon_gray.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/x_icon_gray.png" alt="Flame for Hot streak" class="small-streak-img">';

    var insideSmallXs = makeNode( 'div','inside-small-x', smallXs);

    // insideSmallXs.innerHTML =
    //   '<img src="img/x_icon.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/x_icon.png" alt="Flame for Hot streak" class="small-streak-img"><img src="img/x_icon.png" alt="Flame for Hot streak" class="small-streak-img">';

    //inserting DOM elements inside players object for later access

    players["player" + i].html.playerBox =playerBox; insideSmallXs;
    players["player" + i].html.score = playerScoreNumber;
    players["player" + i].html.flames = insideSmallFlame;
    players["player" + i].html.x = insideSmallXs;

    // players["player" + i].html.score = document.querySelector('.player_score_number');
    // players["player" + i].html.score = playerScoreNumber;
    // players["player" + i].html.score.textContent = 34;
  }

  hide(nameFormDiv);
  hide(error);
  hide(lowOpacityScreenDiv);
  hide(popupBoxDiv);
  gameOn = true;
  activePlayer = players.player1;
  activePlayer.html.playerBox.classList.add('active_player_box');
  activePlayerNameNode.textContent = activePlayer.name;


}

function gameMessage( heading, textInput ){
  gameMessageNeeded = true;
  show(lowOpacityScreenDiv);
  show(popupBoxDiv);
  show(gameMessageDiv);
  gameMessageHeading.textContent = heading;
  gameMessageText.textContent = textInput;
  function closeMessage(){
    hide(popupBoxDiv);
    hide(gameMessageDiv);
    hide(lowOpacityScreenDiv);
  }
  gameMessageOK.addEventListener( 'click' , closeMessage);
}

function announceNextPlayer(name){

  function showName(){
    turnAnnouncementName.textContent = name;
    show(turnAnnouncement);
    show(lowOpacityScreenDiv);

    setTimeout( function(){hide(turnAnnouncement);hide(lowOpacityScreenDiv)}, 2500);

  }

  if (  gameMessageNeeded === false ){
    showName();
  } else {
    gameMessageOK.addEventListener( 'click', showName );
  }

  gameMessageNeeded = false;

}



// ----------------------------------- CODE STARTS RUNNING HERE -----------------------------------

initializeGame();
for ( var i = 1; i <= 6; i++){
  var diceUrl = 'img/dices/'+i+'dice.png';
  diceImgs[i]= diceUrl;
}

document.getElementById('number-of-players-ok').addEventListener( 'click' , setNumberOfPlayers );
document.getElementById('name-form-ok').addEventListener( 'click' , startGame );
function changeScore(){players.player1.html.score.innerHTML = 30;}

holdPointsButton.addEventListener( 'click', addToPlayerScore);

rollDiceButton.addEventListener( 'mousedown' , rollDice);
  // rollDiceButton.addEventListener( 'mouseup' , rollingDiceStop);
  // rollDiceButton.addEventListener( 'mouseleave' , rollingDiceStop);
