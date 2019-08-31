const express = require('express');
const debug = require('debug');
const router = express.Router({});
const uuid = require('uuid/v4');

const error = debug('server:error');

const mySqlManager = require('../mysql/mysql-manager').mySqlManager();

router.get('/stats', (req, res) => {
  mySqlManager
    .collectStats()
    .then(results => res.status(200).json(results[0]))
    .catch(err => {
      error('happilyeverhage-admin:collectStats', err);
      return res.sendStatus(500);
    });
});

router.get('/allInvitations', (req, res) => {
  mySqlManager
    .retrieveAllInvitations()
    .then(results => res.status(200).json(results))
    .catch(err => {
      error('happilyeverhage-admin:retrieveAllInvitations', err);
      return res.sendStatus(500);
    });
});

router.get('/invitations/:invitationID', (req, res) => {
  mySqlManager
    .getInvitationWithID(req.params.invitationID)
    .then(results => res.status(200).json(results[0]))
    .catch(err => {
      error('happilyeverhage-admin:getInvitationWithID', err);
      return res.sendStatus(500);
    });
});

router.post('/create', (req, res) => {
  const { person, invitation } = req.body;
  const inviteUUID = uuid();
  mySqlManager
    .createInvitation(inviteUUID, invitation)
    .then(() => mySqlManager
      .createPerson(uuid(), person, inviteUUID)
      .then(() => res.status(200).json({ invitation_id: inviteUUID }))
      .catch(err => {
        error('happilyeverhage-admin:createPerson', err);
        return res.sendStatus(500);
      }))
    .catch(err => {
      error('happilyeverhage-admin:createInvitation', err);
      return res.sendStatus(500);
    });
});

exports.happilyeverhageAdminRouter = router;