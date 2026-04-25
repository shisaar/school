:root {
    --primary: #6366f1;
    --bg: #0f172a;
    --accent: #10b981;
}

body {
    margin: 0; padding: 0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #000; /* Глубокий черный для контраста */
    color: white;
    display: flex; justify-content: center; align-items: center;
    min-height: 100vh; overflow: hidden;
}

.glass-card {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 28px;
    padding: 1.5rem;
    width: 88%;
    max-width: 360px;
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.2);
}

h1 { font-size: 1rem; margin-bottom: 1rem; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); }

.canvas-container {
    position: relative;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 20px;
    margin-bottom: 1rem;
    overflow: hidden;
}

#pendulumCanvas { width: 100%; display: block; }

/* Мини-график снизу */
#graphCanvas {
    position: absolute;
    bottom: 0; left: 0;
    width: 100%; height: 60px;
    opacity: 0.6;
    pointer-events: none;
}

.controls { display: grid; gap: 0.8rem; }
.control-row { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
label { font-size: 0.65rem; color: #64748b; font-weight: bold; }

input[type="range"] { width: 100%; accent-color: var(--primary); cursor: pointer; }

button {
    background: linear-gradient(135deg, var(--primary), #4338ca);
    color: white; border: none; padding: 14px;
    border-radius: 16px; font-weight: 700; cursor: pointer;
    transition: 0.2s;
}

button:active { transform: scale(0.95); }
