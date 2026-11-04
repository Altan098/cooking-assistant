from sqlalchemy.orm import Session

from app.models import ShoppingItem


def get_items(db: Session, user_id: int) -> list[ShoppingItem]:
    return db.query(ShoppingItem).filter(ShoppingItem.user_id == user_id).order_by(ShoppingItem.id).all()


def get_item(db: Session, item_id: int, user_id: int) -> ShoppingItem | None:
    return db.query(ShoppingItem).filter(ShoppingItem.id == item_id, ShoppingItem.user_id == user_id).first()


def create_item(db: Session, name: str, user_id: int) -> ShoppingItem:
    item = ShoppingItem(name=name, user_id=user_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def set_done(db: Session, item: ShoppingItem, done: bool) -> ShoppingItem:
    item.done = done
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: ShoppingItem) -> None:
    db.delete(item)
    db.commit()
