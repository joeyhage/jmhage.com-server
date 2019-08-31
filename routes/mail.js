const express = require('express');
const router = express.Router({});
const nodemailer = require('nodemailer');
const validateContactInfo = require('../middleware/validation-middleware').validateContactInfo;
const emailFormatter = require('../util/email-formatter');
const dkimPrivateKey = require('../resources/dkim-private-key');
const debug = require('debug');

const error = debug('server:error');
const log = debug('server:log');
log.log = console.log.bind(console);

const mySqlManager = require('../mysql/mysql-manager').mySqlManager();

const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.mailgun.org',
  secure: false,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  },
  disableFileAccess: true,
  disableUrlAccess: true
});

const dkim = {
  domainName: 'jmhage.com',
  keySelector: 'email',
  privateKey: dkimPrivateKey
};

async function sendError(caughtError) {
  try {
    await transporter.sendMail({
      from: `jmhage.com <no-reply@jmhage.com>`,
      to: 'joeyhage@outlook.com',
      subject: 'jmhage.com - Error',
      html: `<p>${caughtError}</p>`,
      dkim
    });
    log(`Error sent successfully`);
  } catch (err) {
    error('Error failed to send', err);
  }
}

async function sendRsvpUpdates(updates, numberOfUpdates) {
  try {
    await transporter.sendMail({
      from: `HappilyEverHage <no-reply@jmhage.com>`,
      to: 'joeyhage@outlook.com;abigail.i.hanson@gmail.com',
      subject: 'HappilyEverHage - RSVP Updates',
      html: numberOfUpdates > 0
            ? emailFormatter.happilyEverHageRsvpUpdatesHtml(updates)
            : '<p>No updates yesterday</p>',
      dkim
    });
    log('RSVP updates sent successfully');
  } catch (err) {
    error('RSVP updates failed to send', err);
    await sendError(err);
  }
}

router.post('/adeeperloveretreat/contact', validateContactInfo, (req, res) => {
  const contactInfo = req.body;
  transporter.sendMail({
    from: `${contactInfo.name} <no-reply@jmhage.com>`,
    to: 'adeeperloveretreat@gmail.com',
    subject: 'A Deeper Love Retreat - Contact Information',
    text: emailFormatter.aDeeperLoveTextEmailFrom(contactInfo),
    html: emailFormatter.aDeeperLoveHtmlEmailFrom(contactInfo),
    dkim
  }).then(() => {
    log(`Contact info for ${contactInfo.name} sent successfully.`);
    res.sendStatus(200);
  }).catch(err => {
    error('Contact info that failed to send was', contactInfo, err);
    sendError(err).finally(() => res.sendStatus(500));
  });
});

async function sendSaveTheDate(invitation) {
  if (!invitation.email_address || invitation.save_the_date_sent) {
    return;
  }
  const recipients = invitation.email_address + (invitation.email_address_2 ? `;${invitation.email_address_2}` : '');
  log('Sending save the date to ' + recipients);
  try {
    await transporter.sendMail({
      from: 'Abby Hanson and Joey Hage <no-reply@jmhage.com>',
      to: recipients,
      subject: 'Save the Date - Abby and Joey\'s Wedding',
      text: emailFormatter.happilyEverHageSaveTheDateText(),
      html: emailFormatter.happilyEverHageSaveTheDateHtml(invitation.invitation_id),
      dkim
    });
  } catch (err) {
    error('Save the date failed to send to', invitation.email_address, err);
    return;
  }
  try {
    await mySqlManager.saveTheDateSent(invitation.invitation_id);
  } catch (e) {
    error(`Save the date sent successfully to ${invitation.email_address} but could not update database`);
    error(e);
  }
}

// router.get('/save-the-date', (req, res) => {
//   mySqlManager.retrieveAllInvitations().then(results => {
//     results.forEach((invitation, i) => {
//       setTimeout(() => sendSaveTheDate(invitation), 1000 * i);
//     });
//     res.sendStatus(200);
//   });
// });

exports.mailRouter = router;
exports.sendRsvpUpdates = sendRsvpUpdates;
