const express = require('express');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const nodemailer = require('nodemailer');

const uuid = () => {
  return Math.random().toString(26).slice(2);
};



const router = express.Router();
const db = new JsonDB(new Config("db", true, false, '/'));



// GET /api/emails
router.get('/emails', (req, res) => {
  const emails = db.getData('/emails');
  res.json(emails);
});

// POST /api/test with email address
router.post('/test', (req, res) => {
  const { emailAddress } = req.body;
  console.log(emailAddress);
  const id = uuid();
  const content = `You won iphone <a href="http://localhost:4000/api/link?id=${id}">click here</a>`
  const emailObject = {
    id,
    email: emailAddress,
    emailContent: content,
    status: 'Submitted'
  }
  db.push('/emails', { [id]: emailObject }, false);
  // actually send email here
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  () => async () => {
    await transporter.sendMail({
      from: '"test" <test@gmail.com>',
      to: "test2@gmail.com, baz@example.com",
      subject: "Hello ✔",
      text: content,
      html: content,
    });
  }

  res.json({ status: 'submitted' });
});
// GET /api/link, this will update email status of phised
router.get('/link', (req, res) => {
  const { id } = req.query;
  const emails = db.getData('/emails');
  // update email status to phished
  emails[id].status = 'Phished';
  db.push('/emails', emails);
  res.send('You got phished');
});

module.exports = router;
