ai/
│
├── venv/                               # virtual environment (local only, not in git)
│
├── api/                                # exposes trained model via API
│   ├── __init__.py
│   └── app.py                          # FastAPI app (inference endpoint)
│
├── configs/                            # configuration management
│   ├── config.yaml                     # all constants, paths, model params
│   └── logging.yaml                    # optional custom logging settings
│
├── data/
│   ├── raw/                            # original IOT CSV data from sensors
│   ├── processed/                      # cleaned and transformed data for ML
│   └── models/                         # saved serialized models (joblib/pkl)
│
├── experiment/
│   ├── logs/                           # run logs and training info
│   └── metrics/                        # accuracy, precision, recall, F1 results (JSON/CSV)
│
├── notebooks/                          # (optional) for experiments & visualization
│   └── data_exploration.ipynb
│
├── src/
│   └── treatment_prediction/
│       ├── __init__.py
│       ├── config.py                   # loads YAML configs (data paths, hyperparams)
│       ├── data_preprocessing.py       # handles cleaning, encoding, normalization
│       ├── model_training.py           # train + evaluate ML model (RandomForest)
│       ├── model_utils.py              # handles save/load/versioning of model
│       ├── evaluation.py               # logs metrics (accuracy, f1, etc.)
│       ├── predict.py                  # predict new data samples
│       ├── cli.py                      # command line automation (train/predict)
│       └── logger.py                   # central logger setup
│
├── scripts/                            # automation scripts
│   ├── setup_env.ps1                   # Windows: setup venv + install dependencies
│   └── setup_env.sh                    # Linux/Mac: setup venv + install dependencies
│
├── tests/                              # simple unit tests
│   ├── test_training.py
│   ├── test_predict.py
│   └── __init__.py
│
├── train_model.py                      # main entry point for training (calls CLI)
├── treatment_prediction.py             # main entry point for inference
│
├── Dockerfile                          # for deployment (optional)
├── requirements.txt                    # dependencies list
├── .gitignore                          # ignore unnecessary files
└── README.md                           # documentation





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

