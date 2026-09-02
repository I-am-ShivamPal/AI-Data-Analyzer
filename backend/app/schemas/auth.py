from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    contact: str
    # contact_type could be inferred but it's good to specify if needed.
    # The requirement says email or phone.

class VerifyOTPRequest(BaseModel):
    challenge_id: str
    otp: str

class ResendOTPRequest(BaseModel):
    challenge_id: str

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str
    confirm_password: str
