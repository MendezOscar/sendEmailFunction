const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const {onSchedule} = require("firebase-functions/v2/scheduler");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "emmaushonduras@gmail.com",
    pass: "hgbvydyyqkkanfyi",
  },
});

exports.sendEmail = onSchedule("0 7 * * *", async (event) => {
  const db = admin.firestore();
  const currentDate = new Date();
  const query = db.collection("students").where("email", "!=", null);

  const tasks = await query.get();

  tasks.forEach(async (snapshot) => {
    const {name, dateOfBirth, email} = snapshot.data();
    const newDateOfBirth = dateOfBirth.toDate();
    if (email != "#ERROR_#NAME?" && dateOfBirth != null) {
      if (
        currentDate.getDay() == newDateOfBirth.getDay() &&
        currentDate.getMonth() == newDateOfBirth.getMonth()
      ) {
        const mailOptions = {
          from: "emmaushonduras@gmail.com",
          to: email,
          subject: "Feliz cumpleaños",
          html: `<img src="https://i.postimg.cc/cHvdfdpY/HB.png" alt="hb" width="600" height="600">
              <h1>Feliz cumpleaños ${name}, Te desea Emmaus Honduras</h1>
                                          <p><h2>
                                             <b>Salmos 90.2</b><br> 
                                             Enséñanos de tal modo a contar
                                            nuestros días,<br>
                                            Que traigamos al corazón sabiduría.
                                          </h2></p>`,
        };
        return transporter.sendMail(mailOptions, (error, data) => {
          if (error) {
            return;
          }
          console.log("Sent!");
        });
      }
    }
  });
});
