import math
import time
from threading import Lock

from app.core.config import settings


class AttemptLimiter:
    """Считает неудачные попытки в скользящем окне.

    Счётчики живут в памяти процесса: этого достаточно для одного процесса uvicorn.
    При нескольких процессах счётчики нужно вынести в общее хранилище, например Redis.
    """

    MAX_TRACKED_KEYS = 10_000

    def __init__(self, max_attempts: int, window_seconds: int) -> None:
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self._failures: dict[str, list[float]] = {}
        self._lock = Lock()

    def _recent(self, key: str, now: float) -> list[float]:
        return [moment for moment in self._failures.get(key, []) if now - moment < self.window_seconds]

    def retry_after(self, key: str) -> int:
        """Возвращает, сколько секунд ждать, или 0, если попытка разрешена."""
        now = time.monotonic()
        with self._lock:
            recent = self._recent(key, now)
            if len(recent) < self.max_attempts:
                return 0
            return math.ceil(self.window_seconds - (now - recent[0]))

    def record_failure(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            if len(self._failures) >= self.MAX_TRACKED_KEYS:
                self._drop_expired(now)
            self._failures[key] = [*self._recent(key, now), now]

    def reset(self, key: str) -> None:
        with self._lock:
            self._failures.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._failures.clear()

    def _drop_expired(self, now: float) -> None:
        self._failures = {key: recent for key in self._failures if (recent := self._recent(key, now))}


login_limiter = AttemptLimiter(settings.login_max_attempts, settings.login_block_minutes * 60)
