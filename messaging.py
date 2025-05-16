from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = 'ACead5455bc45359d58245cd978929e8d1'
auth_token = os.getenv('MESSAGING_API')

client = Client(account_sid, auth_token)
message = client.messages.create(
  from_='+18887896447',
  body='hello',
  to='+13312340334'
)
print(message.sid)