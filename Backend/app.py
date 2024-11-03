from flask import Flask
from config import Config
from models import db
from routes import auth
from utils import mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__) # Create a new Flask application
    app.config.from_object(Config) # Load configuration settings
    CORS(app) # Enable CORS for the app

    jwt = JWTManager(app) # Initialize JWT manager

    db.init_app(app) # Initialize the database with the app
    mail.init_app(app) # Initialize mail with the app

    app.register_blueprint(auth) # Register authentication routes

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True) # Run the app in debug mode
