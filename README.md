# TrueFrame AI

![TrueFrame AI Dashboard](./client/public/screenshot.png)

<p align="center">
  <img src="https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next JS" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
</p>

TrueFrame AI is a comprehensive deepfake detection platform. It provides a robust machine learning pipeline for detecting manipulated videos using Convolutional Neural Networks (ResNet18) and a modern, user-friendly web interface.

## Table of Contents
- [Project Overview](#project-overview)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)

## Project Overview

With the rapid advancement of AI-generated media, distinguishing real videos from deepfakes has become a critical challenge. TrueFrame AI addresses this by combining an optimized PyTorch-based training pipeline with a Fast API backend and a responsive Next.js frontend.

### Key Components
1. **Machine Learning Server (`/server`)**: A PyTorch backend that handles dataset loading, model training, evaluation, and serves the classification model via FastAPI.
2. **Web Client (`/client`)**: A modern React frontend built with Next.js and Tailwind CSS that allows users to seamlessly upload videos and visualize the model's confidence scores.

## Repository Structure

The project is structured as a monorepo containing both the frontend client and the backend server:

```text
trueframe-ai/
├── client/          # Next.js React frontend
│   ├── app/         # App router (pages, layouts)
│   ├── components/  # React components
│   └── public/      # Static web assets
│
└── server/          # PyTorch & FastAPI backend
    ├── app/         # FastAPI endpoints and schemas
    ├── src/         # ML pipeline (training, dataset, evaluation)
    ├── configs/     # Project configuration (hyperparameters)
    └── data/        # Datasets (git-ignored)
```

## Getting Started

To run the full TrueFrame AI platform locally, you will need to start both the server and the client.

### 1. Start the Server (Backend)

The backend uses `uv` for lightning-fast Python dependency management.

```powershell
# Navigate to the server folder
cd server

# Install dependencies
uv sync

# Run the FastAPI development server
uv run fastapi dev app/main.py
```
*The server will start on `http://127.0.0.1:8000`. Ensure this is running before interacting with the frontend.*

### 2. Start the Client (Frontend)

The frontend uses standard Node.js package managers.

```powershell
# Navigate to the client folder (in a new terminal)
cd client

# Install dependencies
npm install

# Run the Next.js development server
npm run dev
```
*The client will start on `http://localhost:3000`. Open this in your browser to use TrueFrame AI.*

## Development Workflow

- **Backend Development**: For details on the ML training loop, evaluating the ResNet model, or adding new API endpoints, refer to the [Server README](./server/README.md).
- **Frontend Development**: For details on modifying the UI components or Tailwind styling, refer to the [Client README](./client/README.md).
