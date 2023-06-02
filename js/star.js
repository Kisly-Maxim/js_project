const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let screenWidth = 0;
let screenHeight = 0;

screenWidth = screen.width;
screenHeight = screen.height;

canvas.width = screenWidth;
canvas.height = screenHeight;

let stars = []; // массив звезд
const starCount = screenWidth; // количество звезд

for (let i = 0; i < starCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2;
    const opacity = Math.random();
    stars.push({ x, y, size, opacity });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
        const { x, y, size, opacity } = star;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        star.opacity += Math.random() * 0.2 - 0.1;
        if (star.opacity < 0) {
            star.opacity = 0;
        }
        if (star.opacity > 1) {
            star.opacity = 1;
        }
    });

    requestAnimationFrame(draw);
}

draw();
