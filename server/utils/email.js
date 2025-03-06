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
        this.from = "Shilat Dahan <shilat2132@gmail.com>";
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
        await this.send(`${this.firstName}, ברוכה הבאה לקוסמטיק`, "באופן רשמי את/ה חלק ממשפחת הקוסמטיק. \n עכשיו תוכל לקבוע תור מתי שרק תרצה")
    }

    async sendResetPassword(message, resetUrl){
        const html = `<p style="direction: ltr; text-align:left"><a href=${resetUrl}>${resetUrl}</a> <br/> ${message}</p>`
        await this.send('The link for resetting your password in Fitme expires in 10 minutes', message, html)
    }

    async sendScheduledAppt(message){
        await this.send("קבעת תור בהצלחה", message)
    }

    async sendCancelAppt(message){
        await this.send("התור שלך בוטל", message)
    }

    async sendApptNotification(message){
        await this.send("תזכורת", message)
    }


}


   

