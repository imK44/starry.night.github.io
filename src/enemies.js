export function SAW(x,y,scale,left_end,right_end,offset)
{
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.left_end = left_end;
    this.right_end = right_end;
    this.offset = offset;
    this.speed = random(0.5,1);
    
    this.pointy = {};
    this.pointy.outer = [];
    this.pointy.inner = [];
    this.pointy.in_inner = [];
    
    var dir = 1;
    this.create_pointy = function(degree,points,x_value,y_value)
    {
        var tem_array = [];
        for(var i = 0; i<points; i ++)
        {
            var add_point = createVector(x_value* this.scale,y_value* this.scale);
            add_point.rotate(D2R(degree * i));
            tem_array.push(add_point);
        }
        
        return tem_array;
    }
    
    this.create_pointy_main = function()
    {
        this.pointy.outer = this.create_pointy(360/10,10,0,-100);
        this.pointy.inner = this.create_pointy(360/10,10,0,-50);
        this.pointy.in_inner = this.create_pointy(360/20,20,0,-20);
    }
    
    this.rotate_pointy_main = function() // in draw function rotate
    { 
        
        this.rotate_pointy(this.pointy.outer, 5);
        this.rotate_pointy(this.pointy.inner, 5);
        this.rotate_pointy(this.pointy.in_inner,5);
    }
    
    this.move_left_right = function()
    {
        if(this.x - 100 * this.scale - 30 * this.scale <=  this.left_end || this.x + 100 * this.scale >= this.right_end)
        {
            dir *= -1;
        }
        this.x +=  dir;
    }
    
    this.draw_in_inner = function()// inner draw
    {
        var in_inner = this.pointy.in_inner;
        
        noStroke();
        push();
        translate(this.x+ this.offset, this.y+this.offset);
        
        fill(map(in_inner[0].x, -10,10, 100,200),0,0);
        beginShape();
        for(var i = 0; i < in_inner.length; i++)
        {
            vertex(in_inner[i].x, in_inner[i].y);
        }
        endShape();
        fill(50);
        ellipse(0,0, 25* this.scale,25* this.scale);
        pop();
    }
    
    
    this.draw_main = function()// main draw
    {
        var inner = this.pointy.inner;
        var outer = this.pointy.outer;
        
        push();
        translate(this.x+this.offset, this.y+this.offset);
        
        stroke(50);
        strokeWeight(2);
        
        for(var i =0; i < inner.length; i++)
        { 
            fill(map(outer[i].x, -100,100, 50,200),0,0);
            if(i+1 >= inner.length)
            {
                var neX = 0;
            }
            else
            {
                var neX = i + 1;
            }
            if(i+6 >= 10 )
            {
                var iniA = (i+6) - 10;
            }
            else
            {
                var iniA = i + 6;
            }
            
            if(i <= 1)
            {
                var endA = i + 8;
            }
            else
            {
                var endA = i-2;
            }
            curve(outer[endA].x,outer[endA].y,
                  outer[i].x,outer[i].y,
                  inner[neX].x,inner[neX].y,
                  outer[iniA].x,outer[iniA].y);
        }
        
        noStroke();
        beginShape();
        fill(map(outer[0].x, -100,100, 100,200));
        stroke(map(outer[0].y, -100,100, 100,200));
        strokeWeight(3);
        curveVertex(outer[9].x, outer[9].y);
        for(var i =0; i< inner.length; i++)
        {
            curveVertex(inner[i].x, inner[i].y);
            curveVertex(outer[i].x, outer[i].y);
        }
        curveVertex(inner[0].x, inner[0].y);
        curveVertex(outer[9].x, outer[9].y);
        endShape();
        pop();

    }
    
    
    this.rotate_pointy = function(ArraY, Speed)
    {
        push();
        for(var i =0; i< ArraY.length; i++)
        {
            ArraY[i].rotate(D2R(Speed));
        }
        pop();
    }
    

}

export function SPARK(x,y,xSpeed, ySpeed)
{
    this.x = x;
    this.y = y;
    this.xS = xSpeed;
    this.ys = ySpeed;
    
    this.create_spark = function(color_to_fill)
    {
        push();
        stroke(color_to_fill);
        fill(color_to_fill);
        ellipse(this.x, this.y,5,5);
        pop();
    }
    
    this.update = function()
    {
        this.x += this.xS;
        this.y += this.ys;
    }

}
    

    
