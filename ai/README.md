ai/
├── venv/  
├── api/                           #expose inference
├── data/                    
│   ├── raw/
|   ├── processed/
│   └── models/
├── src/
│   └── treatment_prediction/
│       ├── __init__.py
│       ├── config.py              # constants and params
│       ├── data_preprocessing.py  # load & clean data
│       ├── model_training.py      # train & evaluate model
│       ├── model_utils.py         # save/load models
│       ├── cli.py                 # automatic commands
│       └── predict.py             # predict new samples
├── experiment/
│       ├── logs/                   #water treatment logs
│       └── metrics                # ai emtrics like F-1, the accuracy, precision and recall
├── train_model.py                # entry point for training
├── treatment_prediction.py       # entry point for inference
├──.gitignore                      #centalised list of requrements for easy installation
├──requirements.txt
└──README.md




numpy- and arrays
pandas-read CSV / sensor data
scikit-learn-Random Forest + metrics (accuracy, F1, etc.)
joblib-save/load trained model
matplotlib / seaborn-visualize data and metrics
pyyaml-for config files
loguru-clean logging instead of print()
Library	Full Name	Purpose
xgboost	- decision tree model
lightgbm- Similar to XGBoost but optimized for speed and memory.

