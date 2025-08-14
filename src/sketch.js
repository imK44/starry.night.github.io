import { drawArrow, drawHearts } from "./ui.js";
import { SAW, SPARK } from "./enemies.js";
import { Player } from "./player.js";

/*

The Game Project

*/


var floorPos_y;

let player;

var canyons;
var turning_flow_array;

var flowpoints_upper;
var flowpoints_lower;
var flowpoints_front_lower;
var flowpoints_front_upper;



var trees;
var mountains;
var clouds;

var CLOUDS;
var START_CLOUDS;

var game_score;


var cameraPosX;

var lives;
var playerDeath = false;

var obstacle_detect = false;

var ground_level;
var finishLine;
var isReached;
var elasiticy_x; // ribbon at the finish line
var elasiticy_y; // ribbon at the finish line

var level_complete;

var cam_deviation;

var lake;
var lake_flow;



var jumpSound;
var collect_itemSound;
var landingSound;
var EndingMusic;
var bumpSound;
var bumpSoundCounter = 0;
var backgrounSound;
var movingSound;
var movingSoundisPlaying = false;
var finishing_musicsPlaying = false;

var saws;

var colour_transparent;
var meet_with_saw;
var endurance_time;

var playerDeath;
var pointer; // for arrow sign
function preload()
{
    soundFormats('mp3','wav');

    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    collect_itemSound = loadSound('assets/collect_item.wav');
    collect_itemSound.setVolume(1);
    landingSound = loadSound('assets/landing.wav');
    landingSound.setVolume(0.5);
    //EndingMusic = loadSound("assets/ES_Don't Break (Sting Version) - SINY.mp3");
    EndingMusic = loadSound("assets/Ending.mp3");
    EndingMusic.setVolume(1);
    bumpSound = loadSound('assets/bump.wav');
    bumpSound.setVolume(1);
    backgrounSound = loadSound('assets/background.mp3');

    movingSound = loadSound('assets/moving.wav');
    movingSound.setVolume(0.3);
    crowdcheerSound = loadSound("assets/CROWD CHEER SOUND EFFECT.mp3");
    crowdcheerSound.setVolume(0.8);
}

function setup()
{
    createCanvas(1024, 576);
    floorPos_y = height * 4/5;

    lives = 3;

    backgrounSound.setVolume(0.4);
    backgrounSound.loop();

    test_x = 600;
    test_y = 350;
    test_size = 30;
    test_trail = [];  

    colour_transparent = 50; // for dead scenario
    playerDeath = false;


    startGame();

}



function startGame()
{      
    level_complete = false;

    endurance_time = 100; //recovery from saw
    player = new Player(width/2, floorPos_y);






    canyons = [{xpos : 300,ypos: floorPos_y, width:125, height : height-floorPos_y},
               {xpos : 1210,ypos: floorPos_y ,width: 130, height : height-floorPos_y},
               {xpos : 2300,ypos: floorPos_y ,width: 120, height : height-floorPos_y},
               {xpos : 2480,ypos: floorPos_y ,width: 120, height : height-floorPos_y},
               {xpos : 3400,ypos: floorPos_y ,width: 120, height : height-floorPos_y},
               {xpos : 3570,ypos: floorPos_y ,width: 120, height : height-floorPos_y}
              ];
    turning_flow();
    create_water_flow();

    obstacles = [{xpos: 3300, o_height: 80, o_width: 10},
                 {xpos: 2850, o_height: 100, o_width: 100},
                 {xpos: 2700, o_height: 180, o_width: 100},
                 {xpos: 2250, o_height: 50, o_width: 400},
                 {xpos: 2050, o_height: 150, o_width: 100},
                 {xpos: 1970, o_height: 70, o_width: 10},

                 {xpos: 1850, o_height: 100, o_width: 100},
                 {xpos: 1350, o_height: 70, o_width: 10},
                 {xpos: 1000, o_height: 70, o_width: 200},
                 {xpos: 650, o_height: 70, o_width: 10},
                 {xpos: 100, o_height: 70, o_width: 10},
                 {xpos: 4330, o_height: 70, o_width: 10}
                ];
    trees = [{xpos: random(100), ypos : random(5), scale : random(0.3,0.5)}];
    mountains = [{xpos: random(100), scale : random(0.7,1.2)}];

    game_score = 0;

    collectables = [
        {xpos: 300, ypos : floorPos_y, scale: 4, isfound : false},
        {xpos: 600, ypos : floorPos_y, scale: 4, isfound : false},
        {xpos: 950, ypos : floorPos_y-200, scale: 4, isfound : false},
        {xpos: 1300, ypos : floorPos_y-150, scale: 4, isfound : false},
        {xpos: 1650, ypos : floorPos_y-10, scale: 4, isfound : false},
        {xpos: 2150, ypos : floorPos_y-300, scale: 4, isfound : false},
        {xpos: 2180, ypos : floorPos_y-20, scale: 4, isfound : false},
        {xpos: 2300, ypos : floorPos_y-70, scale: 4, isfound : false},
        {xpos: 2400, ypos : floorPos_y-70, scale: 4, isfound : false},
        {xpos: 2500, ypos : floorPos_y-70, scale: 4, isfound : false},
    {xpos: 3530, ypos : floorPos_y-10, scale: 4, isfound : false},
        {xpos: 4000, ypos : floorPos_y-10, scale: 4, isfound : false},
        {xpos: 4200, ypos : floorPos_y-10, scale: 4, isfound : false}
    ];

    finishLine = {xpos: 4500, ypos: floorPos_y - 25, isReached : false} ;

    cam_deviation = 1;

    lake_flow = [];
    lake = 
        {
        lakeX : 0,
        lakeY : floorPos_y - 145,
        drawLake : function()
        {   

            noStroke();
            fill('#60BEEB');
            fill('#48a1cb');
            rect(this.lakeX, this.lakeY, width, 130);

        },

        lake_flow_Setup : function()
        {
            for(var i = 0; i< 17; i++)
            {
                var flow = createVector(random(0,width),random(floorPos_y - 140 , floorPos_y - 50));
                flow._width = random(50,120);
                flow._height = random(3,8);

                var found = false;

                for(var gh=0; gh< lake_flow.length; gh++)
                {
                    if(flow.x + flow._width + 10 > lake_flow[gh].x && 
                       flow.x < lake_flow[gh].x + lake_flow[gh]._width + 10 && 
                       flow.y + flow._height + 10> lake_flow[gh].y && 
                       flow.y < lake_flow[gh].y + lake_flow[gh]._height + 10)
                    {
                        found = true;
                    }
                }


                if(!found)
                {   
                    flow.endX = flow.x + flow._width;
                    flow.endY = flow.y + flow._height/2;
                    flow.size = flow._height * (2/3);
                    flow.size_incre = 0.1;
                    flow.trail = [];
                    lake_flow.push(flow);
                }
                else
                { 
                    i -= 1;
                }
            }
        },

        drawLake_flow : function()
        {
            for(var i = 0; i< lake_flow.length; i++)
            {
                fill(255);
                ellipse(lake_flow[i].endX, lake_flow[i].endY, lake_flow[i].size);

                if(lake_flow[i].endX > lake_flow[i].x)
                {   

                    lake_flow[i].endX -= 1; 

                }
                else
                {
                    lake_flow[i].endX = lake_flow[i].x + lake_flow[i]._width;
                    lake_flow[i].size = lake_flow[i]._height * (2/3);
                }


                lake_flow[i].trail.push({x:lake_flow[i].endX,
                                         y:lake_flow[i].endY,
                                         size:lake_flow[i].size});

                if(lake_flow[i].trail.length > random(30,40))
                {
                    lake_flow[i].trail.shift();
                }

                for(var t = 0; t< lake_flow[i].trail.length; t++)
                {
                    //fill(map(lake_flow[i].trail[t].x,lake_flow[i].x + lake_flow[i]._width,lake_flow[i].x,255,230));
                    fill('white');
                    ellipse(lake_flow[i].trail[t].x, lake_flow[i].trail[t].y,lake_flow[i].trail[t].size );
                }                

            }
        }
    }

    lake.lake_flow_Setup();

    CLOUDS = [];
    for(var i = 0; i < 4; i++)
    {
        var cloud = createVector(random(width/4 * i, width/4 * (i+1)), random(50,200));
        cloud.speed = random(0.7,1.2);
        cloud.size = random(20,60);
        CLOUDS.push(cloud);
    }

    START_CLOUDS = new CREATE_CLOUDS();
    
  
    
    saws = 
        {
        spark_array : [],
        X : [800,1600,3100,4320,4110,3905],
        saws_array : [],
        saw_setup : function()
        {
            for(var i = 0; i< this.X.length; i++)
            {
                this.saws_array.push(new SAW (this.X[i], floorPos_y,0.3,this.X[i]-100,this.X[i]+100,0));
            }
        },

        saw_CordXY_setup : function()
        {
            for(var i =0; i< this.saws_array.length; i++)
            {
                this.saws_array[i].create_pointy_main();
            }
        },

        draw : function()
        {   

            for(var i =0; i< this.saws_array.length; i++)
            {
                push();
                noStroke();
                fill(100);
                fill('#332f3f');
                fill('#2c2837');
                quad(this.X[i]-100,floorPos_y-5,
                     this.X[i]+100,floorPos_y-5,
                     this.X[i]+100+7,floorPos_y,
                     this.X[i]-100+7,floorPos_y);
                fill(0);
                triangle(this.X[i]+100,floorPos_y-5,
                         this.X[i]+100+7,floorPos_y,
                         this.X[i]+100,floorPos_y);


                this.saws_array[i].move_left_right();

                this.saws_array[i].draw_main();
                this.saws_array[i].rotate_pointy_main();
                this.saws_array[i].draw_in_inner();

                if(abs((this.saws_array[i].x - 100 * this.saws_array[i].scale - 30 * this.saws_array[i].scale)-  (this.saws_array[i].left_end))< 10)
                {

                    this.saws_array[i].offset = random(-1,1); 
                    var x_tempo_pos = this.saws_array[i].x - 70 * this.saws_array[i].scale;
                    var y_tempo_pos = this.saws_array[i].y;
                    var spark_array_Item = new SPARK(x_tempo_pos + random(-1,1),y_tempo_pos+ random(-1,1),random(-1,-3),random(-1,-6));
                    this.spark_array.push(spark_array_Item);


                    for(var g =0; g<this.spark_array.length; g++)
                    {
                        var colour = color( 255,50,0,
                                           map(this.spark_array[g].y,
                                               this.saws_array[i].y, this.saws_array[i].y -100, 255,50));

                        this.spark_array[g].create_spark(colour);
                        this.spark_array[g].update();
                    }

                }

                else if(abs((this.saws_array[i].x + 100 * this.saws_array[i].scale)-  (this.saws_array[i].right_end))< 10)
                {

                    this.saws_array[i].offset = random(-1,1); 
                    var x_tempo_pos = this.saws_array[i].x + 80 * this.saws_array[i].scale;
                    var y_tempo_pos = this.saws_array[i].y;
                    var spark_array_Item = new SPARK(x_tempo_pos + random(-1,1),y_tempo_pos+ random(-1,1),random(-1,1),random(-1,-6));

                    this.spark_array.push(spark_array_Item);


                    for(var g =0; g<this.spark_array.length; g++)
                    {
                        var colour = color( 255,50,0,
                                           map(this.spark_array[g].y,
                                               this.saws_array[i].y, this.saws_array[i].y -100, 255,50));
                        this.spark_array[g].create_spark(colour);
                        this.spark_array[g].update();
                    }

                }
                else
                {   
                    this.spark_array = [];
                }

                fill('#4B4453');
                rect(this.X[i]-100+7,floorPos_y, 200,25);
                fill('#37303e');
                rect(this.X[i] - 100 , floorPos_y + 24.5, 200, height-floorPos_y+25);
                pop();

            }
        }
    };
    
    sky = 
    {
        sky_array : [],   
        create_sky : function(star_count)
        {
            for(var i = 0; i< star_count; i++)
            {
                var sky_item = createVector(random(-width,width),random(height,-height));
                sky_item.speed = random(0.2);
                this.sky_array.push(sky_item);
            }
        },
        
        draw_sky : function()
        {
            push();
            translate(width/2, height*3/4); 
            for(var i = 0; i< this.sky_array.length; i++)
            {
                fill('white');
                ellipse(this.sky_array[i].x,this.sky_array[i].y,random(2.5));
            }
            pop();
        },
        
        update_sky : function()
        {
            for(var i = 0; i< this.sky_array.length; i++)
            {
                this.sky_array[i].rotate(this.sky_array[i].speed * (PI/180));
            }
        }
    };
    
    sky.create_sky(1000);
    
    saws.saw_setup();
    saws.saw_CordXY_setup();
    pointer= {x:100, y : 350};
}

