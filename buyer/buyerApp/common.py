import configparser
import os
from buyerApp import dictLogger
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials
from firebase_admin import db
import json

config = configparser.ConfigParser()
dir = os.path.dirname(os.path.realpath(__file__))
configfile = dir + "/" + "config.init"
firebase_file = dir + "/" + "serviceAccountKey.json"
config.read(configfile, 'UTF-8')

with open(firebase_file, 'r', encoding="utf-8") as f:
    firebase = json.load(f)

IDENTIFICATION_CODE = config.get('payment', 'Identification_code')

SECRETKEY = config.get('setting', 'key')

SIGNUP = config.get('firebase', 'signup')
SIGNIN = config.get('firebase', 'signin')
SENDOOBCODE = config.get('firebase', 'sendOobCode')

FIREBASE = firebase['firebase']
FIREBASE_KEY = firebase['firebase']['apiKey']

cred = credentials.Certificate(firebase['Certificate'])
firebase_admin.initialize_app(cred, FIREBASE)

def getLogger():
    logger = dictLogger.setup_logger('buyerapp', 'buyerapp.log')
    return logger