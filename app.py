import openai
from flask import Flask, render_template, redirect, url_for, request, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
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

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_messages')


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['is_admin'] = user.is_admin
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')
        
        if not username or not password or not email:
            flash('Please fill in all fields')
            return render_template('register.html')
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return render_template('register.html')
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered')
            return render_template('register.html')
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password=hashed_password, email=email)
        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful, please log in')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    keyword = request.args.get('keyword')
    
    if keyword:
        posts = Post.query.filter(Post.title.contains(keyword) | Post.body.contains(keyword)).all()
    else:
        posts = Post.query.all()
        
    if request.method == 'POST':
        title = request.form.get('title')
        body = request.form.get('body')
        position = request.form.get('position')
        
        if not title or not body or not position:
            flash('Please fill in all fields')
            return redirect(url_for('dashboard'))
        
        new_post = Post(title=title, body=body, author_id=session['user_id'], position=position)
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for('dashboard'))
    
    return render_template('dashboard.html', posts=posts)

@app.route('/post/<int:post_id>')
def post(post_id):
    post = Post.query.get_or_404(post_id)
    author = User.query.get_or_404(post.author_id)
    return render_template('post.html', post=post, author=author)

@app.route('/profile/<int:user_id>')
def profile(user_id):
    user = User.query.get_or_404(user_id)
    return redirect(url_for('userprofile', user_id=user.id))

@app.route('/userprofile/<int:user_id>', methods=['GET', 'POST'])
def userprofile(user_id):
    user = User.query.get_or_404(user_id)
    if request.method == 'POST':
        user.username = request.form['username']
        user.email = request.form['email']
        
        db.session.commit()
        flash('Profile updated successfully')
        return redirect(url_for('userprofile', user_id=user.id))

    profile_data = {
        'name': user.username,
        'username': user.username,
        'email': user.email,
        'profile_image_url': 'https://via.placeholder.com/150'  # Replace with actual image URL
    }
    return render_template('userprofile.html', profile=profile_data)

@app.route('/delete_post/<int:post_id>')
def delete_post(post_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    post = Post.query.get_or_404(post_id)
    if session['user_id'] == post.author_id or session.get('is_admin'):
        db.session.delete(post)
        db.session.commit()
    return redirect(url_for('dashboard'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    session.pop('is_admin', None)
    return redirect(url_for('home'))

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

openai.api_key = ''
@app.route('/chatBot', methods=['POST'])
def chatBot():
    data = request.get_json()
    prompt = data['prompt']
    user_message = data['userMessage']

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

@app.route('/messages', methods=['GET', 'POST'])
def messages():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    selected_user_id = request.args.get('user_id')
    users = User.query.all()
    selected_user = None
    messages = []

    if selected_user_id:
        selected_user = User.query.get(selected_user_id)
        if selected_user:
            # Fetch messages between the logged-in user and the selected user
            messages = Message.query.filter(
                (Message.sender_id == session['user_id']) & (Message.receiver_id == selected_user.id) |
                (Message.sender_id == selected_user.id) & (Message.receiver_id == session['user_id'])
            ).order_by(Message.timestamp.asc()).all()

    return render_template('messages.html', users=users, selected_user=selected_user, messages=messages)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
