from flask import jsonify, request
from flask_jwt_extended import create_access_token
from models import User, db
from utils import hash_password, check_password

class AuthController:
    @staticmethod
    def signup():
        try:
            data = request.get_json()
            
            # if user already exists
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'error': 'Username already exists'}), 400
                
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already exists'}), 400
            
            # Create new user
            hashed_password = hash_password(data['password'])
            user = User(
                username=data['username'],
                email=data['email'],
                password_hash=hashed_password
            )
            
            db.session.add(user)
            db.session.commit()
            
            # Generate access token
            access_token = create_access_token(identity=str(user.id))
            
            return jsonify({
                'message': 'User created successfully',
                'access_token': access_token,
                'user': user.to_dict()
            }), 201
            
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    @staticmethod
    def login():
        try:
            data = request.get_json()
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not check_password(data['password'], user.password_hash):
                return jsonify({'error': 'Invalid credentials'}), 401
                
            access_token = create_access_token(identity=str(user.id))
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 400