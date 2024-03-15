import imaplib
import time

# IMAP server details
IMAP_SERVER = 'imap.gmail.com'
USERNAME = 'sentauri.server@gmail.com'
PASSWORD = 'dimamadride'

# Connect to the IMAP server
mail = imaplib.IMAP4_SSL(IMAP_SERVER)

# Login to the server
mail.login(USERNAME, PASSWORD)

# Select the INBOX folder
mail.select('INBOX')

# Enable IDLE mode
mail.idle()

try:
    while True:
        # Wait for an IDLE notification (new email)
        response = mail.idle_check(timeout=30)
        if response:
            # Handle new email notification
            print("New email received!")
            # You can fetch the new email here if needed
        time.sleep(1)  # Sleep for a while to avoid busy loop
except KeyboardInterrupt:
    # Exit gracefully
    print("Exiting...")
    mail.done()
    mail.logout()







