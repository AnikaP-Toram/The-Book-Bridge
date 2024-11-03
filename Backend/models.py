from flask_sqlalchemy import SQLAlchemy
from passlib.hash import pbkdf2_sha256 as sha256

db = SQLAlchemy() # Initialize SQLAlchemy

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True) # Unique ID for each user
    email = db.Column(db.String(120), unique=True, nullable=False) # User's email address
    password = db.Column(db.String(128), nullable=False) # Hashed password
    reset_token = db.Column(db.String(128), nullable=True) # Token for password reset

    # Method to hash a password
    @staticmethod
    def generate_hash(password): 
        return sha256.hash(password)

    # Method to verify a password against a hash
    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

# Define Book model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True) # Unique ID for each book
    title = db.Column(db.String(200), nullable=False) # Title of the book
    author = db.Column(db.String(100), nullable=False) # Author of the book
    genre = db.Column(db.String(50), nullable=False) # Genre of the book
    condition = db.Column(db.String(50), nullable=False) # Condition of the book
    available = db.Column(db.Boolean, default=True) # Availability status of the book
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # ID of the user who owns the book
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp()) # Timestamp for when the book was added
