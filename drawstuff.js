/* classes */ 

// Color constructor
class Color {
    
    // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || 
                (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; 
                this.g = g; 
                this.b = b; 
                this.a = a; 
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || 
                (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; 
                this.g = g; 
                this.b = b; 
                this.a = a; 
                return(this);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; 
                this.g += c.g; 
                this.b += c.b; 
                this.a += c.a;
                return(this);
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; 
                this.g -= c.g; 
                this.b -= c.b; 
                this.a -= c.a;
                return(this);
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; 
                this.g *= s; 
                this.b *= s; 
                this.a *= s; 
                return(this);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; 
                this.g = c.g; 
                this.b = c.b; 
                this.a = c.a;
                return(this);
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    }

    // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }
}


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || 
                 (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;

            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } 
        else 
            throw "drawpixel color is not a Color";
    }
    catch(e) {
        console.log(e);
    }
}


/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");

    var w = context.canvas.width;
    var h = context.canvas.height;

    var imagedata = context.createImageData(w,h);


    // FOUR COLORS

    var topColor = new Color(255,105,180,255);      // pink
    var leftColor = new Color(0,255,255,255);       // cyan
    var rightColor = new Color(255,0,255,255);      // magenta
    var centerColor = new Color(255,255,0,255);     // yellow


    // Triangle coordinates

    var topX = 256;
    var topY = 60;

    var leftX = 80;
    var leftY = 420;

    var rightX = 432;
    var rightY = 420;


    // Yellow center position

    var centerX = 256;
    var centerY = 250;


    // Draw triangle one horizontal scanline at a time

    for (var y = topY; y <= leftY; y++) {

        // How far down the triangle we are
        var t = (y - topY) / (leftY - topY);


        // Find left and right boundaries
        var xLeft = topX + (leftX - topX) * t;
        var xRight = topX + (rightX - topX) * t;

        var xStart = Math.round(xLeft);
        var xEnd = Math.round(xRight);


        // Interpolate the normal triangle colors
        // along the left and right edges.

        var leftEdgeColor = topColor.clone();

        leftEdgeColor.add(
            leftColor.clone()
                .subtract(topColor)
                .scale(t)
        );


        var rightEdgeColor = topColor.clone();

        rightEdgeColor.add(
            rightColor.clone()
                .subtract(topColor)
                .scale(t)
        );


        // Horizontal interpolation

        var horizontalDelta = 1 / (xEnd - xStart || 1);

        var currentColor = leftEdgeColor.clone();

        var colorDelta = rightEdgeColor.clone()
            .subtract(leftEdgeColor)
            .scale(horizontalDelta);


        // Draw pixels across the scanline

        for (var x = xStart; x <= xEnd; x++) {

            // Start with normal interpolated color
            var pixelColor = currentColor.clone();


            // Calculate distance from yellow center

            var dx = x - centerX;
            var dy = y - centerY;

            var distance = Math.sqrt(dx * dx + dy * dy);


            // Size of yellow region

            var yellowRadius = 80;


            // Yellow influence
            var yellowInfluence = 1 - (distance / yellowRadius);

            if (yellowInfluence < 0) {
                yellowInfluence = 0;
            }


            // Make transition smooth

            yellowInfluence = yellowInfluence * yellowInfluence;


            // Blend normal color toward yellow

            pixelColor.scale(1 - yellowInfluence);

            pixelColor.add(
                centerColor.clone()
                    .scale(yellowInfluence)
            );


            // Draw pixel

            drawPixel(
                imagedata,
                x,
                y,
                pixelColor
            );


            // Move to next color

            currentColor.add(colorDelta);
        }
    }


    // Display the triangle

    context.putImageData(imagedata, 0, 0);
}