function draw()
{   
    //******* (cameraPosX-512)*-1 ********//
    ///////////DRAWING CODE//////////

    background('#0a3042');
    sky.draw_sky();
    sky.update_sky();
    
    drawHearts(lives);

    lake.drawLake();
    lake.drawLake_flow();



    fill('#4B4453');
    noStroke();
    rect(0, floorPos_y-24.6, width, 50); // draw Lane
    //draw wall under lane
    fill('#37303e');
    rect(0, floorPos_y + 25, width, height - floorPos_y + 25);

    fill('#428985');
    //fill('#394244');
    rect(0, floorPos_y - 170, width,25);



    START_CLOUDS.createCloud();
    START_CLOUDS.updateCloud();
    create_tree_and_mountain(trees,mountains);

    push();
    translate((width/2 - player.x)*0.3+ cam_deviation,0);
    START_CLOUDS.drawCloud();
    draw_mountain(mountains);
    draw_tree(trees);
    pop();


    push();
    cameraPosX = width/2 - player.x + cam_deviation;
    translate(cameraPosX,0);
    draw_canyons(canyons); //draw the canyon
    saws.draw(); // draw saws (kind of enemies)
    draw_obstacle(obstacles); // hurdles and slides
    start_drawArrow(100,'blue');
    start_drawArrow(3000,'red');
    start_drawArrow(4000,'green');
    check_saws(saws.saws_array); // check contact with saws
    render_finishline(finishLine,0); // draw the finish line behind game character 1/2
    for (var i = 0; i< collectables.length; i++) // check collectables
    {   
        if(!collectables[i].isfound)
        {
            checkCollectables(collectables[i]); 
        }
        draw_collectables(collectables[i]);

    }
    check_finishline(finishLine); // check the finish line
    check_canyon(canyons); // check canyon


    //the game character drawing start
    if(!playerDeath)
    {
        if(player.isLeft && player.isFalling)
        {
            draw_left_right_head(player.x,player.y,-1, 20);
            draw_left_right_jump_body(player.x, player.y,-1);
        }
        else if(player.isRight && player.isFalling)
        {
            draw_left_right_head(player.x,player.y,1, 20);
            draw_left_right_jump_body(player.x, player.y,1);
        }
        else if(player.isLeft)
        {
            draw_left_right_head(player.x,player.y,-1, 0);
            draw_left_right_ground_body(player.x,player.y,-1);

        }
        else if(player.isRight)
        {
            draw_left_right_head(player.x,player.y,1, 0);
            draw_left_right_ground_body(player.x,player.y,1);  
        }
        else if(player.isFalling || player.isPlummeting)
        {
            draw_facing_forward_face(player.x,player.y+27,260);
            draw_body_jumping_faceforward(player.x,player.y);
        }
        else
        {
            draw_facing_forward_face(player.x,player.y,170);
            draw_facing_forward_body(player.x,player.y);
        }

    }
    else
    {
        make_char_no_move();
    }
    //the game character drawing end
    render_finishline(finishLine,50); //// draw the finish line infront game character 2/2

    pop();

    fill(255);
    textSize(15);
    text("game score :" + game_score, 35,40);


    if(level_complete)
    {
        winning_message();
        if(!finishing_musicsPlaying)
        {
            EndingMusic.play();
            crowdcheerSound.play();
            backgrounSound.setVolume(1);
            //backgrounSound.stop();
            
            finishing_musicsPlaying = true;
        }

        if(keyCode == 13)
        {
            finishing_musicsPlaying = false;
            backgrounSound.setVolume(0.4);
            startGame();
        }
        else
        {   
            shifting_camera();
            return;
        }
    }



    ///////////INTERACTION CODE//////////

    if(abs(ground_level-player.y)<3 && (player.isLeft||player.isRight) && bumpSoundCounter < 1 && !playerDeath)
    {   
        if(!movingSoundisPlaying)
        {
            movingSound.loop();
            movingSoundisPlaying = true;
        }    
    }    
    else
    {   
        movingSound.stop();
        movingSoundisPlaying = false;
    }


    checkPlayerDie();

    check_gravity();
    bump_obstacles();
    playBump();

    if(player.isLeft)
    {
        player.x -= 3;
    }

    else if(player.isRight)
    {
        player.x += 3;
    }

}

function start_drawArrow(x,c_colour)
{

    if(pointer.x < 250)
    {
        pointer.x += 3;
    }
    else
    {
        pointer.x = 100;
    }

    for(var i = 0; i< 3; i++)
    {   

        drawArrow(x+(50*i),floorPos_y+35,0.7,100+(50*i), 100+(50*i) + 50, c_colour);
    }
}
function check_saws(saws_array)
{
    for(var i = 0; i< saws_array.length; i++)
    {
        if(dist(player.x, player.y,saws_array[i].x,saws_array[i].y)<20 && !playerDeath)
        {   
            meet_with_saw = true;
            break;
        }
        else
        {
            meet_with_saw = false;
        }

    }

    dead_scenario(meet_with_saw);
}
function dead_scenario(statement_to_check)
{
    if(statement_to_check)
    {
        if(player.isLeft)
        {
            player.x += 2;
        }
        if(player.isRight)
        {
            player.x -= 2;
        }
        cam_deviation = random(-2,2);
        noStroke();
        fill(255,10,10,colour_transparent);
        rect(player.x - width/2,0,player.x + width/2, height);
        colour_transparent ++;
        endurance_time --;        
    }
    else
    {
        //endurance_time = 100; // (reducing life animation now implemented, uncomment out again to remove that scenario)
        colour_transparent = 0;
    }
}

function keyPressed()
{   
    if(keyCode == 37)
    {      
        player.isLeft = true;

    }

    if(keyCode == 39)
    {   
        player.isRight = true;

    }

    if(keyCode == 32 && abs(player.y-ground_level) < 3 && !level_complete)
    {
        player.y -= 180;
        jumpSound.play();

    }

}

function keyReleased()
{
    if(keyCode == 37)
    {   
        player.isLeft = false;
        movingSound.stop();
    }
    if(keyCode == 39)
    {   
        player.isRight = false;
        movingSound.stop();
    }
    if(keyCode == 32)
    {
        player.isJump = false;
    }
}

function shifting_camera()// just for the animation when the player win the game
// camera will keep going right
{

    if(cam_deviation < 500)
    {
        cam_deviation -= 2;
    }
    else
    {
        return;
    }
}
function winning_message()
{   
    fill(255);
    text('Wow! you win', width/2, height/2+30);
    text('Thank you for playing this game!', width*(2/3), height - 30);
    text('Press Enter to start again.', width/2, height/2 + 90);
}

function checkPlayerDie()
{   
    if(player.y - 100 > height || endurance_time <=0)
    {
        if(lives > 1)
        {
            lives --;
            startGame(); 
        }

        else
        {   
            lives = 0;
            playerDeath = true;
            gameOver();
        }

    }
}

function gameOver()
{   

    text('game over', width/2, height/2);
    text('press "Enter" to start new game', width/2 ,height/2 + 50);
    text("lives remaining :"+lives, 850, 40);
    if(keyCode == 13)
    {   
        lives = 3;
        playerDeath = false;
        startGame();
    }
}

