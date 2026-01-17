'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
    x: number;
    y: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
    targetOpacity: number;
    isScared: boolean;
}

export const BackgroundParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let dots: Particle[] = [];
        let predator = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: 0,
            vy: 0,
            radius: 25,
            isSmiling: true,
            mouthOpen: 0, // 0 to 1
            speed: 12,
        };

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let frameCount = 0;
        let activeTimer = 0;
        let respawnTimer = 0;

        const dotCountPerCluster = 40;
        const clusterCount = 4;

        const createDot = (centerX: number, centerY: number): Particle => ({
            x: centerX + (Math.random() - 0.5) * 150,
            y: centerY + (Math.random() - 0.5) * 150,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 2,
            color: '#10b981',
            opacity: 0,
            targetOpacity: Math.random() * 0.15 + 0.05,
            isScared: false,
        });

        const init = () => {
            // Re-capture dimensions
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            dots = [];
            // Randomize cluster positions for the new wave
            for (let i = 0; i < clusterCount; i++) {
                const cx = Math.random() * (width - 300) + 150;
                const cy = Math.random() * (height - 300) + 150;
                for (let j = 0; j < dotCountPerCluster; j++) {
                    dots.push(createDot(cx, cy));
                }
            }
        };

        const drawSmiley = (x: number, y: number, radius: number, isSmiling: boolean, mouthOpen: number) => {
            ctx.save();
            ctx.translate(x, y);

            // Outer Circle
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'; // Extreme light stroke
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.01)'; // Extreme light fill
            ctx.fill();

            // Eyes (Arcs like in the image)
            const eyeSize = radius * 0.4;
            const eyeY = -radius * 0.1;
            const eyeX = radius * 0.4;

            // Left Eye
            ctx.beginPath();
            ctx.arc(-eyeX, eyeY, eyeSize / 2, Math.PI, 0);
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // Extreme light eye stroke

            // Right Eye
            ctx.beginPath();
            ctx.arc(eyeX, eyeY, eyeSize / 2, Math.PI, 0);
            ctx.lineWidth = 4;
            ctx.stroke();

            // Mouth
            if (isSmiling) {
                // Wide Smile
                ctx.beginPath();
                ctx.arc(0, radius * 0.1, radius * 0.6, 0.2 * Math.PI, 0.8 * Math.PI);
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.stroke();
            } else {
                // Eating / O Mouth - small circle that pulses (ham ham)
                const mouthSize = radius * (0.15 + mouthOpen * 0.15);
                ctx.beginPath();
                ctx.arc(0, radius * 0.4, mouthSize, 0, Math.PI * 2);
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            // Cheeks (the cyan circles from the image)
            ctx.beginPath();
            ctx.arc(-radius * 0.6, radius * 0.1, radius * 0.2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(45, 212, 191, 0.1)'; // Extreme light cyan
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(radius * 0.6, radius * 0.1, radius * 0.2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(45, 212, 191, 0.1)';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.restore();
        };

        const update = () => {
            frameCount++;
            let nearestDotIdx = -1;
            let minDist = Infinity;

            // Targeting: Nearest NON-scared dot
            dots.forEach((dot, idx) => {
                if (dot.isScared) return;
                const dx = dot.x - predator.x;
                const dy = dot.y - predator.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    minDist = dist;
                    nearestDotIdx = idx;
                }
            });

            if (nearestDotIdx !== -1) {
                const target = dots[nearestDotIdx];
                const dx = target.x - predator.x;
                const dy = target.y - predator.y;
                const angle = Math.atan2(dy, dx);

                predator.vx = Math.cos(angle) * predator.speed;
                predator.vy = Math.sin(angle) * predator.speed;
                predator.isSmiling = false;
                predator.mouthOpen = (Math.sin(frameCount * 0.3) + 1) / 2;

                // Hit detection / Eating
                if (minDist < predator.radius) {
                    dots.splice(nearestDotIdx, 1);
                    // Probability of scattering the rest of the cluster on hit
                    if (Math.random() < 0.3) {
                        dots.forEach(d => {
                            const ddx = d.x - predator.x;
                            const ddy = d.y - predator.y;
                            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                            if (dist < 200) {
                                d.isScared = true;
                                const scatterAngle = Math.atan2(ddy, ddx);
                                const force = (200 - dist) / 10;
                                d.vx = Math.cos(scatterAngle) * force * 2;
                                d.vy = Math.sin(scatterAngle) * force * 2;
                                d.targetOpacity = 0;
                            }
                        });
                    }
                }
            } else {
                // Idle / Wandering state
                predator.isSmiling = true;
                predator.mouthOpen = 0;

                // Add some gentle wandering speed
                predator.vx += (Math.random() - 0.5) * 0.5;
                predator.vy += (Math.random() - 0.5) * 0.5;
                predator.vx *= 0.98;
                predator.vy *= 0.98;

                // If stuck or slow, give a push
                if (Math.abs(predator.vx) < 0.1) predator.vx = (Math.random() - 0.5) * 2;
                if (Math.abs(predator.vy) < 0.1) predator.vy = (Math.random() - 0.5) * 2;
            }

            predator.x += predator.vx;
            predator.y += predator.vy;

            // Dot Life Cycle: Vanish after 5 seconds
            if (dots.length > 0) {
                activeTimer++;
                if (activeTimer > 300) { // 5 seconds (60fps * 5)
                    dots.forEach(d => {
                        if (!d.isScared) {
                            d.isScared = true;
                            d.targetOpacity = 0;
                            const angle = Math.random() * Math.PI * 2;
                            d.vx = Math.cos(angle) * 15;
                            d.vy = Math.sin(angle) * 15;
                        }
                    });
                }
            }

            // Dots update
            for (let i = dots.length - 1; i >= 0; i--) {
                const dot = dots[i];

                // Fleeing logic (if not already scared)
                if (!dot.isScared) {
                    const dx = dot.x - predator.x;
                    const dy = dot.y - predator.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    // Reduced flee radius and added a slight delay/prob (not all flee perfectly)
                    if (dist < 100 && Math.random() < 0.8) {
                        const fleeAngle = Math.atan2(dy, dx);
                        const fleeForce = (100 - dist) * 0.08;
                        dot.vx += Math.cos(fleeAngle) * fleeForce;
                        dot.vy += Math.sin(fleeAngle) * fleeForce;
                    } else {
                        // Bug-like crawling: Add small random jitter
                        dot.vx += (Math.random() - 0.5) * 0.2;
                        dot.vy += (Math.random() - 0.5) * 0.2;
                    }
                }

                dot.x += dot.vx;
                dot.y += dot.vy;
                dot.vx *= 0.92; // Friction
                dot.vy *= 0.92;

                dot.opacity += (dot.targetOpacity - dot.opacity) * 0.1;

                // Remove dots that are scared and faded out
                if (dot.isScared && dot.opacity < 0.05) {
                    dots.splice(i, 1);
                }
            }

            // Screen wrap for predator
            if (predator.x < -predator.radius) predator.x = width + predator.radius;
            if (predator.x > width + predator.radius) predator.x = -predator.radius;
            if (predator.y < -predator.radius) predator.y = height + predator.radius;
            if (predator.y > height + predator.radius) predator.y = -predator.radius;

            // Loop Sequence: Wait for ALL dots to be fully gone (vanished) before starting the timer
            if (dots.length === 0) {
                activeTimer = 0; // Reset life timer
                respawnTimer++;
                if (respawnTimer > 120) { // 2 seconds delay (smile time) after vanishing
                    init();
                    respawnTimer = 0;
                }
            } else {
                // If there are only a few non-scared dots left, speed up the scattering of the rest
                const edibleDots = dots.filter(d => !d.isScared).length;
                if (edibleDots === 0) {
                    // Make all remaining scared dots fade faster
                    dots.forEach(d => { d.targetOpacity = 0; d.opacity *= 0.9; });
                }
                respawnTimer = 0;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw dots
            dots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(16, 185, 129, ${dot.opacity})`;
                ctx.fill();
            });

            // Draw Predator
            drawSmiley(predator.x, predator.y, predator.radius, predator.isSmiling, predator.mouthOpen);
        };

        const animate = () => {
            update();
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[-1]"
            style={{ background: 'transparent', pointerEvents: 'none' }}
        />
    );
};
