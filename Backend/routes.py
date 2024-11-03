from flask import Blueprint, request, jsonify
from models import User, Book, db
from werkzeug.security import generate_password_hash
import re
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from config import Config
from utils import mail, serializer

auth = Blueprint('auth', __name__)

# To validate email format using regex
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# API to handle new user registration
@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() # Get JSON data from request
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400

    # Validate email format
    if not is_valid_email(email):
        return jsonify({"message": "Provide a valid email id"}), 400

    # Password validation
    if len(password) < 8 or not re.search(r'[!@#$%^&*]', password):
        return jsonify({"message": "Password must be at least 8 characters and contain special characters"}), 400

    # Create new user
    new_user = User(email=email, password=User.generate_hash(password))
    db.session.add(new_user)
    db.session.commit() # Commit changes

    return jsonify({"message": "User created successfully"}), 201

# API to handle login
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json() # Get JSON data from request
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first() # Find user by email

    if user and User.verify_hash(password, user.password): # Verify password
        access_token = create_access_token(identity=user.email) # Create JWT token
        return jsonify({"user_id": user.id, "access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# API to handle reset password feature
@auth.route('/request-reset', methods=['POST'])
def request_reset():
    data = request.get_json() # Get JSON data from request
    email = data.get('email')
    user = User.query.filter_by(email=email).first() # Find user by email

    if user:
        token = serializer.dumps(user.email, salt='password-reset-salt') # Generate reset token
        msg = Message('Password Reset Request', sender=Config.MAIL_USERNAME, recipients=[email])
        msg.html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container {{
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    font-color: black;
                    color: black;
                    color: #333;
                }}
                .code {{
                    font-size: 14px;
                    color: black;
                    font-weight: bold;
                    font-color: black;
                    background-color: #f4f4f4;
                    padding: 10px;
                    border-radius: 5px;
                    display: inline-block;
                    margin: 10px 0;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested to reset your password. Use the following code to reset your password:</p>
                <p class="code">{token}</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thanks,</p>
                <p>The Book Bridge</p>
            </div>
        </body>
        </html>
        """

        mail.send(msg) # Send email
        return jsonify({"message": "Password reset email sent"}), 200

    return jsonify({"message": "Email not found"}), 404

# API to handle reset password feature
@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600) # Verify token
    except:
        return jsonify({"message": "The token is invalid or expired"}), 401

    data = request.get_json() # Get JSON data from request
    new_password = data.get('password')

    # Validate new password
    if len(new_password) < 8 or not re.search(r'[!@#$%^&*]', new_password):
        return jsonify({"message": "Password must be at least 8 characters and contain special characters"}), 400

    user = User.query.filter_by(email=email).first()
    user.password = User.generate_hash(new_password) # Hash and set new password
    db.session.commit() # Commit changes

    return jsonify({"message": "Password has been reset"}), 200

# API to add a new book
@auth.route('/books', methods=['POST'])
@jwt_required() # Require JWT token for access
def add_book():
    data = request.get_json() # Get JSON data from request
    title = data.get('title')
    author = data.get('author')
    genre = data.get('genre')
    condition = data.get('condition')
    available = data.get('available').strip().lower() == "yes"
    user_id = data.get('user_id')

    # Create new book
    new_book = Book(title=title, author=author, genre=genre, condition=condition, user_id=user_id, available=available)
    
    db.session.add(new_book) # Add book to session
    db.session.commit() # Commit session
    return jsonify({"message": "Book added successfully.", "book_id": new_book.id}), 201

# API to get list of all books
@auth.route('/books', methods=['GET'])
@jwt_required() # Require JWT token for access
def list_books():
    books = Book.query.all() # Query all books

    # Format book data for response
    book_list = [{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "condition": book.condition,
        "available": book.available,
        "user_id": book.user_id
    } for book in books] 
    
    return jsonify(book_list), 200

# API to get a user's books
@auth.route('/books/<int:user_id>', methods=['GET'])
@jwt_required() # Require JWT token for access
def list_user_books(user_id):
    # Filter books of the provided user_id
    books = Book.query.filter_by(user_id=user_id).all()
    
    # Format the book data for response
    book_list = [{
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "condition": book.condition,
        "available": book.available,
        "user_id": book.user_id
    } for book in books]
    
    return jsonify(book_list), 200

# API to update an existing book
@auth.route('/books/<int:book_id>', methods=['PUT'])
@jwt_required() # Require JWT token for access
def edit_book(book_id):
    data = request.get_json() # Get JSON data from request
    book = Book.query.get_or_404(book_id) # Retrieve book or return 404

    # Update book details
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.genre = data.get('genre', book.genre)
    book.condition = data.get('condition', book.condition)
    book.available = data.get('available', book.available).strip().lower() == "yes"

    db.session.commit() # Commit changes
    return jsonify({"message": "Book updated successfully."}), 200

# API to delete an existing book
@auth.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required() # Require JWT token for access
def delete_book(book_id):
    book = Book.query.get_or_404(book_id) # Retrieve book or return 404
    db.session.delete(book) # Delete book from session
    db.session.commit() # Commit changes
    return jsonify({"message": "Book deleted successfully."}), 204
