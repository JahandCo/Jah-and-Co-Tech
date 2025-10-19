/**
 * particles-connect.js
 * * Creates a floating particle animation with lines connecting nearby particles.
 * The lines fade in and out based on particle proximity.
 */
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        console.error('Particle canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    // --- Configurable Settings ---
    const settings = {
        particleCount: 60,       // Number of particles
        particleColor: 'rgba(0, 229, 255, 0.7)', // Neon cyan
        particleRadius: 2,       // Radius of particles
        particleSpeed: 0.5,      // Max speed
        lineColor: 'rgba(0, 229, 255, 1)',  // Neon cyan for lines
        connectDistance: 120     // Max distance to draw a line
    };
    // ----------------------------

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = settings.particleRadius;
            this.speedX = (Math.random() * 2 - 1) * settings.particleSpeed;
            this.speedY = (Math.random() * 2 - 1) * settings.particleSpeed;
        }

        // Draw the particle
        draw() {
            ctx.fillStyle = settings.particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Update particle position and handle wall bouncing
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    // Create all particles
    function init() {
        particlesArray = [];
        let count = (canvas.height * canvas.width) / 15000; // Responsive particle count
        settings.particleCount = count < 30 ? 30 : (count > 80 ? 80 : count); // Min 30, Max 80

        for (let i = 0; i < settings.particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Connect particles with lines
    function connect() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // If particles are close enough, draw a line
                if (distance < settings.connectDistance) {
                    // Calculate opacity based on distance (fades out)
                    const opacity = 1 - (distance / settings.connectDistance);
                    
                    // Use the line color and apply calculated opacity
                    // This creates the "fade" effect
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connect(); // Draw the lines
        
        requestAnimationFrame(animate);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); // Re-initialize particles for new size
    });

    // Start
    init();
    animate();
});