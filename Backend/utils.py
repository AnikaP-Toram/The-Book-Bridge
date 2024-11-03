from flask_mail import Mail
from itsdangerous import URLSafeTimedSerializer
from config import Config

mail = Mail()
serializer = URLSafeTimedSerializer(Config.SECRET_KEY)
