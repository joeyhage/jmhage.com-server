const express = require('express');
const router = express.Router({});
const debug = require('debug');
const jwtCheck = require('../middleware/jwt-middleware').jwtCheck;
const Joi = require('@hapi/joi');

const error = debug('server:error');

const mySqlManager = require('../mysql/mysql-manager').mySqlManager();

router.use('/admin', jwtCheck, require('./happilyeverhage-admin').happilyeverhageAdminRouter);

router.get('/invitations/id/:invitationID', (req, res) => {
  const { invitationID } = req.params;
  if (!/^[a-fA-F0-9-]{36}$/.test(invitationID)) {
    error('happilyeverhage:getInvitationWithID - Bad invitation ID');
    return res.sendStatus(400);
  }
  mySqlManager
    .getInvitationWithID(invitationID)
    .then(results => {
      if (results && results.length) {
        return res.status(200).json(results[0]);
      } else {
        error('happilyeverhage:getInvitationWithID - No results found for invitation ID ' + invitationID);
        return res.sendStatus(400);
      }
    })
    .catch(err => {
      error('happilyeverhage:getInvitationWithID', err);
      return res.sendStatus(500);
    });
});

router.get('/invitations/find/:query', (req, res) => {
  const { query } = req.params;
  const schema = Joi.object().keys({
    query: Joi.alternatives(
      Joi.string().regex(/^[a-zA-Z,.'& -]{1,50}$/).required(),
      Joi.string().email().required()
    )
  });
  const result = Joi.validate({ query }, schema);
  if (result.error) {
    error('happilyeverhage:findInvitationByName - Bad search query', result.error);
    return res.sendStatus(400);
  }
  mySqlManager
    .findInvitation(query.trim())
    .then(results => {
      if (results && results.length) {
        return res.status(200).json(results[0]);
      } else {
        error('happilyeverhage:findInvitationByName - No results found for search query ' + query);
        return res.sendStatus(400);
      }
    })
    .catch(err => {
      error('happilyeverhage:findInvitationByName', err);
      return res.sendStatus(500);
    });
});

router.post('/rsvp', (req, res) => {
  const { invitation_id, rsvp_count } = req.body;
  if (!/^[a-fA-F0-9-]{36}$/.test(invitation_id)) {
    error('happilyeverhage:rsvp - Bad invitation ID');
    return res.sendStatus(400);
  }
  if (isNaN(parseInt(rsvp_count)) || parseInt(rsvp_count) > 20) {
    error('happilyeverhage:rsvp - Bad rsvp count');
    return res.sendStatus(400);
  }
  mySqlManager
    .rsvp(rsvp_count, invitation_id)
    .then(results => {
      if (results && results.affectedRows > 0) {
        return res.sendStatus(200);
      } else {
        error('happilyeverhage:rsvp - Unable to RSVP for invitationID ' + invitation_id);
        return res.sendStatus(400);
      }
    })
    .catch(err => {
      error('happilyeverhage:rsvp', err);
      return res.sendStatus(500);
    });
});

// router.post('/mass-add', (req, res) => {
//   for (const record of req.body) {
//     try {
//       const inviteUUID = uuid();
//       const invitation = { inviteCount: parseInt(record[0]) };
//       if (record[2].trim().length > 0) {
//         invitation.emailAddress = record[2].trim();
//       }
//       if (record[3].trim().length > 0) {
//         invitation.emailAddress2 = record[3].trim();
//       }
//       mySqlManager
//         .createInvitation(inviteUUID, invitation)
//         .then(() => mySqlManager
//           .createPerson(uuid(), { name: record[1].trim() }, inviteUUID)
//           .catch(err => {
//             error('happilyeverhage:createPerson', err);
//             return res.sendStatus(500);
//           }))
//         .catch(err => {
//           error('happilyeverhage:createInvitation', err);
//           return res.sendStatus(500);
//         });
//     } catch (e) {
//       error('happilyeverhage:createInvitation. Error with record ' + record[1], e);
//     }
//   }
//   res.sendStatus(200);
// });

exports.happilyeverhageRouter = router;