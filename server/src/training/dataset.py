from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader, random_split
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from configs import settings

def load_dataset(path, transform):
    """
    Loads images from a folder using ImageFolder.
    """
    return ImageFolder(path, transform=transform)

def get_dataloaders(dataset, batch_size, train_split=0.8):
    """
    Splits dataset into train/test and returns DataLoaders.
    """
    train_size = int(train_split * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size)
    
    return train_loader, test_loader
