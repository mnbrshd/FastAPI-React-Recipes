from celery_worker import celery_app
import redis

# Connect to Redis for storing global favorite counts
r = redis.Redis(host='localhost', port=6379, db=2, decode_responses=True)

@celery_app.task
def update_favorite_count(recipe_id: int, is_favorite: bool):
    """
    Increment or decrement global favorite count for the recipe.
    """
    key = f"recipe:{recipe_id}:favorites"
    if is_favorite:
        r.incr(key)
    else:
        r.decr(key)
    return r.get(key)
