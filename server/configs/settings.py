import os
import yaml

# Project Root (server/ folder)
CONFIG_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.abspath(os.path.join(CONFIG_DIR, ".."))

YAML_PATH = os.path.join(CONFIG_DIR, "training.yaml")

with open(YAML_PATH, 'r') as f:
    config = yaml.safe_load(f)

# Data paths
DATA_PATH = os.path.abspath(os.path.join(BASE_DIR, config['data']['dataset_path']))
MODEL_SAVE_PATH = os.path.abspath(os.path.join(BASE_DIR, config['data']['model_save_path']))
LOG_FILE_PATH = os.path.abspath(os.path.join(BASE_DIR, config['data']['log_path']))

# Hyperparameters
BATCH_SIZE = config['training']['batch_size']
EPOCHS = config['training']['epochs']
LEARNING_RATE = config['training']['learning_rate']

# Image details
IMG_SIZE = tuple(config['preprocessing']['img_size'])
