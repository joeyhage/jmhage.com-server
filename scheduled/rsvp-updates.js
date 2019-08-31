const sendRsvpUpdates = require('../routes/mail').sendRsvpUpdates;
const mySqlManager = require('../mysql/mysql-manager').mySqlManager();
const debug = require('debug');

const error = debug('server:error');
const log = debug('server:log');
log.log = console.log.bind(console);

log('Starting rsvp-updates job');

function sendUpdates(updates) {
  const numberOfUpdates = Boolean(updates && updates.length) ? updates.length : 0;
  log(`Found ${numberOfUpdates} RSVP update(s)`);
  sendRsvpUpdates(updates, numberOfUpdates)
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      error('Failed to send rsvp updates', err);
      process.exit(1);
    });
}

mySqlManager
  .getRsvpUpdatesForYesterday()
  .then(sendUpdates)
  .catch(err => {
    error('Failed to retrieve rsvp updates from database', err);
    process.exit(1);
  })
  .finally(() => mySqlManager.endPool().then(() => { /* do nothing */ }));
