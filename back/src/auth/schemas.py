from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
<<<<<<< HEAD
    email: str | None = None
=======
    email: str | None = None
>>>>>>> 64d9d8a (basic auth with migration)
