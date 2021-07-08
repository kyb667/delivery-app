import configparser
import os
import psycopg2
from sellerApp import dictLogger

config = configparser.ConfigParser()
dir = os.path.dirname(os.path.realpath(__file__))
configfile = dir + "/" + "config.init"
config.read(configfile, 'UTF-8')

SECRETKEY = config.get('setting', 'key')

DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASS')
DB_PORT = os.environ.get('DB_PORT')

# DB_HOST = 'localhost'
# DB_NAME = 'projectdb'
# DB_USER = 'postgres'
# DB_PASSWORD = 'password'
# DB_PORT = 5432

def getConnection():
    try:
        con = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        # con = psycopg2.connect(host='localhost', port=5432, dbname='projectdb', user='postgres', password='password')
    except Exception as e:
        print(e)
    finally:
        return con

def getLogger():
    logger = dictLogger.setup_logger('sellerapp', 'sellerapp.log')
    return logger