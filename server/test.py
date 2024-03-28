import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

# If modifying these scopes, delete token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
TOKEN_PATH = 'token.json'
CREDENTIALS_PATH = 'C:\Users\AL-STEIN\Desktop\stage\dashboard\server\credentials.json'

def load_saved_credentials_if_exist():
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, 'r') as token_file:
            credentials_data = json.load(token_file)
            credentials = Credentials.from_authorized_user_info(credentials_data)
            return credentials
    return None

def save_credentials(credentials):
    with open(CREDENTIALS_PATH, 'r') as credentials_file:
        keys = json.load(credentials_file)
        client_id = keys['installed']['client_id']
        client_secret = keys['installed']['client_secret']
    credentials_data = {
        'type': 'authorized_user',
        'client_id': client_id,
        'client_secret': client_secret,
        'refresh_token': credentials.refresh_token
    }
    with open(TOKEN_PATH, 'w') as token_file:
        json.dump(credentials_data, token_file)

def authorize():
    credentials = load_saved_credentials_if_exist()
    if credentials is not None and not credentials.expired:
        return credentials
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
        credentials = flow.run_local_server(port=0)
        save_credentials(credentials)
        return credentials

def watch_inbox():
    credentials = authorize()
    service = build('gmail', 'v1', credentials=credentials)

    response = service.users().messages().list(userId='me', q='is:unread subject:CRTL').execute()
    messages = response.get('messages', [])
    
    if not messages:
        print("No new messages with 'CRTL' in the subject found.")
    else:
        for message in messages:
            message_details = service.users().messages().get(userId='me', id=message['id']).execute()
            snippet = message_details['snippet']
            print("New message with 'CRTL' in the subject:")
            print(snippet)
    
    # Keep watching the inbox
    watch_inbox()

if __name__ == '__main__':
    watch_inbox()
