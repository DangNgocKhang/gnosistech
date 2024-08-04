from apps.accounts.schemas import UserFirebase
from apps.core.date_time import DateTime


class UserManager:

    @staticmethod
    def to_dict(user: UserFirebase):
        """
        Convert a User object to a dictionary.
        """
        _dict = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "is_verified_email": user.is_verified_email,
        }
        return _dict
