const canvas = document.getElementById("bgCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    let width, height;
    const gradientColors = [
        { stop: 0, color: "rgba(10, 0, 80, 1)" },
        { stop: 0.4, color: "rgba(0, 50, 200, 0.8)" },
        { stop: 0.7, color: "rgba(0, 150, 150, 0.6)" },
        { stop: 1, color: "rgba(0, 180, 50, 0.4)" }
    ];

    const waves = []; 
    const mouse = { x: 0, y: 0 }; 

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        mouse.x = width / 2;
        mouse.y = height / 2;
    }
    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        if (Math.random() > 0.1) {
            waves.push({ 
                x: mouse.x, 
                y: mouse.y, 
                r: 5,   
                maxR: 150, 
                alpha: 1 
            });
        }
    });
    
    function drawBackground() {
        ctx.save();
        ctx.filter = "blur(40px) brightness(0.8)"; 

        const gradient = ctx.createRadialGradient(
            width * 0.7, height * 0.5, 100, 
            width * 0.7, height * 0.5, Math.max(width, height) * 0.8 
        );
        
        gradientColors.forEach(gc => {
            gradient.addColorStop(gc.stop, gc.color);
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();
    }

    function drawRipples() {
        for (let i = 0; i < waves.length; i++) {
            const w = waves[i];
            
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
            
            w.alpha = 1 - (w.r / w.maxR);
            ctx.strokeStyle = `rgba(255, 255, 255, ${w.alpha * 0.7})`; 
            ctx.lineWidth = 2 + (w.r / w.maxR) * 3; 
            
            ctx.stroke();
            
            w.r += 4; 

            if (w.r > w.maxR || w.alpha < 0.05) {
                waves.splice(i, 1);
                i--;
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height); 
        
        drawBackground();
        drawRipples();
        
        requestAnimationFrame(animate);
    }

    drawBackground(); 
    animate();
}