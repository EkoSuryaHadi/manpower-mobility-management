from fastapi import HTTPException
from app.core.config import get_settings

def create_download_url(object_key: str, expires_in: int = 300) -> str:
    settings = get_settings()
    if not all((settings.storage_bucket, settings.storage_access_key, settings.storage_secret_key)):
        raise HTTPException(status_code=503, detail="Private storage is not configured")
    try:
        import boto3
        from botocore.exceptions import BotoCoreError, ClientError
        client = boto3.client("s3", region_name=settings.storage_region, endpoint_url=settings.storage_endpoint_url or None, aws_access_key_id=settings.storage_access_key, aws_secret_access_key=settings.storage_secret_key)
        return client.generate_presigned_url("get_object", Params={"Bucket": settings.storage_bucket, "Key": object_key}, ExpiresIn=expires_in)
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(status_code=502, detail="Could not create private download URL") from exc

def upload_file(file_obj, object_key: str, content_type: str | None) -> None:
    settings = get_settings()
    if not all((settings.storage_bucket, settings.storage_access_key, settings.storage_secret_key)):
        raise HTTPException(status_code=503, detail="Private storage is not configured")
    try:
        import boto3
        from botocore.exceptions import BotoCoreError, ClientError
        client = boto3.client("s3", region_name=settings.storage_region, endpoint_url=settings.storage_endpoint_url or None, aws_access_key_id=settings.storage_access_key, aws_secret_access_key=settings.storage_secret_key)
        client.upload_fileobj(file_obj, settings.storage_bucket, object_key, ExtraArgs={"ContentType": content_type or "application/octet-stream"})
    except (BotoCoreError, ClientError) as exc:
        raise HTTPException(status_code=502, detail="Could not upload private document") from exc
