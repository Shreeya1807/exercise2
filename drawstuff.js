/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);

    // Four colors
    var topColor = new Color(255,105,180,255);      // pink
    var leftColor = new Color(0,255,255,255);       // cyan
    var rightColor = new Color(255,0,255,255);      // magenta
    var centerColor = new Color(255,255,0,255);     // yellow

    // Triangle coordinates
    var topX = 125, topY = 40;
    var leftX = 50, leftY = 160;
    var rightX = 200, rightY = 160;

    // Center point and center color
    var centerX = 125;
    var centerY = 100;

    // Draw triangle one horizontal scanline at a time
    for (var y = topY; y <= leftY; y++) {

        var t = (y - topY) / (leftY - topY);

        // Find the left and right boundaries of the triangle
        var xLeft = topX + (leftX - topX) * t;
        var xRight = topX + (rightX - topX) * t;

        var xStart = Math.round(xLeft);
        var xEnd = Math.round(xRight);

        // Determine colors on the left and right edges.
        // Above the center: interpolate from pink to yellow.
        // Below the center: interpolate from cyan/yellow to
        // yellow/magenta.

        if (y <= centerY) {

            // Amount from top to center
            var tc = (y - topY) / (centerY - topY);

            // Left edge: pink -> yellow
            var leftEdgeColor = topColor.clone();
            leftEdgeColor.add(
                centerColor.clone().subtract(topColor).scale(tc)
            );

            // Right edge: pink -> yellow
            var rightEdgeColor = topColor.clone();
            rightEdgeColor.add(
                centerColor.clone().subtract(topColor).scale(tc)
            );

        } else {

            // Amount from center to bottom
            var tc = (y - centerY) / (leftY - centerY);

            // Left edge: yellow -> cyan
            var leftEdgeColor = centerColor.clone();
            leftEdgeColor.add(
                leftColor.clone().subtract(centerColor).scale(tc)
            );

            // Right edge: yellow -> magenta
            var rightEdgeColor = centerColor.clone();
            rightEdgeColor.add(
                rightColor.clone().subtract(centerColor).scale(tc)
            );
        }

        // Horizontal interpolation
        var horizontalDelta = 1 / (xEnd - xStart || 1);

        var currentColor = leftEdgeColor.clone();

        var colorDelta = rightEdgeColor.clone()
            .subtract(leftEdgeColor)
            .scale(horizontalDelta);

        // Draw pixels across the scanline
        for (var x = xStart; x <= xEnd; x++) {
            drawPixel(imagedata, x, y, currentColor);
            currentColor.add(colorDelta);
        }
    }

    // Display the triangle
    context.putImageData(imagedata, 0, 0);
}

