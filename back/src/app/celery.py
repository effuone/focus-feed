from celery import Celery

from .config import settings

celery_app = Celery(
    "worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend
)

celery_app.conf.update(task_track_started=True)
