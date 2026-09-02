# Password Reset Architecture

This document describes the secure implementation of the password reset flow in AI Data Analyzer.

## Flow Summary
1. **Account Lookup**: User submits an email or phone number.
2. **OTP Challenge**: A 6-digit OTP is generated cryptographically securely, hashed, and stored as a `PasswordResetChallenge`. The OTP is delivered via Email/SMS.
3. **OTP Verification**: The user submits the OTP. The system verifies the hash, checks attempt limits, and marks it as verified.
4. **Reset Authorization**: Upon successful verification, a short-lived `reset_token` is returned to the client and its hash is persisted.
5. **Password Reset**: The user submits the new password along with the `reset_token`. The system verifies the token, hashes the new password, and saves it.
6. **Session Revocation**: All previously active sessions for the user are immediately revoked.
7. **Login**: The user must log in again with their new password.

## Security Controls

### Account Enumeration Protection
The `POST /api/auth/forgot-password` endpoint always returns the exact same generic success message regardless of whether the account exists or not. This prevents attackers from testing if a given email is registered.

### OTP Generation and Storage
- **Generation**: Uses Python's `secrets.randbelow(1000000)` to generate an unpredictable 6-digit code.
- **Storage**: The plaintext OTP is NEVER stored. It is immediately hashed using SHA-256 before being inserted into PostgreSQL.

### Expiration and Limits
- **OTP Expiration**: The challenge is valid for exactly 5 minutes.
- **Attempt Limits**: Maximum of 5 failed verification attempts. Afterwards, the challenge is locked.
- **Resend Cooldown**: Must wait at least 60 seconds before requesting a new OTP.
- **Resend Limits**: Maximum of 3 resends per challenge.

### Reset Authorization
- The `challenge_id` alone cannot be used to reset the password.
- Verification yields a separate cryptographically random `reset_token`. This token is short-lived and single-use.

### Session Revocation
A successful password reset automatically revokes all existing `Session` records for the user. Any currently active browsers or devices will receive a `401 Unauthorized` on their next authenticated request and will be forced to log in again.

### Rate Limiting
- To mitigate brute force attacks, a basic rate-limiting service prevents spamming the forgot-password, verify, and resend endpoints.
- *Note for Production*: The current rate limiting is in-memory and MUST be replaced with a Redis-backed solution before deploying to production.

### OTP Delivery
- **Development**: OTPs are logged to the console using `send_dev_notification()`.
- **Production**: A real email/SMS delivery provider must be integrated into `otp_service.py` to route the notifications to actual users. Ensure `OTP_DELIVERY_MODE` is strictly enforced.
