const dateFormat = require('dateformat');

exports.aDeeperLoveTextEmailFrom = contactInfo => `
	Name: ${contactInfo.name}
	Email Address: ${contactInfo.emailAddress}
	Phone Number: ${contactInfo.phoneNumber}
	Message: ${contactInfo.message}
`;

exports.aDeeperLoveHtmlEmailFrom = contactInfo => `
	<table width="550" cellspacing="0" cellpadding="4" style="border:1px #000 solid;">
		<thead>
			<tr>
				<th colspan="2" style="background:#96858F; color:#fff; text-align:center;font-weight:bold;">
          A Deeper Love Retreat - Contact Information
        </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Name</strong></td>
				<td>${contactInfo.name}</td>
			</tr>
			<tr style="background:#D5D5D5">
				<td><strong>Email Address</strong></td>
				<td><a href="mailto:${contactInfo.emailAddress}">${contactInfo.emailAddress}</a></td>
			</tr>
			<tr>
				<td><strong>Phone Number</strong></td>
				<td>${contactInfo.phoneNumber}</td>
			</tr>
			<tr style="background:#D5D5D5">
				<td><strong>Message</strong></td>
				<td>${contactInfo.message}</td>
			</tr>
		</tbody>
	</table>
`;

exports.happilyEverHageSaveTheDateText = () => `
Save the Date

Abby Hanson and Joey Hage

November 9th, 2019

West Des Moines, IA

www.happilyeverhage.com
`;

exports.happilyEverHageSaveTheDateHtml = invitationID => `
  <div style="width:100%;">
    <div style="width:100%;background-color:#06182b">
      <img src="https://lh3.googleusercontent.com/7fjwurRWXSUEy462fQUe8n1EOTB5ptGsRxAINiM6aYJoMydFiv5DkNSx4T5eUZhmiYn3N_86xzbg0u1xsZpdtVtU_Kk9VYK3PIIz116yNGhafsD0Lk8JeiFKgGZYIZ2OXmm9hzJK4k5zehLTXBaYEjcq7MPRdGSqRzcsBJwEAhGMrP1iqrOsKqEoy9Jyi6fXCijAz-dOPn6SbVySOnMsIiFfzRE4v3risU6NX4bxavybxZbGGuwqh5CKf9cjf7dpuusFmICNQQXKiP4KgFgIJnR7sRzdXtNdezdrsG-_hd2DWLY-amgiwbtQQ0Rggbi7q6_10MRMOzywXL81fm9Rf13X0998rTqIWJpjdkOWYzx68JhYk950HI8Na47KNh_PqJvVSOkOqxMiNRve_ytjOKFRT_2J_XVaH7u3ea9cpVy_5B3I-L_kfrd188usLHISSUvvdSAp6YS-He3TWdZk_Pu3g1PfkUkmfCwcG1tfzV_txcZ0UUO5UMzLbn2zzmvbmF0XSc9SWBnJdcSl-T-bQLc9jEc7ecHUxEELWqkXyUu6lSc76Y2NpzWrWM4jkXzeuG4why5n-_49m5Vgi_8xFUVPbiWO2BHh6wFXJDpAtk-cpDvhdjwV7f_GNmltN1ZUMn3Uq6Clj74P9aac6gf_UxFkSURz1RyOgDVcwerYtZOYUup3gSuRuAXfOwhmVII16TaPIgTA3KEmAPKzVgSK19If=w1706-h1322-no" alt="Save the Date - Abby Hanson and Joey Hage" style="width:100%" />
      <div style="width:100%;margin-top:15px">
        <p style="font-family:Georgia,Lato,Helvetica,Arial,sans-serif;margin:0;margin-bottom:0;padding:0;font-size:22px;line-height:23px;text-align:center;white-space:nowrap;width:100%" align="center" width="100%">
          <a href="https://www.happilyeverhage.com/invite#${invitationID}" style="font-family: Georgia,Lato,Helvetica,Arial,sans-serif;margin:0;margin-bottom:10px;padding:0;border:1px solid #b7a652;color:#fff;outline:none;text-decoration:none;background-color:#b7a652;border-radius:2em;display:inline-block;font-size:18px;margin-left:5px;margin-right:5px;margin-top:0;text-align:center;vertical-align:middle;white-space:nowrap;width:auto" bgcolor="#b7a652" align="center" valign="middle" width="auto" target="_blank"><span style="background-color:#b7a652;border-color:#b7a652;border-radius:2em;border-style:solid;border-width:5px 20px;display:block;margin:6px 3px;vertical-align:middle" bgcolor="#b7a652" valign="middle">Visit Our Website</span></a>
        </p>
      </div>
    </div>
    <div style="width:100%;margin-top:45px;background-color:#f2f2f2">
      <p style="font-family:Arial,sans-serif;margin:0;margin-bottom:0;padding:40px 0 10px 0;color:#000;font-size:14px;line-height:23px;text-align:center;white-space:nowrap;width:100%" align="center" width="100%">
        <em>Copyright &copy; 2019, All rights reserved</em>
      </p>
      <p style="font-family:Arial,sans-serif;margin:0;margin-bottom:0;padding:10px 0 40px 0;color:#000;font-size:14px;line-height:23px;text-align:center;white-space:nowrap;width:100%" align="center" width="100%">
        <a href="mailto:happilyeverhage@gmail.com">Contact Abby and Joey</a>
      </p>
    </div>
  </div>
`;

exports.happilyEverHageRsvpUpdatesHtml = updates => `
  <div style="width:100%">
    <table style="background-color:#06182b;color:#e9f2fc;border-spacing:0;border-collapse:collapse;width:100%">
      <thead>
        <tr>
          <th style="border: solid #dbdbdb;border-width: 0 0 2px;background-color:#06182b;color:#e9f2fc;text-align:left;font-weight:bold;">Name</th>
          <th style="border: solid #dbdbdb;border-width: 0 0 2px;background-color:#06182b;color:#e9f2fc;text-align:left;font-weight:bold;">Invite Count</th>
          <th style="border: solid #dbdbdb;border-width: 0 0 2px;background-color:#06182b;color:#e9f2fc;text-align:left;font-weight:bold;">RSVP Count</th>
          <th style="border: solid #dbdbdb;border-width: 0 0 2px;background-color:#06182b;color:#e9f2fc;text-align:left;font-weight:bold;">RSVP Date</th>
        </tr>
      </thead>
      <tbody>
      ${updates.reduce((tableBody, update, index) => `
        ${tableBody}
        <tr style="background-color: ${index % 2 === 0 ? '#0c325a' : '#06182b'}">
          <td style="border: solid #dbdbdb;border-width: 0 0 1px;padding: .5em .75em;vertical-align: top;">${update.name}</td>
          <td style="border: solid #dbdbdb;border-width: 0 0 1px;padding: .5em .75em;vertical-align: top;">${update.invite_count}</td>
          <td style="border: solid #dbdbdb;border-width: 0 0 1px;padding: .5em .75em;vertical-align: top;">${update.rsvp_count}</td>
          <td style="border: solid #dbdbdb;border-width: 0 0 1px;padding: .5em .75em;vertical-align: top;">${dateFormat(update.rsvp_date, 'mediumDate')}</td>
        </tr>
      `, '')}
      </tbody>
    </table>
  </div>
`;
