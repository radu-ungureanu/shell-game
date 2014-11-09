var cups = [];
var ball;
var ballPosition;
var layer;

$(document).ready(function () {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 600,
        height: 300
    });
    layer = new Kinetic.Layer();

    // create objects
    for (var i = 0; i < 3; i++) {
        var cup = new Kinetic.Rect({
            x: 200 * i,
            y: 200,
            width: 100,
            height: 50,
            fill: '#00D2FF',
            stroke: 'black',
            strokeWidth: 4
        });
        cups.push(cup);
    }
    ballPosition = getRandomIndex();
    var ball = new Kinetic.Circle({
        x: getBallPositionByCupIndex(ballPosition),
        y: 250,
        radius: 15,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    });

    // add objects to scene
    _(cups).each(function (cup) {
        layer.add(cup);
    });
    layer.add(ball);

    stage.add(layer);

    swapCups(0, 1, function () { swapCups(1, 2); });
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
    return Math.floor((Math.random() * max) + min);
}

function getRandomIndex() {
    return getRandomNumber(0, cups.length);
}

function getBallPositionByCupIndex(cupIndex) {
    var selectedCup = cups[cupIndex];
    return selectedCup.getPosition().x + (selectedCup.getWidth() / 2);
}



