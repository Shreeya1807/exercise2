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


    // Triangle vertices

    var topX = 256, topY = 60;
    var leftX = 80, leftY = 420;
    var rightX = 432, rightY = 420;


    // Fourth color point in the center

    var centerX = 256, centerY = 260;


    // Helper function for barycentric color interpolation
    function interpolateTriangle(
        px, py,
        x1, y1, c1,
        x2, y2, c2,
        x3, y3, c3
    ) {

        var denominator =
            ((y2 - y3) * (x1 - x3) +
             (x3 - x2) * (y1 - y3));

        if (denominator == 0)
            return null;


        var a =
            ((y2 - y3) * (px - x3) +
             (x3 - x2) * (py - y3)) / denominator;

        var b =
            ((y3 - y1) * (px - x3) +
             (x1 - x3) * (py - y3)) / denominator;

        var c = 1 - a - b;


        // Point is outside this triangle
        if (a < 0 || b < 0 || c < 0)
            return null;


        // Interpolate RGB values
        var color = new Color();

        color.r = a * c1.r + b * c2.r + c * c3.r;
        color.g = a * c1.g + b * c2.g + c * c3.g;
        color.b = a * c1.b + b * c2.b + c * c3.b;
        color.a = 255;

        return color;
    }


    // Go through every pixel in the canvas

    for (var y = topY; y <= leftY; y++) {

        for (var x = leftX; x <= rightX; x++) {

            var color = null;


            // Triangle 1:
            // TOP (pink) -> LEFT (cyan) -> CENTER (yellow)

            color = interpolateTriangle(
                x, y,
                topX, topY, topColor,
                leftX, leftY, leftColor,
                centerX, centerY, centerColor
            );


            // Triangle 2:
            // TOP (pink) -> CENTER (yellow) -> RIGHT (magenta)

            if (color == null) {

                color = interpolateTriangle(
                    x, y,
                    topX, topY, topColor,
                    centerX, centerY, centerColor,
                    rightX, rightY, rightColor
                );
            }


            // Triangle 3:
            // LEFT (cyan) -> CENTER (yellow) -> RIGHT (magenta)

            if (color == null) {

                color = interpolateTriangle(
                    x, y,
                    leftX, leftY, leftColor,
                    centerX, centerY, centerColor,
                    rightX, rightY, rightColor
                );
            }


            // Draw the pixel if it belongs to the triangle

            if (color != null) {
                drawPixel(imagedata, x, y, color);
            }
        }
    }


    // Display the triangle

    context.putImageData(imagedata, 0, 0);
}
