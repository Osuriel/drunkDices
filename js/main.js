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

var numberOfPlayers, players, winningScore, activePlayer, diceResult, currentScore, playerTurn, gameOn;

players = {};
winningScore = 250;
playerTurn = 1;
currentScore = 0;
gameon = false;


var nameInputArray = [];

//DOM elements
var lowOpacityScreenDiv= document.getElementById('low-opacity-screen');
var popupBoxDiv = document.getElementById('popup-box');
var howManyPlayersDiv = document.getElementById('how-many-players');
var nameFormDiv = document.getElementById('name-form');
var error = document.querySelector('.error');


//functions:

function hide(element){
  element.classList.add('hidden');
}

function show(element){
  element.classList.remove('hidden');
}


function rollDice(){
  diceResult = Math.floor(Math.random() * 6) + 1;
  addToCurrentScore();
}

function addToCurrentScore(){
  if ( diceResult === 1 ){
    currentScore = 0;
    alert('You got a 1! Take a Shot and your turn is over');
    switchTurn();
  } else {
    currentScore += diceResult;
  }
  if( (currentScore + activePlayer.score ) >= winningScore ){
    alert(activePlayer.name + ' just WON the game! Every other player has to take a shot, the person in last place takes 2');
  }
}

function addToPlayerScore(){
  activePlayer.score += currentScore;
  switchTurn();
}

function switchTurn(){
  currentScore = 0;
  if ( playerTurn === numberOfPlayers ){
    playerTurn = 1;
  } else {
    playerTurn++;
  }
  activePlayer = players['player' + playerTurn];
  alert(activePlayer.name + "It is your turn now.");
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
    document.getElementById('name-list').appendChild(liElement);

  }

}

function startGame(){
  //Make sure all fields are filled.
  for ( var i = 1 ; i <= numberOfPlayers ; i++ ){
    if ( nameInputArray[i].value == false){
      show(error);
      return;
    }
  }


  for ( var i = 1 ; i <= numberOfPlayers ; i++ ){
    //create object for each player.
    var name = nameInputArray[i].value;
    players["player" + i] = {
      name: name,
      score: 0,
      fireStreak: 0,
      xStreak: 0,
      html: {}
    }

    //Create a Player box for each player.
    var playerBox= document.createElement('div');
    playerBox.classList.add('player_box');
    document.getElementById('player-box-container').appendChild(playerBox);

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

    players["player" + i].html.score = playerScoreNumber;

    playerScoreDiv.appendChild(playerScoreNumber);
    playerScoreDiv.innerHTML += "pts";



    //inserting DOM elements inside players object for later access
    // players["player" + i].html.score = document.querySelector('.player_score_number');
    // players["player" + i].html.score = playerScoreNumber;
    // players["player" + i].html.score.textContent = 34;
  }

  hide(lowOpacityScreenDiv);
  hide(popupBoxDiv);
  gameOn = true;
  activePlayer = players.player1;

}


// ----------------------------------- CODE STARTS RUNNING HERE -----------------------------------


document.getElementById('number-of-players-ok').addEventListener( 'click' , setNumberOfPlayers );
document.getElementById('name-form-ok').addEventListener( 'click' , startGame );
