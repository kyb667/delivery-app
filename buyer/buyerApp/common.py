import configparser
import os
from buyerApp import dictLogger
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials
from firebase_admin import db

config = configparser.ConfigParser()
dir = os.path.dirname(os.path.realpath(__file__))
configfile = dir + "/" + "config.init"
firebase = dir + "/" + "serviceAccountKey.json"
config.read(configfile, 'UTF-8')

IDENTIFICATION_CODE = config.get('payment', 'Identification_code')

SECRETKEY = config.get('setting', 'key')

FIREBASE = firebase.firebase

cred = credentials.Certificate(firebase.Certificate)
firebase_admin.initialize_app(cred, FIREBASE)

def getLogger():
    logger = dictLogger.setup_logger('buyerapp', 'buyerapp.log')
    return logger