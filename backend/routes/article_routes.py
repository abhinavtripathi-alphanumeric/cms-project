from flask import Blueprint
from controllers import ArticleController

article_bp = Blueprint('articles', __name__)

@article_bp.route('', methods=['GET'])
def get_articles():
    return ArticleController.get_all_articles()

@article_bp.route('/<int:article_id>', methods=['GET'])
def get_article(article_id):
    return ArticleController.get_article(article_id)

@article_bp.route('', methods=['POST'])
def create_article():
    return ArticleController.create_article()

@article_bp.route('/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    return ArticleController.update_article(article_id)

@article_bp.route('/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    return ArticleController.delete_article(article_id)