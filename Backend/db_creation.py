from __init__ import db, create_app
from models import User, Book  # Ensure you import the Book and User models

app = create_app()

with app.app_context():
    db.create_all() # Create all database tables

    # Create an admin user
    admin_user = User(email="admin_user@gmail.com", password=User.generate_hash("admin@123"))
    db.session.add(admin_user)
    db.session.commit() # Commit the new user to the database

    # Add a list of sample books to the database
    books = [
        Book(title="To Kill a Mockingbird", author="Harper Lee", genre="Fiction", condition="Good", available=True, user_id=admin_user.id),
        Book(title="1984", author="George Orwell", genre="Dystopian", condition="Fair", available=True, user_id=admin_user.id),
        Book(title="Pride and Prejudice", author="Jane Austen", genre="Romance", condition="Excellent", available=True, user_id=admin_user.id),
        Book(title="The Catcher in Rye", author="J.D. Salinger", genre="Fiction", condition="Good", available=True, user_id=admin_user.id),
        Book(title="The Great Gatsby", author="F. Scott Fitzgerald", genre="Fiction", condition="Very Good", available=True, user_id=admin_user.id),
        Book(title="Moby Dick", author="Herman Melville", genre="Adventure", condition="Poor", available=False, user_id=admin_user.id),
        Book(title="War and Peace", author="Leo Tolstoy", genre="Historical", condition="Good", available=True, user_id=admin_user.id),
        Book(title="The Odyssey", author="Homer", genre="Epic", condition="Fair", available=True, user_id=admin_user.id),
        Book(title="Hamlet", author="William Shakespeare", genre="Drama", condition="Excellent", available=False, user_id=admin_user.id),
        Book(title="The Hobbit", author="J.R.R. Tolkien", genre="Fantasy", condition="Good", available=True, user_id=admin_user.id)
    ]
    db.session.add_all(books)
    db.session.commit() # Commit the new books to the database

print("Database tables created and sample books added successfully.")