// scene drawing functions
function check_finishline(t_finishline)
{
    if(player.x > t_finishline.xpos)
    {
        elasiticy_x = (player.x-finishLine.xpos)*10;
        elasiticy_y = (player.y-460)*10;
    }

    else
    {
        elasiticy_x = 0;
        elasiticy_y = 0;
    }

    if(elasiticy_x > 1210)
    {
        t_finishline.isReached = true;
    }
}

function render_finishline(t_finishline, pass_value)
{   
    stroke(10);
    if(t_finishline.isReached)
    {
        xflip = random(-1,-0.8);
        level_complete = true;
    }

    else
    {   
        fill('orange');

        push();
        strokeWeight(2);
        translate(t_finishline.xpos, t_finishline.ypos);
        beginShape();
        curveVertex(-226 + random(50,100)-elasiticy_x,-208-elasiticy_y );
        curveVertex(0,-45);// -45
        curveVertex(50,1);
        curveVertex(50,10);
        curveVertex(0,-35);
        curveVertex(-226 + random(50,100)-elasiticy_x ,-208-elasiticy_y);

        endShape();
        pop();
        xflip = random(0.8,1);
    }


    draw_flag(t_finishline.xpos + pass_value, t_finishline.ypos + pass_value, xflip);
}


function draw_flag(t_xpos, t_ypos, xflip)
{   
    push();
    var offset = random(-5,5);
    translate(t_xpos, t_ypos);

    if(xflip > 0.7)
    {
        fill(100,190,200);
    }
    else
    {
        fill(140,270,100);
    }

    strokeWeight(2);
    beginShape();
    curveVertex(0,0);
    curveVertex(0,0);
    curveVertex(0,-250);
    curveVertex(-78 * xflip,-286);
    curveVertex(-85* xflip+ offset,-279);
    curveVertex(-73* xflip+ offset,-215);
    curveVertex(-66* xflip + offset,-118);
    curveVertex(2* xflip,-75);
    curveVertex(-80* xflip,90);
    endShape();

    if(xflip > 0.7)
    {   

        fill('red');
        beginShape();
        vertex(-54* xflip+ offset,-169);
        vertex(-52* xflip+ offset,-143);
        vertex(-18* xflip+ offset,-144);
        vertex(-16* xflip+ offset,-149);
        vertex(-36* xflip+ offset,-152);
        vertex(-37* xflip+ offset,-165);
        vertex(-43* xflip+ offset, -165);
        vertex(-43* xflip+ offset,-155);
        vertex(-48* xflip+ offset,-155);
        endShape(CLOSE);

        fill('yellow');
        beginShape();
        vertex(-55 * xflip+ offset,-185);
        vertex(-17* xflip+ offset,-184);
        vertex(-17* xflip+ offset,-191);
        vertex(-50* xflip+ offset,-190);
        endShape(CLOSE);

        fill('orange');
        beginShape();
        vertex(-54* xflip+ offset, -209);
        vertex(-16* xflip+ offset,-206);
        vertex(-16* xflip+ offset,-212);
        vertex(-43* xflip+ offset,-213);
        vertex(-15* xflip+ offset,-228);
        vertex(-57* xflip+ offset,-231);
        vertex(-59* xflip+ offset,-229);
        vertex(-34* xflip+ offset,-224);
        endShape(CLOSE);

    }

    else if(xflip < -0.7  ) // win
    {   
        fill('yellow');
        beginShape();
        vertex(-12 * xflip + offset,-135);
        vertex(-46 * xflip+ offset,-146);
        vertex(-25 * xflip+ offset,-155);
        vertex(-46 * xflip + offset,-162);
        vertex(-14 * xflip + offset,-178);
        vertex(-31 * xflip + offset,-163);
        vertex(-17 * xflip + offset,-155);
        vertex(-30 * xflip + offset,-149);
        endShape(CLOSE);

        fill('yellow');
        beginShape();
        vertex(-9 * xflip + offset,-197);
        vertex(-45 * xflip + offset,-191);
        vertex(-50 * xflip + offset,-197);
        vertex(-8 * xflip + offset,-203);
        endShape(CLOSE);

        fill('orange');
        beginShape();
        vertex(-8 * xflip + offset,-219);
        vertex(-47 * xflip + offset,-214);
        vertex(-50 * xflip + offset,-221);
        vertex(-22 * xflip + offset,-222);
        vertex(-53 * xflip + offset,-238);
        vertex(-16 * xflip + offset,-246);
        vertex(-18 * xflip + offset,-241);
        vertex(-33 * xflip + offset,-237);
        endShape(CLOSE);

        beginShape(); // ribbon
        curveVertex(-207, -43 + random(-20,20));
        curveVertex(0,-40);
        curveVertex(63,-42+ offset);
        curveVertex(69,-51 + offset);
        curveVertex(0,-50);
        curveVertex(-207, -43+ random(-20,20));
        endShape();

    }

    pop();
}

function CREATE_CLOUDS()
{
    this.findBiggestCloud = function()
    {   
        if(CLOUDS.length == 0)
        {
            var checker = 0;
        }
        else
        {
            var checker = CLOUDS[0].x;
            for(var i =0; i< CLOUDS.length; i++)
            {
                if(checker < CLOUDS[i].x)
                {
                    checker = CLOUDS[i].x;
                }
            }
        }

        return checker;

    }

    this.createTempt = function()
    {
        var tempt_array = [];
        for(var i = 0; i < 4; i++)
        {   
            var basic_value = player.x * (1/3.35)+(cam_deviation * (-1));//
            var x = random(basic_value +1000, basic_value + 2000);
            var y = random(50, 200);
            var v = createVector(x,y);
            v.speed = random(0.7,1.2);
            v.size = random(20,50);
            tempt_array.push(v);
        }
        return tempt_array;
    }

    this.checkCloud = function()
    {
        var tempt_array = this.createTempt();
        var accept = true;
        for(var i = 0; i< tempt_array.length-1; i++)
        {               
            var base_check_x = tempt_array[i].x;
            var base_check_y = tempt_array[i].y;

            for(var g = 0; g< tempt_array.length; g++)
            {
                if (g == i)
                {
                    continue;
                }
                else
                {
                    var d = dist(base_check_x,base_check_y,tempt_array[g].x,tempt_array[g].y);
                }

                if(d< 200)
                {
                    accept = false;
                }
            }
        }

        if(!accept)
        {
            this.checkCloud();
        }
        else
        {   
            for(var i = 0; i < tempt_array.length ; i++)
            {
                CLOUDS.push(tempt_array[i]); 
            }

        }
    }

    this.createCloud = function()
    {   

        if (player.x * (1/3.35) + 1000 +(cam_deviation * -1) > this.findBiggestCloud())// 
        {
            this.checkCloud();
        }
    }
    this.drawCloud = function()
    {        
        for(var i =0; i<    CLOUDS.length; i++)
        {   

            var x_pos = CLOUDS[i].x;
            var y_pos = CLOUDS[i].y;
            var sizE = CLOUDS[i].size;
            push();
            translate(x_pos,y_pos);
            cloud = {x:0, y: 0,size:sizE, reduce_size:sizE/4};
            colour = ["#F092DD",'#FFAFF0','#EEC8E0',"#ECDEE7"];

            fill(191, 170, 186); noStroke();
            fill(151, 170, 206);

            ellipse(-sizE/10,sizE/2,sizE * 2,sizE/5);

            fill('red');
            ellipse(cloud.x,cloud.y,cloud.size);
            for (var c = 0; c<3; c++)
            {

                fill(colour[c]);
                ellipse(cloud.x,cloud.y,cloud.size);

                push();
                translate(cloud.x,cloud.y);
                rotate(300*(PI/180));
                fill(colour[c+1]);
                ellipse(cloud.size*0.35,0,cloud.size*0.15, cloud.size*0.4);
                pop();

                beginShape();
                curveVertex(cloud.x+cloud.size/2      ,cloud.y-cloud.size*1.8);
                curveVertex(cloud.x+cloud.size/2      ,cloud.y);                // first point
                curveVertex(cloud.x+cloud.size*0.8    ,cloud.y+cloud.size*0.45);// bottom point
                curveVertex(cloud.x                   ,cloud.y+cloud.size*0.5); // last point
                curveVertex(cloud.x                   ,cloud.y+cloud.size*0.5);
                endShape();

                cloud.size -= cloud.reduce_size;
                cloud.y += cloud.reduce_size/2;
                cloud.x -= cloud.size/1.5;
            }
            pop();

        }   
    }

    this.updateCloud = function()
    {
        for(var i =0; i < CLOUDS.length; i++)
        {
            CLOUDS[i].x -= CLOUDS[i].speed;
            //CLOUDS[i].x -= 1;
        }
        for(var i = CLOUDS.length-1; i > 0; i--)
        {
            if(CLOUDS[i].x < player.x*(1/3.35) + cam_deviation - 300) 
            {
                CLOUDS.splice(i,1);
            }
        }


    }


}

function create_tree_and_mountain(t_trees,t_mountains)
{   
    // to check the maximum value in order to avoid creating the object inside the range of trees positions.
    var tree_xpos_array = []; // for tree
    var mountain_xpos_array = []; // for mountain

    // create new arrays for both tree and mountain
    for (var i = 0; i< t_trees.length; i++)
    {
        tree_xpos_array.push(t_trees[i].xpos);
    }
    for (var i = 0; i< t_mountains.length; i++)
    {
        mountain_xpos_array.push(t_mountains[i].xpos);
    }

    // check when game_char x is about to reach the new areas where any none of trees and mountains have been drawn


    // mountains and trees are created at specific translate values = (cameraPosX) * 0.3
    // check only tree array, mountains can rely on trees.
    if(((1700-cameraPosX) * 0.3)+width/2 + (cam_deviation*-1)> Math.max(...tree_xpos_array)) // for right side
    {   
        for(var i = 0; i< 1; i++)
        {
            trees.push(
                {xpos : random(Math.max(...tree_xpos_array),Math.max(...tree_xpos_array)+300),
                 ypos : random(7), scale : random(0.3,0.6)}
            );
        }
        t_mountains.push(
            {xpos:
             random(Math.max(...mountain_xpos_array)+ 200, Math.max(...mountain_xpos_array) + 300),
             scale: random(0,1.2)}
        );
    }

    if(((1700-cameraPosX) * 0.3)-width/2 < Math.min(...tree_xpos_array)) // for left side
    {
        for(var i = 0; i< 1; i++)
        {
            trees.push(
                {xpos : random(Math.min(...tree_xpos_array),Math.min(...tree_xpos_array)-300),
                 ypos : random(7), scale : random(0.3,0.6)}
            );
        }
        t_mountains.push(
            {xpos:
             random(Math.min(...mountain_xpos_array)- 100, Math.min(...mountain_xpos_array) - 500),
             scale: random(0,1.2)}
        );
    }

}

