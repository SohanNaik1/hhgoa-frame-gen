# HHGOA Hacker Identity Generator

A high-performance, full-stack web application for generating dynamic, cyberpunk-styled hacker identity cards. The system features a Go-based backend for machine-learning facial recognition and automatic portrait cropping, paired with a vanilla JavaScript frontend utilizing hardware-accelerated 3D CSS transforms and a custom HTML5 Canvas rendering engine for high-resolution exports.

## Core Features

* **Machine Learning Facial Recognition:** Utilizes the Pigo library in Go for pure-Go, dependency-free facial detection. Automatically detects faces in uploaded portraits and crops them to a strict 1:1 aspect ratio with precise margin padding.
* **Hardware-Accelerated 3D UI:** Features an interactive identity card preview powered by `vanilla-tilt.js`. Implements robust WebKit CSS clipping (`clip-path`, `-webkit-mask-image`, and `preserve-3d`) to ensure glitch-free rendering and zero overflow during steep perspective rotations.
* **High-Resolution Canvas Engine:** Includes a custom `script.js` rendering pipeline that rebuilds the entire DOM visually onto a 1080x1620 HTML5 Canvas. Applies dynamic typography mapping, anti-aliased 40px rounded clipping paths, and calculates exact coordinates for pixel-perfect PNG downloads.
* **Dynamic Barcode & QR Generation:** Procedurally generates Code 128-style barcode patterns and links custom QR codes directly into the final exported canvas.
* **Brutalist / Cyberpunk Aesthetics:** Designed using a strict Tailwind CSS utility system, featuring dark modes, glowing neon accents, and mono-spaced terminal typography (`JetBrains Mono`).
* **Containerized Deployment:** Fully Dockerized with a multi-stage `Dockerfile`. Ready for immediate deployment to Azure App Service, Azure Container Apps, or any Docker-compatible infrastructure.

## Architecture

* **Backend:** Go (Golang) 1.22
* **Facial Detection:** Pigo (Cascade Facefinder)
* **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS (via CDN)
* **Interactive 3D:** Vanilla-Tilt.js
* **Font System:** JetBrains Mono (via Google Fonts)
* **Infrastructure:** Docker, Alpine Linux

## Getting Started

### Local Development

1. Ensure Go 1.22+ is installed on your system.
2. Clone the repository and navigate into the project directory.
3. Run the Go server:
   ```bash
   go run main.go
   ```
4. The server will ignite and listen on port `8080`. Access the interface at `http://localhost:8080`.

### Docker / Cloud Deployment

To build and run the application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t hhgoa-id-generator .
   ```
2. Run the container:
   ```bash
   docker run -p 8080:8080 hhgoa-id-generator
   ```

## Repository Structure

* `main.go`: The Go server entry point handling static file serving and the `/api/crop` facial recognition endpoint.
* `cascade/facefinder`: The binary cascade file required by the Pigo facial detection algorithm.
* `index.html`: The core UI template and Tailwind configuration.
* `script.js`: Handles frontend state, image upload interactions, Canvas rendering logic, and API calls.
* `Dockerfile`: Multi-stage build instructions for production deployment.

## License

This project is open-source and available under the MIT License.
