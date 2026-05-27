import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from database import get_settings
import logging

logger = logging.getLogger("skillforge.email")

WELCOME_HTML = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to SkillForge</title>
  <style>
    body {{
      background-color: #0b0f19;
      color: #d1d5db;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }}
    .container {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #111827;
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }}
    .header {{
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      padding: 40px 20px;
      text-align: center;
    }}
    .header h1 {{
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.05em;
    }}
    .content {{
      padding: 40px 30px;
    }}
    .content p {{
      font-size: 16px;
      line-height: 1.6;
      color: #9ca3af;
      margin: 0 0 20px 0;
    }}
    .features-list {{
      margin: 0 0 30px 0;
      padding: 0;
      list-style-type: none;
    }}
    .features-list li {{
      font-size: 15px;
      color: #d1d5db;
      margin-bottom: 12px;
      padding-left: 24px;
      position: relative;
    }}
    .features-list li::before {{
      content: "⚡";
      position: absolute;
      left: 0;
      color: #a78bfa;
    }}
    .cta-container {{
      text-align: center;
      margin: 40px 0 20px 0;
    }}
    .cta-button {{
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 30px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 10px;
      display: inline-block;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
    }}
    .footer {{
      background-color: #0d121f;
      padding: 20px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }}
    .footer p {{
      font-size: 12px;
      color: #4b5563;
      margin: 0;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillForge</h1>
    </div>
    <div class="content">
      <p>Hi {username},</p>
      <p>Welcome to <strong>SkillForge</strong>-the ultimate AI-powered personalized learning copilot! We are thrilled to have you join our learning community.</p>
      
      <p>Your workspace is fully unlocked and loaded with features designed to take you from beginner to job-ready programmer:</p>
      
      <ul class="features-list">
        <li><strong>Personalized AI Roadmaps:</strong> Structured, customized plans designed for your skill levels and learning timeline.</li>
        <li><strong>AI Interactive Lessons & Quizzes:</strong> Deep-dive explanations, real-world examples, and quick checks to test your understanding.</li>
        <li><strong>Embedded Practice IDE:</strong> Write and execute code directly in your browser without any configuration.</li>
        <li><strong>AI Chat Mentor & Code Reviews:</strong> Ask questions, get line-by-line feedback, and practice mock technical rounds 24/7.</li>
      </ul>
      
      <div class="cta-container">
        <a href="http://localhost:5173/dashboard" class="cta-button">Create Your First Roadmap</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; {year} SkillForge. All rights reserved.</p>
      <p>Master any skill with your AI co-pilot.</p>
    </div>
  </div>
</body>
</html>
"""

SUBSCRIBER_HTML = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You're on the Pre-Launch List!</title>
  <style>
    body {{
      background-color: #0b0f19;
      color: #d1d5db;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }}
    .container {{
      max-width: 600px;
      margin: 40px auto;
      background-color: #111827;
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }}
    .header {{
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      padding: 40px 20px;
      text-align: center;
    }}
    .header h1 {{
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.05em;
    }}
    .content {{
      padding: 40px 30px;
    }}
    .content p {{
      font-size: 16px;
      line-height: 1.6;
      color: #9ca3af;
      margin: 0 0 20px 0;
    }}
    .badge {{
      background-color: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      font-weight: bold;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 20px;
    }}
    .footer {{
      background-color: #0d121f;
      padding: 20px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }}
    .footer p {{
      font-size: 12px;
      color: #4b5563;
      margin: 0;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillForge</h1>
    </div>
    <div class="content">
      <div class="badge">🔮 Pre-Launch List Registered</div>
      <p>Thank you for subscribing to stay updated on our upcoming pricing model!</p>
      
      <p>We are currently designing pocket-friendly credit refilling packages and flat-rate plans to support advanced AI features while keeping the platform accessible to everyone.</p>
      
      <p><strong>Till then, enjoy your completely free learning!</strong> All features-including AI custom roadmaps, code reviews, and mock interview preparations-remain 100% active, free of cost, and fully unlocked for you.</p>
      
      <p>We will notify you immediately at this email address as soon as the sustainable plans launch.</p>
    </div>
    <div class="footer">
      <p>&copy; {year} SkillForge. All rights reserved.</p>
      <p>Master any skill with your AI co-pilot.</p>
    </div>
  </div>
</body>
</html>
"""

def _send_email_sync(to_email: str, subject: str, html_content: str):
    settings = get_settings()
    if not settings.smtp_user or not settings.smtp_password:
        print("[EMAIL SERVICE] SMTP Credentials not configured in .env. Skipping welcome email notification.")
        logger.warning("SMTP Credentials not configured. Skipping welcome email.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.smtp_from
        msg["To"] = to_email
        
        part = MIMEText(html_content, "html")
        msg.attach(part)
        
        # Connect to SMTP server
        server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
        server.ehlo()
        server.starttls() # Enable security
        server.ehlo()
        server.login(settings.smtp_user, settings.smtp_password)
        server.sendmail(settings.smtp_from, to_email, msg.as_string())
        server.quit()
        print(f"[EMAIL SERVICE] Successfully sent email to {to_email}: {subject}")
    except Exception as e:
        print(f"[EMAIL SERVICE ERROR] Failed to send email to {to_email}: {str(e)}")
        logger.error(f"Failed to send email to {to_email}: {str(e)}")

def send_welcome_email(to_email: str, username: str):
    from datetime import datetime
    year = datetime.utcnow().year
    html = WELCOME_HTML.format(username=username, year=year)
    _send_email_sync(to_email, "Welcome to SkillForge! ⚡ Your Learning Path Awaits", html)

def send_subscription_email(to_email: str):
    from datetime import datetime
    year = datetime.utcnow().year
    html = SUBSCRIBER_HTML.format(year=year)
    _send_email_sync(to_email, "You're on the SkillForge Pre-Launch List! 🔮", html)
