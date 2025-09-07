from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database, models, schemas, auth
from app.tasks import update_favorite_count, r

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/", response_model=list[schemas.Recipe])
def get_recipes(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Return only recipes owned by current user
    return db.query(models.Recipe).filter(models.Recipe.owner_id == current_user.id).all()

@router.post("/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_recipe = models.Recipe(**recipe.dict(), owner_id=current_user.id)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.post("/{recipe_id}/favorite", response_model=schemas.Recipe)
def favorite_recipe(recipe_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_recipe = db.query(models.Recipe).filter(
        models.Recipe.id == recipe_id,
        models.Recipe.owner_id == current_user.id
    ).first()

    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db_recipe.is_favorite = not db_recipe.is_favorite

    db.commit()
    db.refresh(db_recipe)

    # Enqueue background task to update Redis favorite count
    update_favorite_count.delay(recipe_id, db_recipe.is_favorite)

    return db_recipe

@router.get("/{recipe_id}/favorite-count")
def favorite_count(recipe_id: int):
    count = r.get(f"recipe:{recipe_id}:favorites") or 0
    return {"recipe_id": recipe_id, "favorites": int(count)}