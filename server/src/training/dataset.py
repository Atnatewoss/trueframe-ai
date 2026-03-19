from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from configs import settings

import random
from torch.utils.data import DataLoader, Subset

def get_balanced_subset_indices(dataset, samples_per_class=10000):
    """
    Returns indices for a balanced subset of the dataset.
    """
    class_to_idx = {c: i for i, c in enumerate(dataset.classes)}
    indices_per_class = {c: [] for c in dataset.classes}
    
    for idx, (_, label) in enumerate(dataset.samples):
        class_name = dataset.classes[label]
        indices_per_class[class_name].append(idx)
    
    sampled_indices = []
    for class_name, indices in indices_per_class.items():
        if len(indices) < samples_per_class:
            print(f"Warning: Class {class_name} has only {len(indices)} samples, taking all.")
            sampled_indices.extend(indices)
        else:
            sampled_indices.extend(random.sample(indices, samples_per_class))
            
    return sampled_indices

def get_dataloaders(train_dataset, val_dataset, test_dataset, batch_size):
    """
    Returns DataLoaders for train, val, and test datasets.
    """
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size)
    test_loader = DataLoader(test_dataset, batch_size=batch_size)
    
    return train_loader, val_loader, test_loader
