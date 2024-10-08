from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from apps.accounts.schemas import UserFirebase
from apps.accounts.services.token import TokenService


class AccountService:
    @classmethod
    async def current_user_firebase(
        cls,
        credential: HTTPAuthorizationCredentials = Depends(
            HTTPBearer(auto_error=False)
        ),
    ) -> UserFirebase:
        user = await TokenService.fetch_user_firebase(credential)
        return user
