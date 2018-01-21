# Twilio Specialist on Demand Hackathon

This application is functional customer-to-specialist demo platform. It utilizes Twilio SMS and Video.

NOTE: Please review the code if you do not use it just as demo. It has been designed for demo purposes and has not been separately security checked.

## Functional Flow:
- After the appointment is created a link is sent to all participants
- When the customer clicks the link, the native mobile app/desktop web app launches and connects them to the designated room
- Before the participants join the room the phone number is verified with Twilio Phone Verification
- After the participants have been successfully verified the video connection is established

## One Click Install - Heroku

This will install the application and all the dependencies on Heroku (login required) for you. As part of the installation, the Heroku app will walk you through configuration of environment variables.  Please click on the following button to deploy the application.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nash-md/twilio-video-specialist-on-demand)


## Manual Install - On Your Own Server or Machine

This project requires [Node.js](http://nodejs.org/) 6 or greater.

Before you start the install, this demo requires a Twilio account if you haven't used Twilio before, welcome! You'll need to [Sign up for a Twilio account](https://www.twilio.com/try-twilio). 


### Install Dependencies and Setup Environment Variables

Fork and clone the repository. Navigate to the project directory in your terminal and run:

```bash
npm install
```
In order to run the demo you will need to set the following environment variables:

- `ACCOUNT_SID`
- `API_KEY_SID`
- `API_KEY_SECRET`
- `TWILIO_NUMBER`, a Twilio number we send the invitation SMS from

* For Account SID and API Key/Secret please click here:  https://www.twilio.com/console
* Buy a phone number or use an existing one (the application will configure the number for you later
* Create a Twilio Verify Service here: https://www.twilio.com/console/verify/applications

- `ACCOUNT_SECURITY_API_KEY` The Twilio Verify Service SID
- `BASE_URL` The url to your application

Start the application

`node app.js`

# Contributions

Contributions are welcome and generally accepted. For not trivial amendments it is a good idea to submit an issue explaining the proposed changes before a PR. This allows the maintainers to give guidance and avoid you doing duplicated work.

# License

MIT