function create_water_flow()// for canyon curve
{   


    flowpoints_upper = [];
    for(var i = 0; i<canyons.length; i++)
    {
        var temp_flow_array = [];
        for (var g = 0; g< 4; g++)
        {
            var tempt_flow_item = createVector(canyons[i].xpos + 5 + (2 * g * canyons[i].width/7), canyons[i].ypos + 25 + 10);
            tempt_flow_item.flow_width = canyons[i].width/7;
            tempt_flow_item.start = canyons[i].ypos+30;
            tempt_flow_item.end = canyons[i].ypos+ 35;
            tempt_flow_item.flow = random(0.8);
            temp_flow_array.push(tempt_flow_item);

        }
        flowpoints_upper.push(temp_flow_array);

    };

    flowpoints_lower = [];
    for(var i = 0; i<canyons.length; i++)
    {
        var temp_flow_array = [];
        for (var g = 0; g< 3; g++)
        {
            var tempt_flow_item = createVector(canyons[i].xpos +canyons[i].width/7 + 15+  (2 * g * canyons[i].width/7), canyons[i].ypos + 25 + 20);
            tempt_flow_item.flow_width = canyons[i].width/7;
            tempt_flow_item.start = canyons[i].ypos+40;
            tempt_flow_item.end = canyons[i].ypos +50
            tempt_flow_item.flow = random(0.8);
            temp_flow_array.push(tempt_flow_item);

        }
        flowpoints_lower.push(temp_flow_array);

    };


    flowpoints_front_lower = [];
    for(var i = 0; i<canyons.length; i++)
    {
        var temp_flow_array = [];
        for (var g = 0; g< 4; g++)
        {
            var tempt_flow_item = createVector(canyons[i].xpos + 25 + (2 * g * canyons[i].width/7), canyons[i].ypos + 25 + 30 + 23);
            tempt_flow_item.flow_width = canyons[i].width/7;
            tempt_flow_item.start = canyons[i].ypos+25+30+ 22;
            tempt_flow_item.end = canyons[i].ypos +25 +30+22 + 10;
            tempt_flow_item.flow = random(0.8);
            temp_flow_array.push(tempt_flow_item);

        }
        flowpoints_front_lower.push(temp_flow_array);

    };

    flowpoints_front_upper = [];
    for(var i = 0; i<canyons.length; i++)
    {
        var temp_flow_array = [];
        for (var g = 0; g< 3; g++)
        {
            var tempt_flow_item = createVector(canyons[i].xpos + 25 + canyons[i].width/7 + (2 * g * canyons[i].width/7), canyons[i].ypos + 25 + 30 + 13);
            tempt_flow_item.flow_width = canyons[i].width/7;
            tempt_flow_item.start = canyons[i].ypos+25+30+ 12;
            tempt_flow_item.end = canyons[i].ypos +25 +30+12 + 7;
            tempt_flow_item.flow = random(0.8);
            temp_flow_array.push(tempt_flow_item);

        }
        flowpoints_front_upper.push(temp_flow_array);

    };

    turnning_flow = [];

}

function turning_flow() // for canyon
{
    turning_flow_array = [];
    for(var i = 0; i< canyons.length; i++)
    {

        var tempt_array = [];
        for(var g = 0; g<2; g++)
        {
            var tempt_item = createVector(0,0);
            tempt_item.xpos = canyons[i].xpos+ 45+ (g*45);
            tempt_item.ypos = canyons[i].ypos-15+ (g*10);
            tempt_item.endXA = 30;
            tempt_item.flowSpeed = random(0.5,1);
            tempt_item.size = random(5,10);
            tempt_item.trail = [];
            tempt_array.push(tempt_item);
        }

        turning_flow_array.push(tempt_array);

        var tempt_item = createVector(0,0);
        tempt_item.xpos = canyons[i].xpos+ 30;
        tempt_item.ypos = canyons[i].ypos-15;
        tempt_item.endXA = 15;
        tempt_item.flowSpeed = turning_flow_array[i][0].flowSpeed;
        tempt_item.size = turning_flow_array[i][0].size;
        turning_flow_array[i].splice(0,0,tempt_item);


    }


}

function draw_turning_flow(t_turning_flow_array) // for canyon animation
{

    for(var i =0; i< t_turning_flow_array.length; i++)
    {

        push();
        translate(t_turning_flow_array[i].xpos, t_turning_flow_array[i].ypos);

        var tempt_obj = {};
        fill(map(t_turning_flow_array[i].y,0,10,255,230));

        ellipse(t_turning_flow_array[i].x, t_turning_flow_array[i].y,t_turning_flow_array[i].size);



        if(t_turning_flow_array[i].x > -(t_turning_flow_array[i].endXA) && t_turning_flow_array[i].y <5)
        {
            t_turning_flow_array[i].x -= t_turning_flow_array[i].flowSpeed;


        }
        if(t_turning_flow_array[i].x <= -(t_turning_flow_array[i].endXA) && t_turning_flow_array[i].y < 5)
        {
            t_turning_flow_array[i].rotate( -t_turning_flow_array[i].flowSpeed* (PI/180));
        }
        if(t_turning_flow_array[i].y >= 5)
        {
            t_turning_flow_array[i].x += t_turning_flow_array[i].flowSpeed;
            t_turning_flow_array[i].y += t_turning_flow_array[i].flowSpeed;
        }
        tempt_obj.x = t_turning_flow_array[i].x;
        tempt_obj.y = t_turning_flow_array[i].y;

        if(i != 0)
        {
            t_turning_flow_array[i].trail.push(tempt_obj); 
        }


        if(t_turning_flow_array[i].y >= 25)
        {
            t_turning_flow_array[i].x = 0;
            t_turning_flow_array[i].y = 0;

        }

        if(i != 0)
        {
            if(t_turning_flow_array[i].trail.length > random(15))
            {
                t_turning_flow_array[i].trail.shift();
            }

            for(var g =0; g< t_turning_flow_array[i].trail.length; g++)
            {
                fill(map(t_turning_flow_array[i].trail[g].y,0,10,240,255));
                ellipse(t_turning_flow_array[i].trail[g].x, t_turning_flow_array[i].trail[g].y,t_turning_flow_array[i].size);
            }
        }


        pop();
    }

}

