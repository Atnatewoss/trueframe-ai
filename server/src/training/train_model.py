import os
import sys
import time
import gc
import torch
from torch import nn, optim
from torchvision.datasets import ImageFolder

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from configs import settings
from src.preprocessing.transforms import get_train_transforms, get_val_transforms
from src.training.dataset import get_dataloaders, get_balanced_subset_indices, Subset
from src.training.model import get_model
from src.evaluation.evaluate_model import evaluate

def train():
    # 0. Setup Logging
    log_dir = os.path.dirname(settings.LOG_FILE_PATH)
    os.makedirs(log_dir, exist_ok=True)
    log_file = open(settings.LOG_FILE_PATH, "a") # Open in append mode
    
    def log_and_print(message):
        print(message)
        log_file.write(message + "\n")
        log_file.flush()

    log_and_print(f"\n--- Training Session Started: {settings.LOG_FILE_PATH} ---")

    # 1. Setup
    transform = get_transforms()
    dataset = load_dataset(settings.DATA_PATH, transform)
    train_loader, test_loader = get_dataloaders(dataset, settings.BATCH_SIZE, settings.TRAIN_SPLIT)
    
    model = get_model(num_classes=len(dataset.classes))
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=settings.LEARNING_RATE)
    
    # 2. Training Loop
    epochs = settings.EPOCHS
    log_and_print(f"Starting training on {len(dataset)} images for {epochs} epochs...")
    
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for images, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
            
        log_and_print(f"Epoch {epoch+1}/{epochs}, Loss: {running_loss/len(train_loader):.4f}")
        
    # 3. Evaluation
    metrics = evaluate(model, test_loader, dataset.classes)
    
    # Log evaluation results
    log_and_print("\nFinal Evaluation Metrics:")
    log_and_print(f"Accuracy: {metrics['accuracy']*100:.2f}%")
    log_and_print(f"F1 Score: {metrics['f1']:.4f}")
    log_and_print("\nClassification Report:")
    log_and_print(metrics['report'])
    
    # 4. Save Model
    os.makedirs(os.path.dirname(settings.MODEL_SAVE_PATH), exist_ok=True)
    torch.save(model.state_dict(), settings.MODEL_SAVE_PATH)
    log_and_print(f"\nModel saved to {settings.MODEL_SAVE_PATH}")
    log_and_print("--- Training Session Finished ---\n")
    
    log_file.close()
    return model, test_loader, dataset.classes

if __name__ == "__main__":
    train()
