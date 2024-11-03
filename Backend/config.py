import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '*****')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://username:password@localhost/db_name')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '*****')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', '*****')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '*****')
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
