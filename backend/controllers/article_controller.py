from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Article, User, db
from datetime import datetime

class ArticleController:
    @staticmethod
    def get_all_articles():
        try:
            articles = Article.query.order_by(Article.created_at.desc()).all()
            articles_data = [article.to_dict(content_preview=True) for article in articles]
            return jsonify(articles_data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    @staticmethod
    def get_article(article_id):
        try:
            article = Article.query.get_or_404(article_id)
            return jsonify(article.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 404

    @staticmethod
    @jwt_required()
    def create_article():
        try:
            data = request.get_json()

            title = data.get('title')
            content = data.get('content')
            current_user_id = int( get_jwt_identity())

            # Validation
            if not title or not content:
                return jsonify({'error': 'Title and content are required'}), 400

            new_article = Article(
                title=title,
                content=content,
                author_id=current_user_id,
                created_at=datetime.utcnow()
            )

            db.session.add(new_article)
            db.session.commit()

            return jsonify({'message': 'Article created successfully'}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    @staticmethod
    @jwt_required()
    def update_article(article_id):
        try:
            data = request.get_json()
            current_user_id = int(get_jwt_identity())
            
            article = Article.query.get_or_404(article_id)
            
            if article.author_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
                
            article.title = data.get('title', article.title)
            article.content = data.get('content', article.content)
            article.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                'message': 'Article updated successfully',
                'article': article.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    @staticmethod
    @jwt_required()
    def delete_article(article_id):
        try:
            current_user_id = int(get_jwt_identity())
            article = Article.query.get_or_404(article_id)
            
            if article.author_id != current_user_id:
                return jsonify({'error': 'Unauthorized'}), 403
                
            db.session.delete(article)
            db.session.commit()
            
            return jsonify({'message': 'Article deleted successfully'}), 200
             
        except Exception as e:
            return jsonify({'error': str(e)}), 400
 