function draw_canyons(t_canyon)
{   

    for(var i = 0; i< t_canyon.length; i++)
    {   
        noStroke();


        fill('#48a1cb'); // top part
        quad(t_canyon[i].xpos-25,floorPos_y-25,
             t_canyon[i].xpos+25,floorPos_y+25.2,
             t_canyon[i].xpos+25+t_canyon[i].width,
             floorPos_y+25.2,
             t_canyon[i].xpos-25+t_canyon[i].width
             ,floorPos_y-25);


        rect(t_canyon[i].xpos + 25 , t_canyon[i].ypos + 25, t_canyon[i].width , height - t_canyon[i].ypos + 25);


        draw_turning_flow(turning_flow_array[i]);

        fill('#584e63');// wall 
        quad(t_canyon[i].xpos -25 + t_canyon[i].width, t_canyon[i].ypos-25,
             t_canyon[i].xpos -25 + t_canyon[i].width, t_canyon[i].ypos -25+ 30,
             t_canyon[i].xpos +25 + t_canyon[i].width, t_canyon[i].ypos + 25 + 30,
             t_canyon[i].xpos +25 + t_canyon[i].width, t_canyon[i].ypos + 25);

        fill('#60BEEB'); // front
        rect(t_canyon[i].xpos + 25 , t_canyon[i].ypos + 25+30, t_canyon[i].width , height - t_canyon[i].ypos + 25+30);

        /// flow part start flat
        noStroke();
        for(var g =0; g < flowpoints_upper[i].length; g++)
        {
            fill('white');
            beginShape();
            vertex(flowpoints_front_lower[i][g].x,canyons[i].ypos + 25 + 30);
            vertex(flowpoints_upper[i][g].x+6, flowpoints_upper[i][g].y+6);
            bezierVertex(flowpoints_upper[i][g].x, flowpoints_upper[i][g].y,
                         flowpoints_upper[i][g].x + flowpoints_upper[i][g].flow_width/2,
                         flowpoints_upper[i][g].y-10,
                         flowpoints_upper[i][g].x + flowpoints_upper[i][g].flow_width, flowpoints_upper[i][g].y);
            vertex(flowpoints_front_lower[i][g].x + flowpoints_upper[i][g].flow_width,canyons[i].ypos + 25 + 30)
            endShape();  
            if(flowpoints_upper[i][g].y > flowpoints_upper[i][g].end ||
               flowpoints_upper[i][g].y < flowpoints_upper[i][g].start)
            {
                flowpoints_upper[i][g].flow *= -1;
            }
            flowpoints_upper[i][g].x += flowpoints_upper[i][g].flow;
            flowpoints_upper[i][g].y += flowpoints_upper[i][g].flow;

        }


        for(var g = 0; g< flowpoints_lower[i].length; g++)
        {   
            beginShape();
            vertex(flowpoints_front_upper[i][g].x-1, canyons[i].ypos + 25+ 30);
            vertex(flowpoints_lower[i][g].x-0.05, flowpoints_lower[i][g].y);
            bezierVertex(flowpoints_lower[i][g].x, flowpoints_lower[i][g].y,
                         flowpoints_lower[i][g].x + flowpoints_lower[i][g].flow_width, flowpoints_lower[i][g].y + 10,
                         flowpoints_lower[i][g].x+ flowpoints_lower[i][g].flow_width-2, flowpoints_lower[i][g].y-2);
            vertex(flowpoints_front_upper[i][g].x+1+flowpoints_lower[i][g].flow_width, canyons[i].ypos + 25+ 30);
            endShape();

            if(flowpoints_lower[i][g].y > flowpoints_lower[i][g].end ||
               flowpoints_lower[i][g].y < flowpoints_lower[i][g].start)
            {
                flowpoints_lower[i][g].flow *= -1;
            }
            flowpoints_lower[i][g].x += flowpoints_lower[i][g].flow;
            flowpoints_lower[i][g].y += flowpoints_lower[i][g].flow;


        }

        for(var g =0; g< flowpoints_front_lower[i].length; g++)
        {

            fill('white');
            rect(flowpoints_front_lower[i][g].x, canyons[i].ypos + 25+30,
                 flowpoints_front_lower[i][g].flow_width,
                 flowpoints_front_lower[i][g].y + flowpoints_front_lower[i][g].flow_width/2 - (canyons[i].ypos + 25 + 30 ),0,0,flowpoints_front_lower[i][g].flow_width/2,flowpoints_front_lower[i][g].flow_width/2);

            if(flowpoints_front_lower[i][g].y > flowpoints_front_lower[i][g].end ||
               flowpoints_front_lower[i][g].y < flowpoints_front_lower[i][g].start)
            {
                flowpoints_front_lower[i][g].flow *= -1;
            }
            flowpoints_front_lower[i][g].y += flowpoints_front_lower[i][g].flow;
        }

        for(var g =0; g< flowpoints_front_upper[i].length; g++)
        {   
            noStroke();
            fill('white');
            rect(flowpoints_front_upper[i][g].x-0.5, canyons[i].ypos + 25 + 30, flowpoints_front_upper[i][g].flow_width+1,flowpoints_front_upper[i][g].y-(canyons[i].ypos+25+30));

            fill('#60BEEB'); 
            ellipse(flowpoints_front_upper[i][g].x + flowpoints_front_upper[i][g].flow_width/2, flowpoints_front_upper[i][g].y, flowpoints_front_upper[i][g].flow_width,flowpoints_front_upper[i][g].flow_width);

            if(flowpoints_front_upper[i][g].y > flowpoints_front_upper[i][g].end ||
               flowpoints_front_upper[i][g].y < flowpoints_front_upper[i][g].start)
            {
                flowpoints_front_upper[i][g].flow *= -1;
            }
            flowpoints_front_upper[i][g].y += flowpoints_front_upper[i][g].flow;
        }

        fill('#37303e');
        triangle(t_canyon[i].xpos-25,floorPos_y+25,
                 t_canyon[i].xpos+25,floorPos_y+25.2+30,
                 t_canyon[i].xpos+25,
                 floorPos_y+25,
                 t_canyon[i].xpos+25,
                 floorPos_y);




    }
}

function draw_obstacle(t_obstacles)
{   
    for(var i = 0; i < t_obstacles.length; i++)
    {


        if(t_obstacles[i].o_width == 10)
        {   
            hurdle_leg(t_obstacles[i],50-10, 25);// passing x value and y value
            hurdle_leg(t_obstacles[i],0 +3-10, -25 +3);
            hurdle_top(t_obstacles[i]);
        }
        else
        {  
            slide_leg(t_obstacles[i].xpos, t_obstacles[i].o_height);
            slide_leg(t_obstacles[i].xpos + t_obstacles[i].o_width-10, t_obstacles[i].o_height);
            slide_top(t_obstacles[i].xpos, t_obstacles[i].o_width, t_obstacles[i].o_height);


        }
    }
}

function hurdle_top(hurdle)
{   
    t_hurdle = {xpos: hurdle.xpos - 10,
                o_height : hurdle.o_height};

    stroke(120);
    strokeWeight(0.4);

    fill(175, 180, 190);
    beginShape();
    vertex(t_hurdle.xpos , floorPos_y -25 - t_hurdle.o_height);
    vertex(t_hurdle.xpos+5, floorPos_y-25- t_hurdle.o_height);
    vertex(t_hurdle.xpos+5+50, floorPos_y+25- t_hurdle.o_height);
    vertex(t_hurdle.xpos+5+50-5, floorPos_y+25- t_hurdle.o_height);
    endShape(CLOSE);



    fill(220);
    beginShape();
    vertex(t_hurdle.xpos , floorPos_y-25-t_hurdle.o_height);
    vertex(t_hurdle.xpos , floorPos_y-25-t_hurdle.o_height+20);
    vertex(t_hurdle.xpos+3+50-3,floorPos_y+25-t_hurdle.o_height+3+20);
    vertex(t_hurdle.xpos+3+50-3,floorPos_y+25-t_hurdle.o_height+3+20-20-3);
    endShape(CLOSE);


    noStroke();
    for(var i = 0; i<2; i++)
    {   
        //fill(70);
        fill('red');
        quad(t_hurdle.xpos +3+(i*20), floorPos_y-25-t_hurdle.o_height+3 +20+(i*21),
             t_hurdle.xpos+3+15+(i*20),floorPos_y-25-t_hurdle.o_height+3+15+(i*20),
             t_hurdle.xpos+3+15+10+(i*20),floorPos_y-25-t_hurdle.o_height+3+15+10+(i*20),
             t_hurdle.xpos +3+10+(i*20), floorPos_y-25-t_hurdle.o_height+3 +20+10+(i*21)+0.5);
    }

    noFill();
    beginShape();
    vertex(t_hurdle.xpos , floorPos_y-25-t_hurdle.o_height);
    vertex(t_hurdle.xpos , floorPos_y-25-t_hurdle.o_height+20);
    vertex(t_hurdle.xpos+3+50-3,floorPos_y+25-t_hurdle.o_height+3+20);
    vertex(t_hurdle.xpos+3+50-3,floorPos_y+25-t_hurdle.o_height+3+20-20-3);
    endShape(CLOSE);


}

function hurdle_leg(t_hurdle,passing_X, passing_Y)
{
    stroke(120);
    strokeWeight(0.4);

    fill(175, 180, 190);       
    beginShape();// front
    vertex(t_hurdle.xpos+ passing_X ,floorPos_y +passing_Y);
    vertex(t_hurdle.xpos+passing_X -3,floorPos_y +passing_Y-3);
    vertex(t_hurdle.xpos+passing_X -3,floorPos_y +passing_Y-3 - t_hurdle.o_height);
    vertex(t_hurdle.xpos+passing_X,floorPos_y +passing_Y - t_hurdle.o_height);
    endShape(CLOSE);

    fill(115, 120, 130);
    beginShape();
    vertex(t_hurdle.xpos+passing_X+5+15,floorPos_y +passing_Y - 5);
    vertex(t_hurdle.xpos+passing_X+5+15-3,floorPos_y +passing_Y - 5-3);
    vertex(t_hurdle.xpos+passing_X+5-3,floorPos_y +passing_Y - 5-3);
    vertex(t_hurdle.xpos+passing_X+5,floorPos_y +passing_Y - 5);
    endShape(CLOSE);


    fill(155, 160, 170);
    beginShape();
    vertex(t_hurdle.xpos+passing_X,floorPos_y +passing_Y - t_hurdle.o_height);
    vertex(t_hurdle.xpos+passing_X+5,floorPos_y +passing_Y - t_hurdle.o_height);
    vertex(t_hurdle.xpos+passing_X+5,floorPos_y +passing_Y - 5);
    vertex(t_hurdle.xpos+passing_X+5+15,floorPos_y +passing_Y - 5);
    vertex(t_hurdle.xpos+passing_X+5+15,floorPos_y +passing_Y);
    vertex(t_hurdle.xpos+passing_X,floorPos_y +passing_Y);
    endShape(CLOSE);
}

function slide_top(slide_X, slide_Width, slide_Height)
{
    fill(175, 180, 190);
    rect(slide_X,floorPos_y-slide_Height,slide_Width,10,5,3,0,5);

    var slide_y = floorPos_y-slide_Height;
    var partition = [30,40,20,10];
    for(i in partition)
    {
        var incre = 10 * (partition[i]/100);
        noStroke();
        fill(50,50,50,80 - (incre*20));
        rect(slide_X,slide_y, slide_Width,incre,incre*2,incre*1.2,0,0);
        slide_y += incre;

    }

}

function slide_leg(slide_X,slide_Height)
{   


    stroke(120);
    strokeWeight(0.4);

    fill(175, 180, 190);
    beginShape(); // front
    vertex(slide_X-12, floorPos_y - 10);
    vertex(slide_X-12, floorPos_y-10+5);
    vertex(slide_X+ 8, floorPos_y + 10+5);
    vertex(slide_X+ 8, floorPos_y + 10);
    endShape();

    fill(135, 140, 150);
    beginShape(); // top
    vertex(slide_X-12, floorPos_y - 10);
    vertex(slide_X+ 8, floorPos_y + 10);
    vertex(slide_X+ 8 + 17, floorPos_y + 10);
    vertex(slide_X-12 + 17, floorPos_y - 10);
    endShape(CLOSE);

    fill(195, 200, 210);
    rect(slide_X+ 8, floorPos_y + 10, 17,5); // side

    fill(175, 180, 190);
    rect(slide_X,floorPos_y,10,-slide_Height+5,4,4,0,0);

    var partition = [10,20,40,30];
    for(i in partition)
    {   
        var incre = 10 * (partition[i]/100);
        noStroke();
        fill(50,50,50,80 - (incre*20));
        rect(slide_X,floorPos_y-slide_Height+5, incre,slide_Height-9.5+incre,0,0,5,5);
        slide_X += incre;
    }

}

