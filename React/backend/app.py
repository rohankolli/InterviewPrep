import os
# Existing imports and configurations
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import openai
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build', template_folder='../frontend/build')
CORS(app)

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    is_admin = db.Column(db.Boolean, default=False)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    body = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    position = db.Column(db.String(150), nullable=False)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        return jsonify({'success': True, 'user': {'id': user.id, 'username': user.username}})
    return jsonify({'success': False})

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True})

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    email = data['email']

    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username already exists'})
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already registered'})

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(username=username, password=hashed_password, email=email)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    if request.method == 'GET':
        keyword = request.args.get('keyword')
        if keyword:
            posts = Post.query.filter(Post.title.contains(keyword) | Post.body.contains(keyword)).all()
        else:
            posts = Post.query.all()
        return jsonify({'posts': [{'id': p.id, 'title': p.title, 'body': p.body, 'position': p.position} for p in posts]})
    elif request.method == 'POST':
        data = request.json
        title = data['title']
        body = data['body']
        position = data['position']
        new_post = Post(title=title, body=body, author_id=session['user_id'], position=position)  # Use session user_id
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'success': True})

@app.route('/dashboard', methods=['POST'])
def dashboard_post():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    data = request.json
    title = data['title']
    body = data['body']
    position = data['position']
    new_post = Post(title=title, body=body, author_id=session['user_id'], position=position)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/profile', methods=['GET'])
def profile():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 403
    user = User.query.get(session['user_id'])
    if user:
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Add other profile details if needed
        })
    return jsonify({'error': 'User not found'}), 404


openai.api_key = ''

@app.route('/chatBot', methods=['POST'])
def chatBot():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    data = request.json
    prompt = data.get('prompt', 'Interview practice')
    user_message = data['userMessage']

    # Call OpenAI API here
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"Prompt: {prompt}\n\nUser: {user_message}\n"},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150
        )
        return jsonify({'reply': response['choices'][0]['message']['content'].strip()})
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while processing your request.'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
