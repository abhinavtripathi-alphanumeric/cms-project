from flask import Blueprint
from controllers import AuthController

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    return AuthController.signup()

@auth_bp.route('/login', methods=['POST'])
def login():
    return AuthController.login()