var cups = [];
var ball;
var ballPosition;
var layer;
var noOfSwapsMade = 0;
var maxNoOfSwaps = 10;
var debugEnabled = false;
var isShuffling = false;
var isBetting = false;

var betAmount, cashAmount = 100;

$(document).ready(function () {

    // Initial cash amount
    $("#cash").text(cashAmount);

    var stage = new Kinetic.Stage({
        container: 'container',
        width: 600,
        height: 300
    });
    layer = new Kinetic.Layer();

    if (debugEnabled) {
        var border = new Kinetic.Rect({
            width: stage.getWidth(),
            height: stage.getHeight(),
            stroke: 'black',
            strokeWidth: 4, //Border Size in Pixels
            fill: '#00FF00' //Background Color
        });
        layer.add(border);
    }

    // create objects
    for (var i = 0; i < 3; i++) {
        var cup = new Kinetic.Rect({
            x: 50 + 200 * i,
            y: 150,
            width: 100,
            height: 50,
            fill: '#00D2FF',
            stroke: 'black',
            strokeWidth: 4
        });
        cup.on('click', function (e) {
            var clickedCupIndex = cups.indexOf(e.target);
            raiseCups(clickedCupIndex, function () { checkWin(clickedCupIndex) });
        });
        cups.push(cup);
    }

    ballPosition = getRandomIndex();
    ball = new Kinetic.Circle({
        x: getBallPositionByCupIndex(ballPosition),
        y: 250,
        radius: 15,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    });

    if (debugEnabled) {
        cups[ballPosition].fill('#C3C3C3');
    }

    // add objects to scene
    layer.add(ball);
    _(cups).each(function (cup) {
        layer.add(cup);
    });
    stage.add(layer);
});

function raiseCups(selectedCupIndex, callback) {
    ball.setX(50 + 200 * ballPosition + cups[0].getWidth() / 2);
    layer.add(ball);

    var selectedCup = cups[selectedCupIndex];
    // first - raise clicked cup
    var anim = new Kinetic.Animation(function (frame) {
        var newY = selectedCup.getPosition().y - 10;
        selectedCup.setY(newY);

        if (selectedCup.getPosition().y <= 150) {
            anim.stop();
        }
    }, layer);
    anim.start();

    setTimeout(function () {
        raiseOtherCups(selectedCupIndex, callback);
    }, 200);
}

function raiseOtherCups(selectedCupIndex, callback  ) {
    var otherIndexes = getOtherIndexes(selectedCupIndex);
    var otherCups = [cups[otherIndexes[0]], cups[otherIndexes[1]]];

    var anim = new Kinetic.Animation(function (frame) {
        _(otherCups).each(function (cup) {
            var newY = cup.getPosition().y - 10;
            cup.setY(newY);
        });
        if (otherCups[0].getPosition().y <= 150) {
            anim.stop();
            if (callback)
                callback();
        }
    }, layer);
    anim.start();    
}

function checkWin(clickedCupIndex) {
    isBetting = false;
    if (ballPosition == clickedCupIndex) {
        $("#output").text("You won " + 2 * betAmount + "!");
        cashAmount += 2 * betAmount;
        $("#cash").text(cashAmount);
        return;
    }

    $("#output").text("You lost!");
}

function swapCups(left, right, callback) {
    var leftCup = cups[left];
    var rightCup = cups[right];

    cups[left] = rightCup;
    cups[right] = leftCup;

    var leftX = leftCup.getPosition().x;
    var rightX = rightCup.getPosition().x;

    var anim = new Kinetic.Animation(function (frame) {
        var newLeftX = leftCup.getPosition().x + 10;
        leftCup.setX(newLeftX);

        var newRightX = rightCup.getPosition().x - 10;
        rightCup.setX(newRightX);

        if (newLeftX >= rightX) {
            anim.stop();
            if (callback)
                callback();
        }
    }, layer);
    anim.start();
}

function lowerCups(callback) {
    var anim = new Kinetic.Animation(function (frame) {
        _(cups).each(function (cup) {
            var newY = cup.getPosition().y + 10;
            cup.setY(newY);
        });
        var maxYWithHeight = getOffsetYWithHeight(ball);
        var currentYWithHeight = getOffsetYWithHeight(cups[0]);
        if (currentYWithHeight >= maxYWithHeight) {
            anim.stop();
            if (callback)
                callback();
        }
    }, layer);
    anim.start();
}

function shuffle(callback) {
    lowerCups(function () {
        hideBall();
        swapRandomCups();
    });
}

function placeBet() {
    if (isBetting)
        return;

    $("#error").text("");
    if (!parseInput())
        return;

    isBetting = true;
    cashAmount -= betAmount;
    $("#cash").text(cashAmount);
    shuffle();
}

function parseInput() {
    var bet = $("#bet").val();
    if (!bet) {
        $("#error").text("Input can't be empty");
        return false;
    }

    if (isNaN(bet)) {
        $("#error").text("Input is not a number");
        return false;
    }

    betAmount = parseInt(bet);
    if (betAmount < 0) {
        $("#error").text("Bet must be positive");
        return false;
    }

    if (betAmount < 1) {
        $("#error").text("You cannot play for free");
        return false;
    }

    if (betAmount > cashAmount) {
        $("#error").text("You don't have enough cash");
        return false;
    }

    return true;
}

function getOffsetYWithHeight(kineticObject) {
    return kineticObject.getPosition().y + kineticObject.getHeight()
}

function hideBall() {
    ball.remove();
    layer.draw();
}

function swapRandomCups() {
    if (noOfSwapsMade >= maxNoOfSwaps) {
        noOfSwapsMade = 0;
        return;
    }
    
    noOfSwapsMade++;
    var oldBallPosition = ballPosition;
    var otherIndexes = getOtherIndexes(oldBallPosition);
    ballPosition = getRandomBetweenTwoNumbers(otherIndexes);
    if (oldBallPosition < ballPosition)
        swapCups(oldBallPosition, ballPosition, swapRandomCups);
    else
        swapCups(ballPosition, oldBallPosition, swapRandomCups);
}

function getOtherIndexes(index) {
    if (index == 0)
        return [1, 2];
    if (index == 1)
        return [0, 2];
    return [0, 1];
}

function getRandomNumber(min, max) {
    return Math.floor((Math.random() * (max + 1)) + min);
}

function getRandomIndex() {
    return getRandomNumber(0, cups.length);
}

function getRandomBetweenTwoNumbers(values) {
    var random = getRandomNumber(0, 1);
    if (random == 0)
        return values[0];
    return values[1];
}

function getBallPositionByCupIndex(cupIndex) {
    var selectedCup = cups[cupIndex];
    return selectedCup.getPosition().x + (selectedCup.getWidth() / 2);
}



