const mysql = require('mysql');
const debug = require('debug');

const error = debug('mysql:error');
const log = debug('mysql:log');
log.log = console.log.bind(console);

class MySqlManager {
  constructor() {
    this.createPool();
  }

  createPool() {
    log('Creating pool');

    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
  }

  endPool() {
    return new Promise(resolve => {
      this.pool.end(err => {
        if (err) {
          error(err);
        } else {
          log('Pool ended successfully.');
        }
        resolve();
      });
    });
  }

  sqlQueryHandler(sqlStatement, sqlParams) {
    return new Promise((resolve, reject) => {
      this.pool.query(sqlStatement, sqlParams, (err, results, fields) => {
        if (err) {
          error('Error executing query', sqlStatement, sqlParams, err);
          return reject(err);
        }
        resolve(results, fields);
      });
    });
  }

  testPoolConnection() {
    return new Promise((resolve, reject) => {
      log('Testing pool connection...');
      this.pool.getConnection((err, connection) => {
        if (err) {
          error('Error testing pool connection', err);
          return reject(err);
        }
        connection.ping(err => {
          connection.release();
          if (err) {
            error('Error pinging server', err);
            return reject(err);
          }
          log('Successfully connected to database');
          resolve();
        });
      });
    });
  }

  collectStats() {
    return this.sqlQueryHandler(
      'select sum(invite_count) as inviteCount, '
      + 'sum(rsvp_count) as rsvpCount, '
      + '('
      + '    select sum(invite_count - rsvp_count) '
      + '    from invitation where rsvp_date is not null'
      + ') as willNotAttend '
      + 'from invitation i'
    );
  }

  retrieveAllInvitations() {
    return this.sqlQueryHandler('select * from person p, invitation i where p.invitation_id=i.invitation_id'
                                + ' order by name asc');
  }

  saveTheDateSent(inviteUUID) {
    return this.sqlQueryHandler(
      'update invitation set save_the_date_sent=true where invitation_id=?',
      [inviteUUID]
    );
  }

  getInvitationWithID(inviteUUID) {
    return this.sqlQueryHandler(
      'select * from invitation i, person p where i.invitation_id=p.invitation_id and i.invitation_id=?',
      [inviteUUID]
    );
  }

  createPerson(personUUID, person, inviteUUID) {
    return this.sqlQueryHandler(
      'insert into person (person_id,name,invitation_id) values (?,?,?)',
      [personUUID, person.name, inviteUUID]
    );
  }

  createInvitation(inviteUUID, invitation) {
    return this.sqlQueryHandler(
      'insert into invitation (invitation_id,invite_count,email_address,email_address_2) values (?,?,?,?)',
      [inviteUUID, invitation.inviteCount, invitation.emailAddress, invitation.emailAddress2]
    );
  }

  findInvitation(query) {
    const lowerQuery = query.toLowerCase();
    return this.sqlQueryHandler(
      'select * from invitation i, person p where i.invitation_id=p.invitation_id and (lower(p.name)=? '
      + 'or lower(email_address)=? or lower(email_address_2)=?) limit 1',
      [lowerQuery, lowerQuery, lowerQuery]
    );
  }

  rsvp(rsvpCount, inviteUUID) {
    return this.sqlQueryHandler(
      'update invitation set rsvp_count=?,rsvp_date=? where invitation_id=? and invite_count>=?',
      [rsvpCount, this.formatDate(new Date()), inviteUUID, rsvpCount]
    );
  }

  getRsvpUpdatesForYesterday() {
    const today = new Date();
    today.setDate(today.getDate() - 1);

    const rsvpDate = this.formatDate(today);
    log('getRsvpUpdatesForYesterday - date:', rsvpDate);
    return this.sqlQueryHandler(
      'select name, invite_count, rsvp_count, rsvp_date from invitation i, person p '
      + 'where i.invitation_id=p.invitation_id and rsvp_date=?',
      [rsvpDate]
    );
  }

  formatDate(date) {
    const dates = date.toLocaleDateString('en-US', { timeZone: 'America/Chicago' })
                      .split('/');

    return `${dates[2]}-${dates[0].padStart(2, '0')}-${dates[1].padStart(2, '0')}`;
  }
}

let mySqlManager;

exports.mySqlManager = () => {
  if (!mySqlManager) {
    mySqlManager = new MySqlManager();
  }
  return mySqlManager;
};