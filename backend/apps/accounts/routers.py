from fastapi import APIRouter, Depends, status
from apps.accounts import schemas
from apps.accounts.services.authenticate import AccountService
from apps.accounts.services.user import UserManager


router = APIRouter(prefix="/accounts", tags=["Users"])

@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=schemas.UserResponse,
    summary="Retrieve current user",
    description="Retrieve current user if user is active.",
)
async def retrieve_me(
    current_user: schemas.UserFirebase = Depends(AccountService.current_user_firebase),
):
    return {"user": UserManager.to_dict(current_user)}
