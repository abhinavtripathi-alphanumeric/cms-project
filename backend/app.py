from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from models import db
from routes import auth_bp, article_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
   
    db.init_app(app)
    Migrate(app, db)
    jwt = JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(article_bp, url_prefix='/api/articles')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)