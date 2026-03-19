import torchvision.transforms as transforms
import os
import sys

# Add project root to path for settings
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from configs import settings

def get_train_transforms():
    """
    Returns transforms for training including data augmentation.
    """
    return transforms.Compose([
        transforms.Resize(settings.IMG_SIZE),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

def get_val_transforms():
    """
    Returns standard transforms for validation and inference (no augmentation).
    """
    return transforms.Compose([
        transforms.Resize(settings.IMG_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
