from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session, joinedload

from app.models import MealPlanEntry


def get_entries(db: Session, user_id: int) -> list[MealPlanEntry]:
    return (
        db.query(MealPlanEntry)
        .options(joinedload(MealPlanEntry.recipe))
        .filter(MealPlanEntry.user_id == user_id)
        .all()
    )


def get_entry(db: Session, user_id: int, day: int, meal: str) -> MealPlanEntry | None:
    return (
        db.query(MealPlanEntry)
        .filter(MealPlanEntry.user_id == user_id, MealPlanEntry.day == day, MealPlanEntry.meal == meal)
        .first()
    )


def set_entry(db: Session, user_id: int, day: int, meal: str, recipe_id: int) -> MealPlanEntry:
    statement = insert(MealPlanEntry).values(user_id=user_id, day=day, meal=meal, recipe_id=recipe_id)
    db.execute(
        statement.on_conflict_do_update(
            constraint="uq_meal_plan_slot",
            set_={"recipe_id": statement.excluded.recipe_id},
        )
    )
    db.commit()
    return get_entry(db, user_id, day, meal)


def delete_entry(db: Session, entry: MealPlanEntry) -> None:
    db.delete(entry)
    db.commit()
