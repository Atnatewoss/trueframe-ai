# TrueFrame AI - API & ML Pipeline (Server)

This directory contains the backend for TrueFrame AI, a platform for detecting deepfake videos using Convolutional Neural Networks (ResNet18).

## Architecture

The server is divided into two main systems:

### 1. ML Training Pipeline (`src/`)
Handles everything from raw data to a trained model.
- **Preprocessing**: Frame extraction and image normalization.
- **Training**: Modular dataset loading, balanced sampling, and CNN training.
- **Evaluation**: Performance metric analysis (Accuracy, Precision, Recall, F1) using classification reports.

### 2. API (`app/`)
A FastAPI service for real-world inference.
- **Routes**: Clean endpoints for video prediction.
- **Inference**: Orchestrates the transition from user video to final classification.
- **Schemas**: Validated request/response formats.

---

## Directory Structure

```text
server/
├── app/                  # Production API layer
│   ├── main.py           # FastAPI entry point
│   ├── routes.py         # API endpoints
│   ├── inference.py      # Inference pipeline logic
│   └── schemas.py        # Pydantic data models
├── src/                  # ML Pipeline layer
│   ├── preprocessing/    # Data preparation
│   ├── training/         # Model training
│   └── evaluation/       # Performance metrics
├── configs/              # Centralized configuration
│   ├── training.yaml     # Hyperparameters & Paths
│   └── settings.py       # Global environment settings
├── data/                 # Training dataset (Real/Fake)
├── models/               # Saved trained model weights
└── logs/                 # Training session logs
```

---

## How to Run the Server

### Step 1: Install Dependencies
This project uses [uv](https://github.com/astral-sh/uv) for fast dependency management.
```powershell
uv sync
```

### Step 2: Prepare Dataset
Place your images in `data/Train/real/`, `data/Train/fake/`, etc., depending on your configured datasplit.

### Step 3: Train & Evaluate
```powershell
uv run python src/training/train_model.py
```
*Note: You can monitor progress by tailing `logs/training_log.txt`.*

### Step 4: Run the API
```powershell
uv run fastapi dev app/main.py
```
The API will be available at `http://127.0.0.1:8000`.

---

## Evaluation Results
After training, the system outputs metrics like:
- **Accuracy**: Measured on the test dataset.
- **F1 Score**: Calculated to provide a balance between precision and recall.
- **Classification Report**: Detailed breakdown per class (Real vs. Fake).
