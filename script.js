const img = document.querySelector("#movable");
let posX = 50;  // X position
let posY = 50;  // Y position
let speed = 0;  // Speed starts at 0
let acceleration = 0.2;  // Acceleration rate
let deceleration = 0.05; // Deceleration rate
let rotation = 0;  // Rotation angle
let maxSpeed = 10;  // Limit max speed
let brakespeed = 1;

let movingForward = false;
let turningLeft = false;
let turningRight = false;
let brake = false;
function moveImage() {
    if (movingForward) {
        speed = Math.min(maxSpeed, speed + acceleration); // Increase speed with acceleration
    } else {
        speed = Math.max(0, speed - deceleration); // Apply deceleration
    } 
    if (brake) {
        speed = Math.max(0, speed - brakespeed);  // Braking deceleration (faster stop)
    } else {
        speed = Math.max(0, speed - deceleration);  // Regular deceleration
    }
 
    // Convert rotation angle to movement direction
    let angleRad = (rotation * Math.PI) / 180; // Convert degrees to radians
    let velocityX = Math.cos(angleRad) * speed;
    let velocityY = Math.sin(angleRad) * speed;

    // Apply movement
    posX += velocityX;
    posY += velocityY;

    // Apply rotation (only on left/right)
    if (turningLeft) rotation -= 3;  // Adjust rotation speed as needed
    if (turningRight) rotation += 3;

    // Apply transform (move + rotate)
    img.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px) rotate(${rotation}deg)`;

    requestAnimationFrame(moveImage);
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

moveImage();  // Start the animation loop
