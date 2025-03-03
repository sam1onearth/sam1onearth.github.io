const img = document.getElementById("movable");
let posX = 50;
let posY = 50;
let speed = 0;
let acceleration = 0.2;
let deceleration = 0.05;
let rotation = 0;
let maxSpeed = 10.05;
let brakespeed = 1;
let clicked = false;

const obstacle = document.getElementById("obstacle");
const hole = document.getElementById("hole");
const hiddenLink = document.getElementById("hiddenLink");
const minSize = 20; 
const feedback = document.getElementById("feedback");

let movingForward = false;
let turningLeft = false;
let turningRight = false;
let brake = false;
let limit = 50;
let redirect = false; // Track if redirection has occurred

let dragged = false;


function moveImage() {if (movingForward) {speed = Math.min(maxSpeed, speed + acceleration);} else {speed = Math.max(0, speed - deceleration);}if (brake) {speed = Math.max(0, speed - brakespeed);} else {speed = Math.max(0, speed - deceleration);}
    
    let angle = (rotation * Math.PI) / 180;

    let speedX = Math.cos(angle) * speed;let speedY = Math.sin(angle) * speed;

    // Bit of trigonometery
    posX += speedX;
    posY += speedY;

    if (turningLeft) rotation -= 5;
    if (turningRight) rotation += 5;
   

    if (checkCollision(img, obstacle)) {
        img.src = "lucacar2.png";
    } else {
        img.src = "lucacar.png";
    }
    if (checkCollision(img, hole)) {
        img.src = "lucacar2.png";
        if(movingForward){rotation +=1.5;}
    } else {
        img.src = "lucacar.png";
    }
  
    // Resizing the car based on distance to the hole
    let scaleFactor = calculateScale(img, hole);

    img.style.width = `${scaleFactor}px`;
    img.style.height = `${scaleFactor}px`;

    if (isCenter(img, hole) && !redirect) {
        hiddenLink.click();  // Redirect to another page
        redirect = true; 
    }
   
    let attraction_distance_and_angle  = get_distance_and_angle(img,hole);
    att_posx = 0
    att_posY = 0

    document.getElementById("feedback").innerHTML = ` Touching title text: ${checkCollision(img,obstacle)} <br>`
    document.getElementById("feedback").innerHTML += ` Touching hole image: ${checkCollision(img,hole)} <br>`
    document.getElementById("feedback").innerHTML += ` Dir: : ${Math.abs(rotation%360).toFixed(0)} deg <br>`
   
    document.getElementById("feedback").innerHTML += ` PosX: ${posX.toFixed(2)} <br>`
    document.getElementById("feedback").innerHTML += ` PosY: ${posY.toFixed(2)} `


    img.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px) rotate(${rotation}deg)`;
    document.getElementById("obstacle").textContent=`${speed.toFixed(2)}`;

    requestAnimationFrame(moveImage);
}

/*
Main loop above, function defenition, and running down
*/



function get_distance_and_angle(obj1, obj2) {
    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();
    
    let widh = rect2.width-rect1.width
    let hidh = rect2.height-rect1.height
    let centerX1 = rect1.left + rect1.width / 2;
    let centerY1 = rect1.top + rect1.height / 2;
    let centerX2 = rect2.left + rect2.width / 2;
    let centerY2 = rect2.top + rect2.height / 2;

    return {"distance": Math.hypot(centerX2 - centerX1, centerY2 - centerY1) <= limit,"angle":Math.sin(widh/hidh)}
}

function calculateScale(obj1, obj2) {
    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    let centerX1 = rect1.left + rect1.width / 2;
    let centerY1 = rect1.top + rect1.height / 2;
    let centerX2 = rect2.left + rect2.width / 2;
    let centerY2 = rect2.top + rect2.height / 2;

    let distance = Math.hypot(centerX2 - centerX1, centerY2 - centerY1);
    let maxDistance = Math.max(rect2.width, rect2.height);

    let scale = Math.max(minSize, Math.min(100, 100 * (distance / maxDistance)));

    return scale;
}

function checkCollision(obj1, obj2) {
    if (!obj1 || !obj2) return false;

    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function isCenter(obj1, obj2) {
    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    let centerX1 = rect1.left + rect1.width / 2;
    let centerY1 = rect1.top + rect1.height / 2;
    let centerX2 = rect2.left + rect2.width / 2;
    let centerY2 = rect2.top + rect2.height / 2;

    let threshold = 45;
    return Math.abs(centerX1 - centerX2) < threshold && Math.abs(centerY1 - centerY2) < threshold;
}

function Down(event) {
    switch (event.key) {
        case "ArrowUp":
            movingForward = true;
            break;
        case "ArrowDown":
            brake = true;
            break;
        case "ArrowLeft":
            turningLeft = true;
            break;
        case "ArrowRight":
            turningRight = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case "ArrowUp":
            movingForward = false;
            break;
        case "ArrowDown":
            brake = false;
            break;
        case "ArrowLeft":
            turningLeft = false;
            break;
        case "ArrowRight":
            turningRight = false;
            break;
    }}

document.addEventListener("keydown", Down);
document.addEventListener("keyup", handleKeyUp);

// Start moving the image
moveImage();
