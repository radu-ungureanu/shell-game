var cups = [];
var ball;
var ballPosition;
var layer;
var noOfSwapsMade = 0;
var maxNoOfSwaps = 1;
var debugEnabled = true;

$(document).ready(function () {
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
            var clickedIndex = cups.indexOf(e.target);

            ball.setX(50 + 200 * ballPosition + cups[0].getWidth() / 2);
            layer.add(ball);
            var anim = new Kinetic.Animation(function (frame) {
                _(cups).each(function (cup) {
                    var newY = cup.getPosition().y - 10;
                    cup.setY(newY);
                });
                if (cups[0].getPosition().y <= 150) {
                    anim.stop();
                }
            }, layer);
            anim.start();
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

function shuffle() {
    var anim = new Kinetic.Animation(function (frame) {
        _(cups).each(function (cup) {
            var newY = cup.getPosition().y + 10;
            cup.setY(newY);
        });
        var maxYWithHeight = getOffsetYWithHeight(ball);
        var currentYWithHeight = getOffsetYWithHeight(cups[0]); 
        if (currentYWithHeight >= maxYWithHeight) {
            anim.stop();
            hideBall();
            swapRandomCups();
        }
    }, layer);
    anim.start();
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