function check_canyon(t_canyon)
{   
    for(var i=0; i< t_canyon.length; i++)
    {
        if (player.x-8 > t_canyon[i].xpos && player.x +8  < t_canyon[i].xpos+t_canyon[i].width -15 && player.y >= t_canyon[i].ypos)    
        {   
            fall_canyon(t_canyon[i]);
        }
    }    
}

function fall_canyon(t_canyon)
{
    make_char_no_move();

    if(player.y < t_canyon.ypos + 70)
    {   
        player.y += 2;
        if(player.x > t_canyon.xpos+ t_canyon.width/2)
        {
            player.x -= 2;
        }
        if(player.x < t_canyon.xpos+ t_canyon.width/2)
        {
            player.x += 2;
        }
    }

    else
    {   
        player.isFalling = true;
        player.y += 8;    
    }
}

function make_char_no_move()
{
    if(player.isLeft)
    {
        player.x += 3;
    }

    if(player.isRight)
    {
        player.x -= 3;
    }   
}

function checkCollectables(t_collectable)
{   
    d = dist(t_collectable.xpos,t_collectable.ypos-10,player.x,player.y);
    if(d<40)
    {
        t_collectable.isfound = true;
        game_score += 1;
        collect_itemSound.play();
    }
}

function draw_collectables(t_collectable)
{   
    if(!t_collectable.isfound)
    {   
        noStroke();
        fill(random(30),10,random(200),random(20,50));
        ellipse(t_collectable.xpos+10, t_collectable.ypos-35, random(40,50));
        draw_shoe(t_collectable.xpos,t_collectable.ypos-(15*t_collectable.scale),1,t_collectable.scale,30,'#ffacd3');//'#ff72b4'
    }
}



function playBump()
{
    if( bumpSoundCounter == 1)
    {
        bumpSound.play();
    }
}

function bump_obstacles()
{   
    if(bump_check(obstacles) != undefined)
    {   
        if(floorPos_y - obstacles[bump_check(obstacles)].o_height< player.y-2)
        {
            if(player.isLeft && player.x -(30) -3 < obstacles[bump_check(obstacles)].xpos + obstacles[bump_check(obstacles)].o_width && player.x > obstacles[bump_check(obstacles)].xpos + obstacles[bump_check(obstacles)].o_width/2)
            {
                player.x += 3;
                bumpSoundCounter += 1;
            }
            else if(player.isRight && player.x +(30) +3> obstacles[bump_check(obstacles)].xpos && player.x < obstacles[bump_check(obstacles)].xpos + obstacles[bump_check(obstacles)].o_width/2)
            {
                player.x -= 3;
                bumpSoundCounter += 1;
            }

            else
            {
                bumpSoundCounter = 0;
            }
        }
        else
        {
            bumpSoundCounter = 0;
        }  

    }

} 

function bump_check(t_obstacles)
{   
    var to_return_value;
    var obs_array = [];
    for(var i = 0; i< t_obstacles.length; i++)
    {
        if (player.x + (30) > obstacles[i].xpos && 
            player.x - (30) < obstacles[i].xpos + obstacles[i].o_width)
        { 
            obs_array.push(i);  
        }
    }
    if(obs_array.length !=0 )
    {
        var checker_obs = obstacles[obs_array[0]].o_height;
        to_return_value = obs_array[0];
        for(var i = 0; i< obs_array.length; i++)
        {

            if(checker_obs < obstacles[obs_array[i]].o_height)
            {
                checker_obs = obstacles[obs_array[i]].o_height;
                to_return_value = obs_array[i];
            }
        }
    }
    return to_return_value;
}

function check_obstacles(t_obstacles)
{   
    var to_return_value;
    var obs_array = [];
    for(var i = 0; i< t_obstacles.length; i++)
    {
        if ((player.x + (30)-(10) > t_obstacles[i].xpos && player.x - (30)+(10) < t_obstacles[i].xpos+ t_obstacles[i].o_width) || 
            (player.x - (30) +(10) < t_obstacles[i].xpos + t_obstacles[i].o_width && player.x + (30) -(10)>t_obstacles[i].xpos))
        { 
            obs_array.push(i);  
        }
    }
    if(obs_array.length !=0 )
    {
        var checker_obs = obstacles[obs_array[0]].o_height;
        to_return_value = obs_array[0];
        for(var i = 0; i< obs_array.length; i++)
        {

            if(checker_obs < obstacles[obs_array[i]].o_height)
            {
                checker_obs = obstacles[obs_array[i]].o_height;
                to_return_value = obs_array[i];
            }
        }
    }
    return to_return_value;

}

function check_gravity()
{   

    if(check_obstacles(obstacles) != undefined)
    {
        ground_level = floorPos_y - obstacles[check_obstacles(obstacles)].o_height;
    }

    else
    {
        ground_level = floorPos_y;
    }
    fall_gravity(ground_level);
}

function fall_gravity(t_ground)
{
    if(player.y < t_ground)
    {   
        player.isFalling = true; 
        player.y += 3;
        if(abs(player.y-t_ground)<2)
        {
            landingSound.play();
        }

    }
    else
    {   
        player.isFalling = false;
    }
}


// character drawing function start
function draw_head_band(rotateDegree,xflip) // head band
{    
    push();
    stroke(0); strokeWeight(0.25);
    fill(179, 45, 0);
    rotate(D2R(rotateDegree));
    beginShape();
    vertex(0, 4.5);
    vertex(-40.5 *xflip, -21);
    vertex(-36 *xflip, -13.5);
    vertex(-42 *xflip, -12);
    vertex(0, 4.5);
    vertex(-49.5 *xflip, -9);
    vertex(-42 *xflip, -3);
    vertex(-52.5 *xflip, -1.5);
    endShape(CLOSE);
    pop();
}
function draw_facing_forward_face(t_x, t_y,t_degree)
{   
    push();
    translate(t_x,t_y-120);

    draw_head_band(t_degree,-1);

    fill(255,255,230);
    ellipse(0,0,45,45);

    // eye mask red part start
    fill('red');
    noStroke()
    arc (0,0,45,45,0,D2R(25));
    arc (0,0,45,45,D2R(155),D2R(180));
    triangle(0,0,-20.25, 9.45, 20.4, 9.45);
    // eye mask red part end

    // eye start
    stroke(0);
    fill(255); strokeWeight(0.3);
    triangle(-1.5, 6, -15, 3, -10.5, 7.5);
    triangle(1.5, 6, 15, 3, 10.5, 7.5);
    // eye end

    //mouth start
    beginShape();
    vertex(7.5,16.5)
    vertex(-4.5,15);
    vertex(-3,18);
    endShape();
    // mouth end

    pop();
}
function draw_facing_forward_body(t_x, t_y)
{   
    draw_skate(t_x+55, t_y-58 ,1,1,280); 
    push();
    translate(t_x, t_y-60);

    stroke(0);
    strokeWeight(3);
    line(-5,0,0,-30); // body

    line(-4,-30, -26, -22);// left hand
    line(-12,-3, -26, -22); // left hand

    line(4,-30,23,-32); // right hand
    line(23,-32,44,-46); // right hand

    line(-7,3,-21,49); // left leg
    line(-4,3,2,49); // right leg
    fill('red'); noStroke();
    ellipse(-12,-3,8,8); // left fist
    ellipse(44,-46,8,8); // right fist

    draw_shoe(-19,50 ,-1,1.5,0,'cyan');
    draw_shoe(-1,50,1,1.5,0,'cyan');

    pop();
}

function draw_left_right_head(t_x,t_y, xflip, rotateDegree)
{   
    push();
    translate(t_x,t_y-110);
    rotate(D2R(rotateDegree*(xflip)));

    draw_head_band(0,xflip);    /// head band end

    /// head start
    fill(255, 255, 230);
    ellipse(0,0, 45, 45);   
    fill('red'); noStroke();
    arc (0,0,45,45,0,D2R(25));
    arc (0,0,45,45,D2R(155),D2R(180));
    triangle(0,0,-20.4, 9.45,20.4, 9.45);

    noFill();
    stroke(0); strokeWeight(0.25);
    line(-22.5,0, 22.5, 0);
    line(-20.4, 9.45, 20.4, 9.45);
    // head end

    //eye
    strokeWeight(0.15); stroke(0);
    fill(255);
    triangle(0, 3, 10.5* xflip, 4.5, 7.5* xflip, 6);
    triangle(13.5* xflip, 4.5, 19* xflip, 3, 17*xflip, 6);
    // eye end

    // mouth
    noFill();
    beginShape();
    vertex(12*xflip, 15);
    vertex(13.5*xflip, 13.5);
    vertex(3*xflip, 12);
    vertex(4.5*xflip, 15);
    endShape();
    // mouth end
    pop();
}

function draw_left_right_ground_body(t_x, t_y, xflip)
{   
    draw_skate(t_x,t_y,xflip*(-1),1,0);
    push();

    translate (t_x, t_y-60);

    stroke(0);

    strokeWeight(3);
    line(3*xflip,3, 0 *xflip,-23); // body


    line(5 * xflip ,6, 16*xflip,36); // front leg

    line(0,6, -8 *xflip,17); // back leg
    line(-8*xflip,17, -13*xflip,36); // back leg

    line(5*xflip,-21,14*xflip,-14); // front hand
    line(14*xflip,-14, 30*xflip, 0); // front hand

    line(-4*xflip,-21,-21*xflip,-11); // back hand
    line(-21*xflip,-11,-29*xflip,4);// back hand

    fill('red');
    noStroke();
    ellipse(30*xflip,0, 8,8);
    ellipse(-29*xflip,4,8,8);

    draw_shoe(14 * xflip ,37,xflip,1.5,0,'cyan');
    draw_shoe(-10 * xflip,37,xflip*(-1),1.5,0,'cyan');

    pop();
}

