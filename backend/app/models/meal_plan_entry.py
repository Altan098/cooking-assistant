from sqlalchemy import Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MealPlanEntry(Base):
    __tablename__ = "meal_plan_entries"
    __table_args__ = (UniqueConstraint("user_id", "day", "meal", name="uq_meal_plan_slot"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    # 0 — понедельник, 6 — воскресенье.
    day: Mapped[int] = mapped_column(Integer, nullable=False)
    meal: Mapped[str] = mapped_column(String(20), nullable=False)
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)

    recipe: Mapped["Recipe"] = relationship()
