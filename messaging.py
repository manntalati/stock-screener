from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.getenv('ACCOUNT_SID')
auth_token = os.getenv('AUTH_TOKEN')

client = Client(account_sid, auth_token)
message = client.messages.create(
  from_='+18887896447',
  body='hello',
  to='+13312340334'
)
print(message.sid)