function draw_body_jumping_faceforward(t_x,t_y)
{
    draw_skate(t_x,t_y, 1,1,3); // draw skate

    push();

    translate (t_x, t_y-65);
    stroke(0);
    strokeWeight(3);
    line(0,0, 0,33.3); // body

    //strokeWeight(0.5);
    line(-4, 3,-50,-7.7);// other hand
    line(3 ,5 ,20 ,51.5); // hold hand

    noFill();// leg
    beginShape();
    vertex(-36,39.7);
    vertex(-30, 16  );
    vertex(  0,38.3);
    vertex( 20,19.7);
    vertex( 32,41.7);
    endShape();

    noStroke();
    fill('red');
    ellipse(-50,-7.7, 8,8);
    ellipse(20,51.5, 8,8);

    // function(xpos,ypos, flip(right side should be 1, shoe_size,rotation,color
    draw_shoe(-34,40,-1,1.5, 20,'cyan');
    draw_shoe( 30,42, 1,1.5,-20,'cyan');

    pop();

}

function draw_left_right_jump_body(t_x, t_y, xflip)
{   
    draw_skate(t_x-10*xflip,t_y-30,(-1)*xflip,-1,345*(xflip));
    push();
    translate (t_x, t_y-60);
    //rotate(rotateDegree * (PI/180));
    stroke(0);
    strokeWeight(3);

    line(-10*xflip,-25,-24*xflip,11);// body

    line(-6 *xflip, -20, 22 *xflip,-7); // front hand
    line(-18 *xflip,-20, -54 *xflip,-14); // back hand

    //front leg
    line(0,5,-25*xflip,18);
    line(0,5,31*xflip,12);

    // back leg
    line(-57*xflip,28,-42*xflip,-2);
    line(-25*xflip,18,-42*xflip,-2);

    noStroke();
    fill('red');
    ellipse(22 *xflip,-7, 8,8);
    ellipse(-54 *xflip,-14, 8,8);

    draw_shoe(31*xflip,15,1*xflip,1.5,300 *xflip,'cyan'); // front shoe
    draw_shoe(-55*xflip,31,-1*xflip,1.5,30 * xflip,'cyan'); // back shoe
    pop();

}

function draw_skate(t_x, t_y, xflip, yflip, rotateDegree) 
{
    push();
    translate(t_x,t_y);
    rotate(rotateDegree * (PI/180));
    stroke(0);
    fill(0, 184, 230); 
    ellipse(-25*xflip,-5*yflip, 10,10); // roller wheel
    ellipse(25*xflip,-5*yflip, 10,10);  // roller wheel

    strokeWeight(4);
    point(-25*xflip,-5*yflip); 
    point(25*xflip,-5*yflip);

    strokeWeight(0.67); fill(51, 51, 153);
    beginShape();
    curveVertex(-45*xflip,-16*yflip);
    curveVertex(-60*xflip,-20*yflip);
    curveVertex(-40*xflip,-12*yflip);
    curveVertex(30*xflip,-12*yflip);
    curveVertex(52*xflip,-19*yflip);
    curveVertex(57.67*xflip,-28*yflip);
    curveVertex(30*xflip,-17*yflip);
    curveVertex(-40*xflip,-17*yflip);
    curveVertex(-61.5*xflip,-25.5*yflip);
    curveVertex(-60*xflip,-20*yflip);
    curveVertex(-60*xflip,-20*yflip);
    endShape();
    pop();
}

function draw_shoe(t_x,t_y,xflip,shoe_scale,rotateDegree,color)
{       
    push();
    strokeWeight(0.1*shoe_scale);
    translate(t_x, t_y);

    push();
    rotate(rotateDegree *(PI/180));
    stroke(0);

    fill(color);
    beginShape();
    curveVertex(0,0);
    curveVertex(0,0);
    curveVertex(xflip*-0.18*shoe_scale,5.4*shoe_scale);
    curveVertex(xflip*6*shoe_scale,6*shoe_scale);
    curveVertex(xflip*10.5*shoe_scale,6*shoe_scale);
    curveVertex(xflip*11.4*shoe_scale,3.6*shoe_scale); //point front up
    curveVertex(xflip*4.5*shoe_scale,0);
    curveVertex(xflip*2.1*shoe_scale,0.9*shoe_scale);
    curveVertex(0,0); // final point
    curveVertex(0,0);
    endShape();

    fill(204, 0, 0);
    beginShape();
    curveVertex(0,4.5*shoe_scale);
    curveVertex(xflip*-1*shoe_scale,4.5*shoe_scale);//99
    curveVertex(xflip*0.6*shoe_scale,6.3*shoe_scale);
    curveVertex(xflip*6*shoe_scale,6*shoe_scale);// bottom mid point
    curveVertex(xflip*10.5*shoe_scale,6*shoe_scale);
    curveVertex(xflip*11.7*shoe_scale,4.5*shoe_scale); //sepecial point front up
    curveVertex(xflip*9*shoe_scale,4.8*shoe_scale);
    curveVertex(xflip*6*shoe_scale,4.8*shoe_scale);
    curveVertex(xflip*-1*shoe_scale,4.5*shoe_scale); // final point//99
    curveVertex(0,4.5*shoe_scale);
    endShape();

    fill(220); stroke(0); strokeWeight(0.2*shoe_scale);

    x_toS = xflip*5.4*shoe_scale; y_toS = 0.3*shoe_scale;
    for (let i = 0; i < 3; i++)
    {

        push();
        translate(x_toS,y_toS);
        rotate((90+(20*xflip))*(PI/180));
        //fill(255);stroke(3); ellipse(6,0,3,3);

        stroke(204, 0, 0); strokeWeight(0.6*shoe_scale);
        line(0,0,1.8*shoe_scale,0);

        noFill();strokeWeight(0.2*shoe_scale); stroke(0);
        arc(1.8*shoe_scale,0,0.9*shoe_scale,1.05*shoe_scale, 240*(PI/180),130*(PI/180));

        pop();

        x_toS += 1.5*shoe_scale*xflip; y_toS += 0.69*shoe_scale;// y_tos 1.5 original x_tos original 3
    }

    ellipse(3.3*shoe_scale*xflip,3.9*shoe_scale,0.6*shoe_scale,0.6*shoe_scale);
    ellipse(4.8*shoe_scale*xflip,4.05*shoe_scale,0.6*shoe_scale,0.6*shoe_scale);

    pop();
    pop();
}

function D2R(t_degree)
{
    return t_degree *(PI/180);
}

// draw some scene
function draw_mountain(t_mountain)
{   

    for(var i = 0; i< t_mountain.length; i++)
    {   
        var x_pos = t_mountain[i].xpos;
        var mountain_scale = t_mountain[i].scale;

        if(mountain_scale < 0.5)
        {
            mountain_scale = 0;
        }
        push();
        translate(x_pos, floorPos_y-157);
        stroke('black'); strokeWeight(0.5);

        fill('#423337');
        beginShape();
        vertex(0,0); vertex(200*mountain_scale,-150*mountain_scale);
        vertex(294*mountain_scale,-86*mountain_scale);
        vertex(330*mountain_scale,-100*mountain_scale);
        vertex(440*mountain_scale,0);
        endShape();

        noStroke();

        fill('#63595C');
        beginShape();
        vertex(10*mountain_scale,0); 
        vertex(193*mountain_scale,-118*mountain_scale);
        vertex(160*mountain_scale,-70*mountain_scale); 
        vertex(178*mountain_scale,-62*mountain_scale);
        vertex(155*mountain_scale,-17*mountain_scale); 
        vertex(193*mountain_scale, -36*mountain_scale);
        vertex(174*mountain_scale,-12*mountain_scale);
        vertex(208*mountain_scale,-12*mountain_scale); 
        vertex(322*mountain_scale,-85*mountain_scale);
        vertex(312*mountain_scale,-59*mountain_scale); 
        vertex(325*mountain_scale,-65*mountain_scale);
        vertex(307*mountain_scale,-26*mountain_scale); 
        vertex(328*mountain_scale,-46*mountain_scale);
        vertex(316*mountain_scale,0);
        endShape(CLOSE);
        pop();
    }
}

