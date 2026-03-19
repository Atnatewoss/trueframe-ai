import torch
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from src.evaluation.metrics import calculate_metrics

def evaluate(model, test_loader, class_names):
    """
    Evaluates the model on the test dataset and prints metrics.
    """
    print(f"\nEvaluating model on test dataset...")
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in test_loader:
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    # Calculate metrics
    metrics = calculate_metrics(all_labels, all_preds, target_names=class_names)

    print(f"\nTest Accuracy: {metrics['accuracy']*100:.2f}%")
    print("\nClassification Report:")
    print(metrics['report'])
    
    return metrics
