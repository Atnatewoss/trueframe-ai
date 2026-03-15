import torchvision.models as models
import torch.nn as nn

def get_model(num_classes=2):
    """
    Returns a ResNet18 model with a modified final layer for binary classification.
    """
    model = models.resnet18(weights='DEFAULT')
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model
