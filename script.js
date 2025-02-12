const img = document.querySelector("#movable");  // Select the image
let posX = 50;  // Starting position on X-axis
let posY = 50;  // Starting position on Y-axis
let speed = 0;  // Initial speed
let acceleration = 0.05;  // Rate at which speed increases
let deceleration = 0.05;  // Rate at which speed decreases when no key is pressed

let movingUp = false, movingDown = false, movingLeft = false, movingRight = false;  // Track key states
let last_touched = '';  // Track the last direction the image was moving in

function moveImage() {
    // Move based on key states
    if (movingUp) {
        posY -= speed;  // Move up
        last_touched = "up";  // Record last movement direction
    }
    if (movingDown) {
        posY += speed;  // Move down
        last_touched = "down";  // Record last movement direction
    }
    if (movingLeft) {
        posX -= speed;  // Move left
        last_touched = "left";  // Record last movement direction
    }
    if (movingRight) {
        posX += speed;  // Move right
        last_touched = "right";  // Record last movement direction
    }

    // If no keys are pressed, move in the last direction and apply deceleration
    if (!movingUp && !movingDown && !movingLeft && !movingRight && last_touched) {
        if (last_touched === "up") posY -= speed;
        if (last_touched === "down") posY += speed;
        if (last_touched === "left") posX -= speed;
        if (last_touched === "right") posX += speed;
        
        // Apply deceleration when no key is pressed
        speed = Math.max(0, speed - deceleration);
    }

    // Apply the new position to the image
    img.style.transform = `translate(${posX.toFixed(2)}px, ${posY.toFixed(2)}px)`;  
    document.getElementById("output").textContent = `Speed: ${speed.toFixed(2)}`;
}

function handleArrowKeys(event) {
    switch (event.key) {
        case "ArrowUp":
            movingUp = true;
            movingDown = false;
            movingLeft = false;
            movingRight = false;
            last_touched = "up";  // Record the last movement direction
            break;
        case "ArrowDown":
            movingDown = true;
            movingUp = false;
            movingLeft = false;
            movingRight = false;
            last_touched = "down";  // Record the last movement direction
            break;
        case "ArrowLeft":
            movingLeft = true;
            movingUp = false;
            movingDown = false;
            movingRight = false;
            last_touched = "left";  // Record the last movement direction
            break;
        case "ArrowRight":
            movingRight = true;
            movingUp = false;
            movingDown = false;
            movingLeft = false;
            last_touched = "right";  // Record the last movement direction
            break;
    }
}

function stopMovement(event) {
    switch (event.key) {
        case "ArrowUp":
            movingUp = false;
            break;
        case "ArrowDown":
            movingDown = false;
            break;
        case "ArrowLeft":
            movingLeft = false;
            break;
        case "ArrowRight":
            movingRight = false;
            break;
    }
}

function updateSpeed() {
    // If keys are pressed, accelerate
    if (movingUp || movingDown || movingLeft || movingRight) {
        speed += acceleration;  // Increase speed
    }
    // Optional: Add a maximum speed cap (e.g., max speed of 10)
    speed = Math.min(speed, 10);  // Cap the speed to 10 (adjust this value as needed)
}

function animate() {
    updateSpeed();  // Update speed
    moveImage();  // Move the image
    requestAnimationFrame(animate);  // Loop the animation
}

document.addEventListener("keydown", handleArrowKeys); 
document.addEventListener("keyup", stopMovement);  




animate(); 
