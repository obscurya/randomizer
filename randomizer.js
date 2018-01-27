var text = document.getElementById('text'),
    canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d'),
    options = [];

// text.value = 'option 1        \n  option 2';

function color(red, green, blue, alpha) {
    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha / 255 + ')';
}

function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}

function randomDouble(min, max) {
    return Math.random() * (max - min) + min;
}

function randomColor(alpha, min) {
    var rgb = [];

    for (var i = 0; i < 3; i++) {
        rgb[i] = (min) ? random(min, 255) : random(0, 255);
    }

    return color(rgb[0], rgb[1], rgb[2], alpha);
}

class Option {
    constructor(text, angle1, angle2, radius, chw, chh) {
        this.text = text;
        this.angle1 = angle1;
        this.angle2 = angle2;
        this.color = randomColor(255, 55);

        var angle = (this.angle1 + this.angle2) / 2;
        this.x = chw + radius * Math.cos(angle);
        this.y = chh + radius * Math.sin(angle);
    }

    draw(chw, chh, radius, length) {
        c.fillStyle = this.color;
        c.strokeStyle = color(0, 0, 0, 255);
        c.lineWidth = 2;

        c.beginPath();
        if (length > 1) c.moveTo(chw, chh);
        c.arc(chw, chh, radius, this.angle1, this.angle2);
        c.closePath();
        c.fill();
        c.stroke();
    }

    drawText() {
        var fontSize = 14;

        c.font = fontSize + 'px sans-serif';

        var width = c.measureText(this.text).width + 20;

        c.fillStyle = color(255, 255, 255, 255);
        c.strokeStyle = color(0, 0, 0, 255);
        c.lineWidth = 2;
        c.fillRect(Math.floor(this.x - width / 2), Math.floor(this.y - fontSize), Math.floor(width), Math.floor(fontSize * 2));
        c.strokeRect(Math.floor(this.x - width / 2), Math.floor(this.y - fontSize), Math.floor(width), Math.floor(fontSize * 2));

        c.fillStyle = color(0, 0, 0, 255);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(this.text, this.x, this.y);
    }
}

class Arrow {
    constructor(width, height, radius) {
        this.angle = 0;
        this.radius = Math.floor(radius / 4);
        this.cx = width / 2;
        this.cy = height / 2;
        this.size = this.radius * 2;
        this.xx = this.cx
        this.coordinates(this.angle);
        this.speed = randomDouble(0.3, 1.0);
        this.slowdown = randomDouble(0.001, 0.01);
        this.color = color(255, 255, 255, 255);
        this.finish = false;
    }

    coordinates(angle) {
        this.x = this.cx + this.size * Math.cos(angle);
        this.y = this.cy + this.size * Math.sin(angle);
    }

    draw() {
        c.fillStyle = color(0, 0, 0, 255);

        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - this.size * Math.cos(this.angle - Math.PI / 8), this.y - this.size * Math.sin(this.angle - Math.PI / 8));
        c.lineTo(this.x - this.size * Math.cos(this.angle + Math.PI / 8), this.y - this.size * Math.sin(this.angle + Math.PI / 8));
        c.closePath();
        c.fill();

        c.fillStyle = this.color;
        c.strokeStyle = color(0, 0, 0, 255);
        c.lineWidth = Math.floor(this.radius / 4);

        c.beginPath();
        c.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
        c.closePath();
        c.fill();
        c.stroke();
    }

    update(array) {
        if (!this.finish) {
            if (this.speed > 0) {
                if (this.angle >= Math.PI * 2) {
                    this.angle = this.speed;
                } else {
                    this.angle += this.speed;
                }

                for (var i = 0; i < array.length; i++) {
                    if (this.angle >= array[i].angle1 && this.angle <= array[i].angle2) {
                        this.color = array[i].color;
                        break;
                    }
                }

                this.coordinates(this.angle);
                this.speed -= this.slowdown;
            } else {
                this.finish = true;
            }
        }
    }
}

function randomize() {
    options = [];

    canvas.style.display = 'block';
    canvas.width = 400;
    canvas.height = canvas.width;

    var chw = canvas.width / 2,
        chh = canvas.height / 2;

    function clear() {
        c.fillStyle = color(255, 255, 255, 255);
        c.clearRect(0, 0, canvas.width, canvas.height);
        c.fillRect(0, 0, canvas.width, canvas.height);
    }

    var textSplit = text.value.split(/\n/g),
        step = 2 * Math.PI / textSplit.length,
        angle = 0,
        radius = Math.floor(canvas.width / 3);

    for (var i = 0; i < textSplit.length; i++) {
        options.push(new Option(textSplit[i].trim(), angle, angle + step, radius, chw, chh));
        angle += step;
    }

    var arrow = new Arrow(canvas.width, canvas.height, radius);

    function draw() {
        clear();

        for (var i = 0; i < options.length; i++) {
            options[i].draw(chw, chh, radius, options.length);
        }

        for (var i = 0; i < options.length; i++) {
            options[i].drawText();
        }

        arrow.draw();
        arrow.update(options);

        if (!arrow.finish) requestAnimationFrame(draw);
    }

    draw();
}

// randomize();
