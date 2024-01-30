/*
on startup image needs to move from top left to bottom right
    from there onward it needs to move in the opposite direction
    every time it hits a wall or the paddle (except bottom wall)

    I think a function to handle when the object hits a wall which
    looks at direction/what part of image exceeded bounds of body
    to determine how the image should redirect

    ie img_current_position = x, y
    if x > max_leftX || y > max_LeftY
        //do something

    inside this function I could also check to see if it hit bottom 
    limit and when that happens call a function that gives the 
    x, y position of paddle to determine if the user saved the puppy
    or if they didnt, reset the score and timer

    it is important to remember that we only need to check paddle 
    position if Y >= theBody.offsetHeight

    randomly generated puppy image is 300x200 so image height is 200 + 2(5)
    because the border is 5 mm around image ie top 5 and bottom 5 
*/
let theBody=document.querySelector('body');
let theImg=document.querySelector('img');
let theX=0; 
let theY=0;
let speedX = 5;
let speedY = 5;

let game_over = false;
let score = 0;

let user_start_time;

function get_paddle_position() {
  var paddle = document.getElementById('paddle');
  var paddle_bounds = paddle.getBoundingClientRect();

  var paddle_position = {
    left: paddle_bounds.left,
    right: paddle_bounds.right,
    bottom: paddle_bounds.bottom,
    top: paddle_bounds.top
  };
  return paddle_position;
}


function get_image_position() {
  var puppy = document.getElementById('puppy')
  var image_bounds = puppy.getBoundingClientRect();
  var image_positions = {
    top: image_bounds.top,
    left: image_bounds.left,
    right: image_bounds.right,
    bottom: image_bounds.bottom
  };

  return image_positions;
}

function check_image_in_bounds() {

  body_height = theBody.offsetHeight;
  curr_image_position = get_image_position();

  if(curr_image_position.bottom > body_height) {
    game_over = true;
  }
}

function check_game_over() {
  check_image_in_bounds();
  if(game_over) {
    //need to stop image from moving
    speedX = 0;
    speedY= 0;
  }
}

function updateX() {
  theX+=speedX;
  if(theX<0 || theX + theImg.offsetWidth > theBody.offsetWidth) {
    speedX *= -1;
  }
  theImg.style.left=`${theX}px`;
}

function updateY() { 
  //for Y we only need to redirect if it hits roof
  //if it hits bottom that's the paddle, seperate issue
  theY+=speedY;
  if(theY<0){
    speedY *= -1;
  }

  curr_image_position = get_image_position();
  curr_paddle_location = get_paddle_position();
  //to prevent paddle hitting image twice and double redirecting it
  //we need to stop the image from going below the height of the paddle                       

  //theY specifies a Y location, it is the height where the 
  //top left of the image gets placed. We need to prevent
  //image from going below paddle if paddle is in the right 
  //location

  image_bottom = theY + 199;

  if(image_bottom >= (curr_paddle_location.top-5) && image_bottom < curr_paddle_location.top) {

    paddle_left_loc = curr_paddle_location.left;
    paddle_right_loc = curr_paddle_location.right;
    paddle_top = curr_paddle_location.top;

    /*3 cases for a valid block: 
        1. right side of paddle bound is within image bound
        2. left side of paddle bound is within image bound
        3. right paddle bound is within left bound
    */

    image_left_loc = curr_image_position.left;
    image_right_loc = curr_image_position.right;
    image_bottom = curr_image_position.bottom;

    //case 1: verify paddle right bound is within bound of image
    if(image_left_loc < paddle_right_loc && paddle_right_loc < image_right_loc && paddle_left_loc < image_left_loc ) {
      speedY=speedY* -1.3; //flip travel direction 
      score++; //successful block so increment score
      console.log(speedY);
    }

    //case 2: verify left bound of paddle is within image bounds
    if(image_right_loc > paddle_left_loc && paddle_left_loc > image_left_loc && paddle_right_loc > image_right_loc) {
      speedY=speedY* -1.3; //flip travel direction 
      score++; //successful block so increment score
      console.log(speedY);
    }

    //case 3: entire paddle is within image
    if(image_right_loc > paddle_right_loc && paddle_left_loc > image_left_loc) {
      speedY=speedY* -1.3; //flip travel direction n 
      console.log(speedY);
      score++; //successful block so increment score
      //for some reason if paddle blocks image in middle
      //the score increments by 3 instead of 1 so remove extra 2 points
    }
  }

  theImg.style.top=`${theY}px`;
}

function move_paddle() {
    document.addEventListener('mousemove', function(event){ 
        var user_paddle = document.getElementById('paddle');
        user_paddle.style.left = (event.clientX - paddle.offsetWidth / 2) + 'px';
    });
}

function get_start_time() { 
  var start_time = new Date();
  return start_time;
}

document.addEventListener('DOMContentLoaded', function(event) {
  user_start_time = get_start_time();
});



function calculate_time() { 
  let current_time = new Date();
  var duration = current_time - user_start_time;
  var seconds = Math.floor(duration / 1000);
  return seconds;
}

function update_time() {
  elapsed_time = calculate_time();
  document.getElementById('user_time').value = elapsed_time;
}


function update_score() {
  document.getElementById('user_score').value = score;
}

setInterval(function() {
  update_score();
  if(!game_over) { //continue tracking time if game_over = false
    update_time();
  }
  updateX();
  updateY();
  move_paddle();
  check_game_over();
},20);

