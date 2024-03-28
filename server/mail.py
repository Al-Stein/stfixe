import imaplib
import email
import json
import time
import websocket
from pymongo import MongoClient
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Function to extract subject information
def extract_subject_info(subject):
    try:
        info = subject.split(';')
        return {
            'initiateur': info[1],
            'numero de tt': info[3],
            'id connexion': info[4],
            'site client': info[6],
            'raison social': info[7],
            'seen': False
        }
    except Exception as e:
        logger.error(f'Error while extracting subject info: {e}')
        return None

# Email credentials and server settings (retrieve from environment variables)
EMAIL = os.environ['DEVHUBSTATION_EMAIL']
PASSWORD = os.environ['DEVHUBSTATION_PASSWORD']
IMAP_SERVER = 'devhubstation.com'
IMAP_PORT = 993

# Connect to the IMAP server
try:
    mail = imaplib.IMAP4_SSL(IMAP_SERVER)
    mail.login(EMAIL, PASSWORD)
    mail.select('inbox')
    logger.info(f'connected to {EMAIL}')
except Exception as e:
    logger.error(f'Cannot connect to email: {e}')

try:
    ws = websocket.create_connection('ws://localhost:8080')
    logger.info('websocket connected on ws://localhost:8080')
except Exception as e:
    logger.error(f'websocket error: {e}')

# MongoDB connection
client = MongoClient('mongodb://127.0.0.1:27017/')
db = client['stfixe']
collection = db['crtl_emails']

try:
    while True:
        try:
            # Search for unread emails with 'CRTL' in the subject
            result, data = mail.search(None, '(UNSEEN SUBJECT "CRTL")')
            if result == 'OK':
                email_ids = data[0].split()
                if len(email_ids) > 0:
                    payload = []
                    for id in email_ids:
                        result, data = mail.fetch(id, '(RFC822)')
                        if result == 'OK':
                            raw_email = data[0][1]
                            msg = email.message_from_bytes(raw_email)
                            subject = msg['subject']
                            crtl = extract_subject_info(subject)
                            if crtl:
                                payload.append(crtl)

                    if payload:
                        try:
                            collection.insert_many(payload)
                            ws.send(json.dumps({'type': 'new_crtl'}))
                            logger.info(f'Inserted to database mails: {payload}')
                        except Exception as e:
                            logger.error(f'Error while inserting to db: {e}')
        except Exception as e:
            logger.error(f'Error while fetching email: {e}')
        time.sleep(10) # Wait 10 seconds before checking for new emails
except KeyboardInterrupt:
    logger.info('Process interrupted by user')
finally:
    mail.close()
    mail.logout()
