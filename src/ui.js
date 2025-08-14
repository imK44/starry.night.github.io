export function drawArrow(x,y,ind,start,end,t_colour)
{
    var centerPointX = ((19 * 5) + (12*5)) * ind;
    var centerPointY = (12*5) * ind;

    var startPointX = 0;
    var startPointY = 0;

    var endPointX = 0;
    var endPointY = 24 * 5 * ind;

    var biggest_D =dist(centerPointX,centerPointY,startPointX,startPointY);

    for(var i = 0; i< 11; i++)
    {
        for(var g = 0; g< 7; g++)
        {
            if(i < 6)
            {
               var seq = i*7;
            }
            else
            {
                var seq = (10 - i)*7;
            }
            var currentX = ((g*5) + seq) * ind;
            var currentY = (i*5)*ind;
            var currentD = dist(centerPointX,centerPointY,currentX,currentY);
            var size =map(currentD,1,biggest_D,10,5)

           if(t_colour == 'blue')
           {
               fill(0,map(pointer.x,start,end,50,255),map(pointer.x,start,end,100,190));
           }
            if(t_colour == 'green')
            {
                fill(map(pointer.x,start,end,100,190),map(pointer.x,start,end,50,255),0);
            }
            if(t_colour == 'red')
            {
                fill(map(pointer.x,start,end,50,255),0,map(pointer.x,start,end,100,190));
            }
            push();

            translate(x,y);
            noStroke();
            ellipse(((g * 8)+ seq)*ind ,(i * 8)*ind,size*ind);
            pop();

        }

    }

}

export function drawHearts(lives)
{
    for(var i =0; i < lives; i++)
    {
        if(i == 0)
        {
            var currentHeart = 1;
        }
        else
        {
            var currentHeart = 0;
        }

        drawHeart( 1000-(lives*50) + (i*50), 20, 0.2, currentHeart);
    }
}

function drawHeart(x_pos,y_pos,heart_scale, t_heart)
{
    if(t_heart == 1)
    {
        var life_reduce = endurance_time;
    }
    else
    {
        var life_reduce = 100;
    }
    push();
    translate(x_pos +cam_deviation * t_heart, y_pos+ cam_deviation * t_heart);
    noStroke();
    fill(map(life_reduce,100,0,255,100),
         map(life_reduce,50,0,0,100),
         map(life_reduce,70,40,90,80));

    rect(-105* heart_scale,205* heart_scale,210* heart_scale,-(map(life_reduce,100,0,245,0)* heart_scale));
    fill('#0a3042');

    beginShape();
    vertex(0,0);
    bezierVertex(0,0,-50* heart_scale,-70* heart_scale,-90* heart_scale,0);
    bezierVertex(-90* heart_scale,0,-140* heart_scale,100* heart_scale,0,200* heart_scale);
    vertex(0,210* heart_scale);
    vertex(-110* heart_scale,210* heart_scale);
    vertex(-110* heart_scale,-45* heart_scale);
    vertex(110* heart_scale,-45* heart_scale);
    vertex(110* heart_scale,210* heart_scale);
    vertex(0,210* heart_scale);
    vertex(0,200* heart_scale);
    bezierVertex(0,200* heart_scale,120* heart_scale,110* heart_scale,90* heart_scale,0);
    bezierVertex(90* heart_scale,0,66* heart_scale,-83* heart_scale,0,0);
    endShape();

    noFill();
    stroke('white');
    strokeWeight(5*heart_scale);
    beginShape();
    vertex(0,0);
    bezierVertex(0,0,-50* heart_scale,-70* heart_scale,-90* heart_scale,0);
    bezierVertex(-90* heart_scale,0,-140* heart_scale,100* heart_scale,0,200* heart_scale);
    bezierVertex(0,200* heart_scale,120* heart_scale,110* heart_scale,90* heart_scale,0);
    bezierVertex(90* heart_scale,0,66* heart_scale,-83* heart_scale,0,0);
    endShape();
    pop();

}
