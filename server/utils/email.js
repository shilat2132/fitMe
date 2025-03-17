const nodemailer = require('nodemailer')


module.exports = class Email{
    /**  
     * @property to - to whom the email is for
     * @property firstName - the name of the user
     * @property from - the sender's name
      */
    constructor(user){
        this.to = user.email,
        this.firstName = user.name.split(' ')[0]
        this.from = "FitMe <shilat2132@gmail.com>";
    }

    /**
     * 
     * Creates and returns a transporter object for sending emails.
     * The transporter uses different configurations depending on whether the environment is 'production' or 'development'.
     * 
     * @returns {Object} transporter - A nodemailer transport object configured with the appropriate SMTP details.
     */
    newTransporter(){
        //in production mode we gonna use sendblue/brevo =same one
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
              host: process.env.SENDINBLUE_HOST, 
              port: process.env.SENDINBLUE_PORT,
              auth: {
                user: process.env.SENDINBLUE_LOGIN,
                pass: process.env.SENDINBLUE_PASSWORD,
              },
            });
          }
      
        return nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth:{
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }
        })
    }

    /** 
     * Sends an email with the specified subject, message, and optional HTML content.
     * 
     * @param {string} subject - The subject of the email.
     * @param {string} message - The plain text message of the email.
     * @param {string} [html] - The optional HTML content of the email.
     */
    async send(subject, message, html){
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: message
        }
        if(html){
            mailOptions.html = html
        }

        await this.newTransporter().sendMail(mailOptions)
    }

    async sendWelcome(){
        const html = `<p style="direction: ltr; text-align:left; font-size: 15px">Hello  ${this.firstName}! <br/> Now you can schedule workouts anytime you want. <br/> You are officialy part of the FitMe family</p>`
        await this.send("Welcome to Fitme", "", html)
    }

    async sendResetPassword(resetUrl){
        const html = `<p style="direction: ltr; text-align:left"><a href=${resetUrl}>${resetUrl}</a> <br/> 
            You applied a request for resetting your password? enter the link below. <br/> if you didn't request, please ignore this mail.
        </p>`
        await this.send('The link for resetting your password in Fitme expires in 10 minutes', "", html)
    }

    async sendScheduledAppt(workout, date, hour){
        date = new Date(date)
        const html = `<p style="direction: ltr; text-align:left; font-size: 15px"> You just scheduled a ${workout} workout, 
            at ${date.toISOString().split("T")[0]}, in ${hour}. <br/> If you can't come, please cancel the workout at least 24 hours ahead</p>`
        await this.send("You made an appointment for FitMe", "", html)
    }

    async sendCancelAppt(date, workout, hour, fromUser){
        date = new Date(date)
        let html = `<p style="direction: ltr; text-align:left; font-size: 15px"> ${fromUser ? "You": "The trainer or the manager"} just canceled your ${workout} workout, 
            at ${date.toISOString().split("T")[0]}, in ${hour}. </p> `
        
        await this.send("Workout canceled", "", html )
    }

}


   

