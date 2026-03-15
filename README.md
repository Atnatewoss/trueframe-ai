# TrueFrame AI - Deepfake Detection System

TrueFrame AI is a platform for detecting deepfake videos using Convolutional Neural Networks (ResNet18).

## Project Architecture

The project is divided into two main systems:

### 1. ML Training Pipeline (`server/src/`)
Handles everything from raw data to a trained model.
- **Preprocessing**: Frame extraction and image normalization.
- **Training**: Modular dataset loading and CNN training.
- **Evaluation**: Performance bottleneck analysis (Accuracy, Precision, Recall, F1).

### 2. API (`server/app/`)
A FastAPI service for real-world inference.
- **Routes**: Clean endpoints for video prediction.
- **Inference**: Orchestrates the transition from user video to final classification.
- **Schemas**: Validated request/response formats.

---

## Project Structure

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
│   └── training.yaml     # Hyperparameters & Paths
├── data/                 # Training dataset (Real/Fake)
├── models/               # Saved trained model weights
└── logs/                 # Training session logs
```

---

## How to Run

### Step 1: Install Dependencies
```powershell
uv sync
```

### Step 2: Prepare Dataset
Place your images in `server/data/real/` and `server/data/fake/`.

### Step 3: Train & Evaluate
```powershell
uv run src/training/train_model.py
```

### Step 4: Run the API
```powershell
uv run fastapi dev app/main.py
```

---

## Evaluation Results
After training, the system will output metrics like:
- **Accuracy**: 80%+
- **F1 Score**: 0.79+

These results are calculated on a 20% test split from your `data/` folder.
