var cups = [];
var ball;
var ballPosition;

$(document).ready(function () {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 600,
        height: 300
    });
    var layer = new Kinetic.Layer();

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
    var ball = new Kinetic.Circle({
        x: stage.getWidth() / 2,
        y: 400,
        radius: 15,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
    });
    ballPosition = 0;

    _(cups).each(function (cup) {
        layer.add(cup);
    });
    layer.add(ball);

    stage.add(layer);

    //var amplitude = 150;
    //var period = 2000;
    //// in ms
    //var centerX = stage.width() / 2;

    //var anim = new Kinetic.Animation(function (frame) {
    //    var cup = cups[0];
    //    var newX = amplitude * Math.sin(frame.time * 2 * Math.PI / period) + centerX;
    //    cup.setX(newX);
    //}, layer);

    //anim.start();
});



