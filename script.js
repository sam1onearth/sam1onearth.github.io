const img = document.querySelector("#movable");
let posX = 50;
let posY = 50;
let speed = 0;
let acceleration = 0.2;
let deceleration = 0.05;
let rotation = 0;
let maxSpeed = 10;
let brakespeed = 1;


const obstacle = document.querySelector("#obstacle");
const hole = document.querySelector("#hole");
const hiddenLink = document.querySelector("#hiddenLink"); // Hidden link for redirection
const originalSize = 65;
const minSize = 20; // Minimum size when falling into the hole
let movingForward = false;
let turningLeft = false;
let turningRight = false;
let brake = false;
let limit = 50;
let hasRedirected = false; // Track if redirection has occurred

function moveImage() {
    if (movingForward) {
        speed = Math.min(maxSpeed, speed + acceleration);
    } else {
        speed = Math.max(0, speed - deceleration);
    }
    if (brake) {
        speed = Math.max(0, speed - brakespeed);
    } else {
        speed = Math.max(0, speed - deceleration);
    }
    
    let angle = (rotation * Math.PI) / 180;
    let speedX = Math.cos(angle) * speed;
    let speedY = Math.sin(angle) * speed;

    posX += speedX;
    posY += speedY;

    if (turningLeft) rotation -= 3;
    if (turningRight) rotation += 3;

    // Collision handling
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
    img.style.width = `${scaleFactor}px`;
    img.style.height = `${scaleFactor}px`;

    // Check if the car is at the center of the hole and trigger redirection once
    if (isCenter(img, hole) && !hasRedirected) {
        hiddenLink.click();  // Redirect to another page
        hasRedirected = true; // Prevent further redirection
    }

    img.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px) rotate(${rotation}deg)`;
    
    requestAnimationFrame(moveImage);
}

function get_distance(obj1, obj2) {
    // Calculate distance between the centers of the objects
    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    let centerX1 = rect1.left + rect1.width / 2;
    let centerY1 = rect1.top + rect1.height / 2;
    let centerX2 = rect2.left + rect2.width / 2;
    let centerY2 = rect2.top + rect2.height / 2;

    return Math.hypot(centerX2 - centerX1, centerY2 - centerY1) <= limit;
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

    return Math.max(minSize, Math.min(originalSize, originalSize * (distance / maxDistance)));
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

    let threshold = 50;
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

moveImage();
