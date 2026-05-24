"use client";

import { useEffect, useRef, memo } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
}

const NODE_COUNT = 80;
const MAX_DIST = 160;        // max dist for node–node connections
const CURSOR_DIST = 220;     // max dist for cursor connections
const CURSOR_REPEL = 90;     // distance at which nodes get pushed away
const NODE_SPEED = 0.3;
const ATTRACT_STRENGTH = 0.012; // how strongly nodes drift toward cursor
const REPEL_STRENGTH = 1.8;    // how hard nodes bounce away when too close

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    }

    function initNodes() {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
        radius: Math.random() * 1.8 + 0.6,
        baseOpacity: Math.random() * 0.4 + 0.15,
      }));
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // ── Update node positions ──────────────────────────
      for (const node of nodes) {
        // Cursor attraction / repulsion
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CURSOR_REPEL && dist > 0) {
            // Repel: push away when too close
            const force = (CURSOR_REPEL - dist) / CURSOR_REPEL;
            node.vx -= (dx / dist) * force * REPEL_STRENGTH * 0.05;
            node.vy -= (dy / dist) * force * REPEL_STRENGTH * 0.05;
          } else if (dist < CURSOR_DIST && dist > 0) {
            // Attract: gently drift toward cursor
            node.vx += (dx / dist) * ATTRACT_STRENGTH;
            node.vy += (dy / dist) * ATTRACT_STRENGTH;
          }
        }

        // Speed cap so nodes don't fly off
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 2.5) {
          node.vx = (node.vx / speed) * 2.5;
          node.vy = (node.vy / speed) * 2.5;
        }

        // Damping — drift back toward base speed
        node.vx *= 0.98;
        node.vy *= 0.98;

        node.x += node.vx;
        node.y += node.vy;

        // Soft wrap at edges
        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;
      }

      // ── Node–node connections ──────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.13;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Cursor → node connections (bright) ────────────
      if (mouse.active) {
        for (const node of nodes) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_DIST) {
            const t = 1 - dist / CURSOR_DIST;
            // Line from cursor to node
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(6,182,212,${t * 0.45})`;
            ctx.lineWidth = t * 1.2;
            ctx.stroke();
          }
        }

        // Cursor dot with glow
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(6,182,212,0.9)";
        ctx.shadowColor = "rgba(6,182,212,0.8)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Draw nodes ────────────────────────────────────
      for (const node of nodes) {
        // Nodes near cursor glow brighter
        let opacity = node.baseOpacity;
        if (mouse.active) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_DIST) {
            opacity = Math.min(1, opacity + (1 - dist / CURSOR_DIST) * 0.6);
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // ── Mouse tracking ─────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    }

    // ── Tab visibility pause ────────────────────────────
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    resize();
    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

export default memo(NeuralBackground);
