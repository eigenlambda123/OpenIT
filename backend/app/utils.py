from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from .settings import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.email.mail_username,
    MAIL_PASSWORD=settings.email.mail_password,
    MAIL_FROM=settings.email.mail_from,
    MAIL_PORT=settings.email.mail_port,
    MAIL_SERVER=settings.email.mail_server,
    MAIL_FROM_NAME=settings.email.mail_from_name,
    MAIL_STARTTLS=settings.email.mail_starttls,
    MAIL_SSL_TLS=settings.email.mail_ssl_tls,
    USE_CREDENTIALS=settings.email.use_credentials,
    VALIDATE_CERTS=settings.email.validate_certs,
)

fm = FastMail(conf)

async def send_email(subject: str, recipients: list[str], body: str, subtype: MessageType = MessageType.html):
    """
    Send a basic email.
    """
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype=subtype,
    )
    await fm.send_message(message)
    return {"message": "Email sent successfully!"}