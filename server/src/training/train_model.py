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
    # Performance Optimization: Limit CPU threads to prevent contention
    torch.set_num_threads(2)
    
    # 0. Setup Logging
    log_dir = os.path.dirname(settings.LOG_FILE_PATH)
    os.makedirs(log_dir, exist_ok=True)
    log_file = open(settings.LOG_FILE_PATH, "a") # Open in append mode
    
    def log_and_print(message):
        print(message)
        log_file.write(message + "\n")
        log_file.flush()

    log_and_print(f"\n--- Training Session Started (Large Dataset) ---")

    # 1. Setup Data
    train_transform = get_train_transforms()
    val_transform = get_val_transforms()
    
    train_path = os.path.join(settings.DATA_PATH, "Train")
    val_path = os.path.join(settings.DATA_PATH, "Validation")
    test_path = os.path.join(settings.DATA_PATH, "Test")
    
    # Load and Sample Training Set (20k total) - with augmentation
    full_train_ds = ImageFolder(train_path, transform=train_transform)
    train_indices = get_balanced_subset_indices(full_train_ds, samples_per_class=10000)
    train_dataset = Subset(full_train_ds, train_indices)
    
    # Load and Sample Validation Set (4k total) - no augmentation
    full_val_ds = ImageFolder(val_path, transform=val_transform)
    val_indices = get_balanced_subset_indices(full_val_ds, samples_per_class=2000)
    val_dataset = Subset(full_val_ds, val_indices)
    
    # Load and Sample Test Set (4k total) - no augmentation
    full_test_ds = ImageFolder(test_path, transform=val_transform)
    test_indices = get_balanced_subset_indices(full_test_ds, samples_per_class=2000)
    test_dataset = Subset(full_test_ds, test_indices)
    
    train_loader, val_loader, test_loader = get_dataloaders(
        train_dataset, val_dataset, test_dataset, settings.BATCH_SIZE
    )
    
    model = get_model(num_classes=len(full_train_ds.classes))
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=settings.LEARNING_RATE)
    
    # 2. Training Loop
    epochs = settings.EPOCHS
    log_and_print(f"Sampled Training: {len(train_dataset)} images")
    log_and_print(f"Validation: {len(val_dataset)} images")
    log_and_print(f"Test: {len(test_dataset)} images")
    log_and_print(f"Epochs: {epochs}")
    
    for epoch in range(epochs):
        epoch_start_time = time.time()
        model.train()
        running_loss = 0.0
        
        log_and_print(f"\nEpoch {epoch+1} is starting training...")
        for batch_idx, (images, labels) in enumerate(train_loader):
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item()
            
            if (batch_idx + 1) % 50 == 0:
                log_and_print(f"  Train Batch {batch_idx+1}/{len(train_loader)}, Loss: {loss.item():.4f}")
            
        # Validation at end of epoch
        log_and_print(f"Epoch {epoch+1} is starting validation...")
        model.eval()
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for batch_idx, (images, labels) in enumerate(val_loader):
                outputs = model(images)
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).int().sum().item()
                
                if (batch_idx + 1) % 50 == 0:
                    log_and_print(f"  Val Batch {batch_idx+1}/{len(val_loader)}")
        
        val_acc = 100 * val_correct / val_total
        epoch_duration = time.time() - epoch_start_time
        log_and_print(f"Epoch {epoch+1}/{epochs} Finished - Loss: {running_loss/len(train_loader):.4f}, Val Acc: {val_acc:.2f}%, Time: {epoch_duration:.2f}s")
        
        # Cleanup memory to prevent slowdown
        gc.collect()
        
    # 3. Evaluation
    metrics = evaluate(model, test_loader, full_train_ds.classes)
    
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
