# Gmail App Password Setup Instructions for AFN GRAPHICS

## ⚠️ IMPORTANT: Current Email Configuration Status

Your current `.env` file has:
```
NODEMAILER_EMAIL=afngraphics7867@gmail.com
NODEMAILER_PASSWORD=Fahad@1303
```

**⚠️ The password `Fahad@1303` appears to be your Google account password, NOT a Gmail App Password.**

Gmail requires a special 16-character **App Password** for third-party applications like Nodemailer. Using your regular Google account password will NOT work.

---

## 🔧 How to Generate Gmail App Password

### Step 1: Enable 2-Factor Authentication (2FA)
1. Go to: https://myaccount.google.com/security
2. Find **"2-Step Verification"** section
3. Click **"Get Started"** and follow the setup process
4. Complete the 2FA setup (you'll need your phone number)

### Step 2: Generate App Password
1. Once 2FA is enabled, go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Enter a name like: **"AFN Graphics Website"**
6. Click **"Generate"**
7. Google will show you a 16-character password like: `abcd efgh ijkl mnop`
8. **COPY THIS PASSWORD IMMEDIATELY** (you won't be able to see it again)

### Step 3: Update Your .env File
Replace the current password in `/app/.env`:

```env
NODEMAILER_EMAIL=afngraphics7867@gmail.com
NODEMAILER_PASSWORD=your_16_character_app_password_here
```

**Note:** Remove any spaces from the App Password when adding to .env

Example:
```env
# If Google shows: abcd efgh ijkl mnop
# Use in .env: abcdefghijklmnop
NODEMAILER_PASSWORD=abcdefghijklmnop
```

### Step 4: Restart the Server
After updating .env, restart the Next.js server:
```bash
sudo supervisorctl restart nextjs
```

---

## ✅ How to Test Email Functionality

### Test 1: Admin Login OTP
1. Go to Admin Login page
2. Enter credentials:
   - Username: `afngraphics7867`
   - Password: `Fahad@1303`
3. Click "Continue"
4. **If email is working:** You'll see a blue box saying "OTP sent to your email"
5. **If email fails:** You'll see a yellow box with the OTP displayed

### Test 2: Forgot Password OTP
1. Register a test user with a valid email address
2. Go to "Forgot Password" page
3. Enter the username/phone
4. Click "Send OTP"
5. **If email is working:** Check your inbox for the OTP email
6. **If email fails:** The OTP will be displayed on screen

---

## 🎨 Email Template Preview

Once configured, users will receive beautiful branded emails with:
- AFN Graphics logo and branding
- Gradient header (pink to purple)
- Large, easy-to-read 6-digit OTP
- 5-minute expiry notice
- Professional layout

---

## 🔒 Security Best Practices

1. ✅ **Never commit the App Password to version control**
2. ✅ **Keep the .env file secure**
3. ✅ **Revoke unused App Passwords from Google Account settings**
4. ✅ **Use different App Passwords for different applications**
5. ✅ **Monitor your Google Account for suspicious activity**

---

## ❓ Troubleshooting

### Problem: "Invalid login" error in server logs
**Solution:** Make sure you're using the App Password, not your account password

### Problem: "Less secure app access" warning
**Solution:** This is outdated. Gmail now requires App Passwords with 2FA enabled.

### Problem: Email takes too long to arrive
**Solution:** 
- Check spam folder
- Verify NODEMAILER_EMAIL is correct
- Ensure good internet connection on server

### Problem: Still seeing OTP on screen (yellow box)
**Solution:** 
1. Check `/var/log/supervisor/nextjs.out.log` for email errors
2. Run: `tail -f /var/log/supervisor/nextjs.out.log` and try logging in
3. Look for ❌ or ✅ email status messages

---

## 📧 Alternative: Using Different Email Provider

If you prefer not to use Gmail, you can use other providers:

### SendGrid (Recommended for production)
```env
# Update route.js to use SendGrid SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### Outlook/Office365
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

---

## 📚 Additional Resources

- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- 2-Step Verification: https://support.google.com/accounts/answer/185839
- Nodemailer Documentation: https://nodemailer.com/

---

**Last Updated:** April 2026
**Created for:** AFN Graphics E-commerce Platform
