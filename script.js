const img = document.getElementById("movable");
let posX = 50;
let posY = 50;
let speed = 0;
let acceleration = 0.2;
let deceleration = 0.05;
let rotation = 0;
let maxSpeed = 10;
let brakespeed = 1;

const obstacle = document.getElementById("obstacle");
const hole = document.getElementById("hole");
const hiddenLink = document.getElementById("hiddenLink");
const minSize = 20; 

let movingForward = false;
let turningLeft = false;
let turningRight = false;
let brake = false;
let limit = 50;
let redirect = false; // Track if redirection has occurred


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
    } else {
        img.src = "lucacar.png";
    }
    
    // Resizing the car based on distance to the hole
    let scaleFactor = calculateScale(img, hole);
    console.log('Scale Factor:', scaleFactor);  // Debugging output
    img.style.width = `${scaleFactor}px`;
    img.style.height = `${scaleFactor}px`;

    // Check if the car is at the center of the hole and trigger redirection once
    if (isCenter(img, hole) && !redirect) {
        hiddenLink.click();  // Redirect to another page
        redirect = true; // Prevent further redirection
    }
   
    let attraction_distance_and_angle  = get_distance_and_angle(img,hole);
    att_posx = 0
    att_posY = 0

    document.getElementById("feedback").innerHTML = ` Touching title text: ${checkCollision(img,obstacle)} <br>`
    document.getElementById("feedback").innerHTML += ` Touching hole image: ${checkCollision(img,hole)} <br>`
    document.getElementById("feedback").innerHTML += ` Dir: : ${rotation} deg`


    img.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px) rotate(${rotation}deg)`;
    document.getElementById("obstacle").textContent=`${speed.toFixed(2)}`;

    requestAnimationFrame(moveImage);
}


function get_distance_and_angle(obj1, obj2) {
    // Calculate distance between the centers of the objects
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

    // Adjust scaling to prevent extreme resizing
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

    let threshold = 40;
    return Math.abs(centerX1 - centerX2) < threshold && Math.abs(centerY1 - centerY2) < threshold;
}

function handleKeyDown(event) {
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
    }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Start moving the image
moveImage();
