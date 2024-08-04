from datetime import datetime, timedelta
import os
from typing import Dict
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from fastapi.security import HTTPAuthorizationCredentials, OAuth2PasswordBearer

from apps.accounts.schemas import UserFirebase

import firebase_admin
from firebase_admin import auth, credentials

# Load environment variables from .env file
load_dotenv()


class TokenService:
    user: UserFirebase | None
    user_id: int

    SECRET_KEY = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    ALGORITHM = "HS256"
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    """
    ------------------------------
    --- Firebase Config ---
    ------------------------------
    """
    # Example JSON content of the service account key
    service_account_info = {
        "type": os.getenv("FIREBASE_TYPE"),
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
        "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
        "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
        "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN"),
    }

    # Initialize the Firebase app with a service account, granting admin privileges
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

    def __init__(self, user: int | UserFirebase | None = None):
        if user is not None:
            if isinstance(user, UserFirebase):
                self.user = user
                self.user_id = user.user_id
            else:
                self.user = None
                self.user_id = user


    @classmethod
    async def fetch_user_firebase(
        cls, credential: HTTPAuthorizationCredentials
    ) -> UserFirebase:
        if cls.cred is None:
            raise cls.credentials_exception
        try:
            # Verify the ID token while checking if the token is revoked by passing check_revoked=True.
            decoded_token = auth.verify_id_token(credential.credentials)
            
            userFirebase = UserFirebase(
                user_id=decoded_token.get("uid"),
                username=decoded_token.get("name"),
                email=decoded_token.get("email"),
                is_verified_email=decoded_token.get("email_verified"),
                is_active=True,
            )
        except Exception as err:
            raise cls.credentials_exception
        return userFirebase
