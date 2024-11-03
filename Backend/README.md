# The Book Bridge - Backend
The backend of the Book Bridge project is responsible for managing all server-side operations, including user authentication, book management, and API endpoints. This section provides an overview of the backend architecture, the technologies used, and the setup instructions necessary to get started.

## Technologies Used
**- Python:** A versatile programming language used for server-side development, enabling robust and efficient application logic.<br>
**- Flask:** A lightweight web framework for Python that simplifies the process of building web applications and APIs.<br>
**- JWT Token Authentication:** JSON Web Tokens (JWT) are utilized for secure user authentication and authorization, ensuring safe access to protected resources.<br>
**- PostgreSQL:** A powerful, open-source relational database management system used to store and manage user and book data.<br>

## Prerequisites

Before setting up the backend, ensure you have the following installed:
- **Python**
- **pip**
- **PostgreSQL**

## Setup Instructions
**1. Clone the Repository**:<br>
```
   git clone https://github.com/AnikaP-Toram/Test-The-Book-Bridge.git
   cd Test-The-Book-Bridge/Backend
```
   
**2. Create a Virtual Environment:**
```
   python -m venv venv
```

**3. Activate the Virtual Environment and Install Dependencies:**
```
   venv\Scripts\activate
   pip install -r requirements.txt
```

**4. Set Up the Database:**
1. Ensure you have PostgreSQL installed and running.
2. Create a new PostgreSQL database:

```
CREATE DATABASE book_bridge;
```

**5. Update Configuration Settings:** <br>
Open config.py and update the following values with your own secure information:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- SECRET_KEY<br>
&nbsp;&nbsp;&nbsp;&nbsp;- SQLALCHEMY_DATABASE_URI<br>
&nbsp;&nbsp;&nbsp;&nbsp;- JWT_SECRET_KEY<br>
&nbsp;&nbsp;&nbsp;&nbsp;- MAIL_USERNAME<br>
&nbsp;&nbsp;&nbsp;&nbsp;- MAIL_PASSWORD


**6. Run Database Setup Script:** <br>
Run the db_creation.py script to set up the database schema
```
python db_creation.py
```

**7. Run the Application:** <br>
Start the Flask server:
```
flask run
```

**8. Access the API:** <br>
Open a tool like Postman to access the API at [http://127.0.0.1:5000.](http://127.0.0.1:5000)
