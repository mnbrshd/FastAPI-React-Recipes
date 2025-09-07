from sqlalchemy.orm import Session
from . import models, schemas

def get_recipes(db: Session):
    return db.query(models.Recipe).all()

def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(
        title=recipe.title,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def mark_favorite(db: Session, recipe_id: int):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if recipe:
        recipe.is_favorite = True
        db.commit()
        db.refresh(recipe)
    return recipe
