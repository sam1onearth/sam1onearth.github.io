const img = document.querySelector("#movable");
let posX = 50;  // X position
let posY = 50;  // Y position
let speed = 0;  // Speed starts at 0
let acceleration = 0.2;  // Acceleration rate
let deceleration = 0.05; // Deceleration rate
let rotation = 0;  // Rotation angle
let maxSpeed = 10;  // Limit max speed
let brakespeed = 1;
const obstacle = document.querySelector("#obstacle"); // The object to check collision with
const hole = document.querySelector("#hole");
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
    }let angle = (rotation * Math.PI) / 180; // Convert degrees to radians
    let speedX = Math.cos(angle) * speed;
    let speedY = Math.sin(angle) * speed;

    // Apply movement
    posX += speedX;
    posY += speedY;

    // Apply rotation (only on left/right)
    if (turningLeft) rotation -= 3;  // Adjust rotation speed as needed
    if (turningRight) rotation += 3;
    //Apply collision

    if (checkCollision(img, obstacle)) {
        img.src = "lucacar2.png"; // 
    } else {img.src="lucacar.png"}
    if (checkCollision(img,hole)){
        img.src = "lucacar2.png"; // 
        img.height -=10;
        img.width -=10;
    } else {img.src="lucacar.png";
        img.height = 50;
        img.width = 50;
    }
    
   




function checkCollision(obj1, obj2) {
        try {
            let rect1 = obj1.getBoundingClientRect();
            let rect2 = obj2.getBoundingClientRect();
    
            return !(
                rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom
            );
        } catch (error) {
            return false;  // If an error occurs (element not found), return false
        }
    }
    // Check if the object is at the center of another object
    function isCenter(obj1, obj2) {
        let rect1 = obj1.getBoundingClientRect();
        let rect2 = obj2.getBoundingClientRect();
    
        let centerX1 = rect1.left + rect1.width / 2;
        let centerY1 = rect1.top + rect1.height / 2;
        let centerX2 = rect2.left + rect2.width / 2;
        let centerY2 = rect2.top + rect2.height / 2;
    
        let threshold = 10;  // Sensitivity for being at the center
        return Math.abs(centerX1 - centerX2) < threshold && Math.abs(centerY1 - centerY2) < threshold;
    }


    img.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px) rotate(${rotation}deg)`;

    requestAnimationFrame(moveImage);
}

function checkCollision(obj1, obj2) {
    if (!obj1 || !obj2) return false;  // Avoid errors if elements are missing

    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    console.log("Rect1:", rect1); // Log for debugging
    console.log("Rect2:", rect2); // Log for debugging

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

    let threshold = 10; // Adjust sensitivity
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

moveImage();  // Start the animation loop
