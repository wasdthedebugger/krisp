const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const xlsx = require('xlsx');

//we can add more words synonymous to feedback to increase the chances of finding feedback emails
const feedbackWords = ['feedback', 'review', 'complaint', 'suggestion', 'improvement'];

//our keys and tokens
const clientId = "YOUR CLIENT ID";
const clientSecret = "YOUR CLIENT SECRET";
const refreshToken = "YOUR REFRESH TOKEN";

//setting up the OAuth2 client
const oAuth2Client = new OAuth2(clientId, clientSecret);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

//setting up the Gmail API
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//fetching the emails from the inbox
const getFeedbackEmails = async () => {
    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            //specifying the query to fetch only the emails received in the last 24 hours
            q: 'in:inbox newer_than:1d'
        });

        const emails = res.data.messages;
        const emailDetails = [];

        //iterating through the emails to find the ones containing feedback words
        for (const email of emails) {
            const message = await gmail.users.messages.get({
                userId: 'me',
                id: email.id,
                format: 'full'
            });

            const payload = message.data.payload;
            const parts = payload.parts;
            let emailBody = '';

            //checking if the email contains parts
            if (parts) {
                for (const part of parts) {
                    if (part.mimeType === 'text/plain' && part.body.data) {
                        emailBody = Buffer.from(part.body.data, 'base64').toString('utf8');
                    }
                }
            } else {
                emailBody = payload.body.data ? Buffer.from(payload.body.data, 'base64').toString('utf8') : '';
            }

            //extracting the email subject and from details
            const emailSubject = payload.headers.find(header => header.name === 'Subject').value;
            const emailFrom = payload.headers.find(header => header.name === 'From').value;

            //checking if the email contains any feedback words
            if (feedbackWords.some(word => emailSubject.toLowerCase().includes(word)) || feedbackWords.some(word => emailBody.toLowerCase().includes(word))) {
                emailDetails.push({ subject: emailSubject, body: emailBody, from: emailFrom });
            }
        }

        //storing the email details in an Excel file
        if (emailDetails.length > 0) {
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(emailDetails);
            xlsx.utils.book_append_sheet(wb, ws, 'Feedback Emails');
            xlsx.writeFile(wb, 'feedback_emails.xlsx');
            console.log('Email details stored in feedback_emails.xlsx');
        } else {
            console.log('No feedback emails found.');
        }
    } catch (error) {
        console.log(error.message);
    }
}

getFeedbackEmails();