function draw_tree(t_tree)
{   
    for(var i = 0; i < t_tree.length; i++)
    {   
        tree_scale = t_tree[i].scale;
        x_tree = t_tree[i].xpos;
        y_tree = floorPos_y - 150 - t_tree[i].ypos;
        push();
        translate(x_tree,y_tree);
        noStroke();
        fill(119, 212, 119); // lightest 65% leave part
        beginShape();
        curveVertex(-86* tree_scale ,-101* tree_scale);  
        curveVertex(-83* tree_scale ,-103* tree_scale); curveVertex(-101* tree_scale ,-109* tree_scale); 
        curveVertex(-118* tree_scale ,-130* tree_scale); curveVertex(-84* tree_scale ,-146* tree_scale);
        curveVertex(-83* tree_scale ,-181* tree_scale); curveVertex(-32* tree_scale ,-187* tree_scale);  
        curveVertex(-7* tree_scale ,-221* tree_scale);   curveVertex(37* tree_scale ,-210* tree_scale);   
        curveVertex(60* tree_scale ,-207* tree_scale);   curveVertex(59* tree_scale ,-173* tree_scale);   
        curveVertex(45* tree_scale ,-140* tree_scale);   curveVertex(-83* tree_scale ,-103* tree_scale);  
        curveVertex(-27* tree_scale ,-158* tree_scale);
        endShape();


        fill(81 , 200, 81) // 55 % 2nd leave part
        beginShape(); 
        curveVertex(-74* tree_scale,-127* tree_scale);  
        curveVertex(-76* tree_scale,-93* tree_scale);   curveVertex(-91* tree_scale,-104* tree_scale);
        curveVertex(-103* tree_scale,-113* tree_scale); curveVertex(-64* tree_scale,-126* tree_scale);
        curveVertex(-53* tree_scale,-155* tree_scale); curveVertex(-21* tree_scale,-156* tree_scale);
        curveVertex(-9* tree_scale,-178* tree_scale);   curveVertex(29* tree_scale,-178* tree_scale);
        curveVertex(53* tree_scale,-209* tree_scale);   curveVertex(72* tree_scale,-198* tree_scale);
        curveVertex(98* tree_scale,-196* tree_scale);   curveVertex(106* tree_scale,-169* tree_scale);
        curveVertex(142* tree_scale, -159* tree_scale); curveVertex(162* tree_scale,-137* tree_scale);
        curveVertex(140* tree_scale, -119* tree_scale); curveVertex(140* tree_scale,-92* tree_scale);
        curveVertex(55* tree_scale,-99* tree_scale);   curveVertex(-76* tree_scale,-93* tree_scale);
        curveVertex(-40* tree_scale,-91* tree_scale);
        endShape();

        fill(55, 174, 55); // 45% 3rd leave part
        beginShape();
        curveVertex(99* tree_scale,-140* tree_scale);
        curveVertex(25* tree_scale,-168* tree_scale);   curveVertex(11* tree_scale,-156* tree_scale);
        curveVertex(-12* tree_scale,-146* tree_scale); curveVertex(-19* tree_scale,-128* tree_scale);
        curveVertex(-9* tree_scale,-101* tree_scale);   curveVertex(-35* tree_scale,-110* tree_scale);
        curveVertex(-47* tree_scale,-98* tree_scale);   curveVertex(-68* tree_scale,-106* tree_scale);
        curveVertex(-78* tree_scale,-94* tree_scale);   curveVertex(-74* tree_scale,-90* tree_scale);
        curveVertex(-58* tree_scale,-81* tree_scale);   curveVertex(-28* tree_scale,-85* tree_scale);
        curveVertex(-6* tree_scale,-70* tree_scale);   curveVertex(21* tree_scale,-72* tree_scale);
        curveVertex(24* tree_scale,-68* tree_scale);   curveVertex(26* tree_scale,-82* tree_scale);
        curveVertex(78* tree_scale,-78* tree_scale);   curveVertex(92* tree_scale,-93* tree_scale);
        curveVertex(110* tree_scale,-86* tree_scale);   curveVertex(121* tree_scale,-91* tree_scale);
        curveVertex(136* tree_scale,-92* tree_scale);   curveVertex(113* tree_scale,-103* tree_scale);
        curveVertex(96* tree_scale,-120* tree_scale);   curveVertex(75* tree_scale,-122* tree_scale);
        curveVertex(74* tree_scale,-143* tree_scale);   curveVertex(54* tree_scale,-146* tree_scale);
        curveVertex(48* tree_scale,-164* tree_scale);   curveVertex(33* tree_scale,-164* tree_scale);
        curveVertex(25* tree_scale,-168* tree_scale);
        curveVertex(-9* tree_scale,-175* tree_scale);
        endShape();


        fill(43, 136, 43) // 35% 4th or last leave part
        beginShape();
        curveVertex(17* tree_scale,-147* tree_scale);
        curveVertex(9* tree_scale,-138* tree_scale);   curveVertex(23* tree_scale,-136* tree_scale);
        curveVertex(28* tree_scale,-152* tree_scale);   curveVertex(30* tree_scale,-138* tree_scale);
        curveVertex(26* tree_scale,-127* tree_scale);   curveVertex(29* tree_scale,-113* tree_scale);
        curveVertex(28* tree_scale,-90* tree_scale);   curveVertex(66* tree_scale,-127* tree_scale);
        curveVertex(57* tree_scale,-109* tree_scale);   curveVertex(44* tree_scale,-100* tree_scale);
        curveVertex(58* tree_scale,-105* tree_scale);   curveVertex(69* tree_scale,-113* tree_scale);
        curveVertex(70* tree_scale,-107* tree_scale);   curveVertex(66* tree_scale,-100* tree_scale);
        curveVertex(54* tree_scale,-93* tree_scale);   curveVertex(51* tree_scale,-88* tree_scale);
        curveVertex(72* tree_scale,-83* tree_scale);   curveVertex(78* tree_scale,-78* tree_scale);
        curveVertex(43* tree_scale,-71* tree_scale);   curveVertex(23* tree_scale,-76* tree_scale);
        curveVertex(28* tree_scale,-63* tree_scale);   curveVertex(17* tree_scale,-107* tree_scale);
        curveVertex(17* tree_scale,-122* tree_scale);   curveVertex(9* tree_scale,-138* tree_scale);
        curveVertex(15* tree_scale,-132* tree_scale);
        endShape();

        noStroke();

        fill('#906645'); // middle color whole trunk
        beginShape();
        vertex(0,0);
        curveVertex(0,0);       
        curveVertex(50* tree_scale,0);
        curveVertex(58* tree_scale,-1* tree_scale);     curveVertex(55* tree_scale,-5* tree_scale);
        curveVertex(45* tree_scale,-5* tree_scale);     curveVertex(35* tree_scale,-5* tree_scale);
        curveVertex(34* tree_scale,-14* tree_scale);   curveVertex(35* tree_scale,-28* tree_scale);
        curveVertex(33* tree_scale,-45* tree_scale);   curveVertex(34* tree_scale,-71* tree_scale);
        curveVertex(33* tree_scale,-91* tree_scale);   curveVertex(59* tree_scale,-103* tree_scale);
        curveVertex(70* tree_scale,-111* tree_scale);   curveVertex(68* tree_scale,-113* tree_scale);
        curveVertex(55* tree_scale,-105* tree_scale);   curveVertex(46* tree_scale,-104* tree_scale);
        curveVertex(59* tree_scale,-115* tree_scale);   curveVertex(69* tree_scale,-130* tree_scale);
        curveVertex(66* tree_scale,-131* tree_scale);   curveVertex(56* tree_scale,-118* tree_scale);
        curveVertex(40* tree_scale,-106* tree_scale);   curveVertex(35* tree_scale,-100* tree_scale);
        curveVertex(22* tree_scale,-97* tree_scale);   curveVertex(20* tree_scale,-120* tree_scale);
        curveVertex(28* tree_scale,-140* tree_scale);   curveVertex(28* tree_scale,-153* tree_scale);
        curveVertex(20* tree_scale,-132* tree_scale);   curveVertex(5* tree_scale,-141* tree_scale);
        curveVertex(-6* tree_scale,-141* tree_scale);   curveVertex(-6* tree_scale,-140* tree_scale);
        curveVertex(5* tree_scale,-138* tree_scale);   curveVertex(15* tree_scale,-124* tree_scale);
        curveVertex(14* tree_scale,-98* tree_scale);   curveVertex(20* tree_scale,-73* tree_scale);
        curveVertex(15* tree_scale,-33* tree_scale);   curveVertex(16* tree_scale,-8* tree_scale);
        curveVertex(-2* tree_scale,-6* tree_scale);     
        curveVertex(0,0);
        curveVertex(16* tree_scale,-3* tree_scale);
        endShape();

        noStroke();
        fill("#A27957"); // left most trunk
        beginShape();
        curveVertex(0,0);  
        curveVertex(0,0);       
        curveVertex(13* tree_scale,0);
        curveVertex(36* tree_scale,0);     curveVertex(26* tree_scale,-6* tree_scale);
        curveVertex(21* tree_scale,-35* tree_scale);   curveVertex(24* tree_scale,-60* tree_scale);
        curveVertex(22* tree_scale,-83* tree_scale);   curveVertex(17* tree_scale,-101* tree_scale);
        curveVertex(17* tree_scale,-118* tree_scale);   curveVertex(17* tree_scale,-130* tree_scale);
        curveVertex(5* tree_scale,-141* tree_scale);   curveVertex(-6* tree_scale,-141* tree_scale);
        curveVertex(-6* tree_scale,-140* tree_scale);   curveVertex(5* tree_scale,-138* tree_scale);
        curveVertex(15* tree_scale,-124* tree_scale);   curveVertex(14* tree_scale,-98* tree_scale);
        curveVertex(20* tree_scale,-73* tree_scale);   curveVertex(15* tree_scale,-33* tree_scale);
        curveVertex(16* tree_scale,-8* tree_scale);     curveVertex(-2* tree_scale,-6* tree_scale);
        curveVertex(0,0);
        curveVertex(16* tree_scale,-3* tree_scale);
        endShape();


        noStroke();
        fill('#764F2F'); //right most trunk
        beginShape();
        curveVertex(0,0)
        curveVertex(50* tree_scale,0);     
        curveVertex(50* tree_scale,0);
        curveVertex(58* tree_scale,-1* tree_scale);     curveVertex(55* tree_scale,-5* tree_scale);
        curveVertex(45* tree_scale,-5* tree_scale);     curveVertex(35* tree_scale,-5* tree_scale);
        curveVertex(34* tree_scale,-14* tree_scale);   curveVertex(35* tree_scale,-28* tree_scale);
        curveVertex(33* tree_scale,-45* tree_scale);   curveVertex(34* tree_scale,-71* tree_scale);
        curveVertex(33* tree_scale,-91* tree_scale);   curveVertex(59* tree_scale,-103* tree_scale);
        curveVertex(70* tree_scale,-111* tree_scale);   curveVertex(68* tree_scale,-113* tree_scale);
        curveVertex(55* tree_scale,-105* tree_scale);   curveVertex(46* tree_scale,-104* tree_scale);
        curveVertex(59* tree_scale,-115* tree_scale);   curveVertex(69* tree_scale,-130* tree_scale);
        curveVertex(66* tree_scale,-131* tree_scale);   curveVertex(56* tree_scale,-118* tree_scale);
        curveVertex(40* tree_scale,-106* tree_scale);   curveVertex(37* tree_scale,-102* tree_scale);
        curveVertex(33* tree_scale,-99* tree_scale);   curveVertex(25* tree_scale,-94* tree_scale);
        curveVertex(28* tree_scale,-82* tree_scale);   curveVertex(31* tree_scale,-62* tree_scale);
        curveVertex(29* tree_scale,-32* tree_scale);   curveVertex(34* tree_scale,-6* tree_scale);
        curveVertex(43* tree_scale,-4* tree_scale);     curveVertex(50* tree_scale,0);
        curveVertex(60* tree_scale,0);
        endShape();

        pop(); 
    }   

}



