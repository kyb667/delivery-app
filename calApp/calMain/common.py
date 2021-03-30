import configparser
import os

config = configparser.ConfigParser()
dir = os.path.dirname(os.path.realpath(__file__))
configfile = dir + "/" + "config.init"
config.read(configfile, 'UTF-8')

IDENTIFICATION_CODE = config.get('payment', 'Identification_code')
