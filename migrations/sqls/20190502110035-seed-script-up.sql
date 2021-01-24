/* Replace with your SQL commands */
SET search_path
TO main,public;

insert into roles
  (name, role_key, permissions)
values
  ('Super Admin', 1, '{}');
insert into roles
  (name, role_key, permissions)
values
  ('Admin', 2, '{}');
insert into roles
  (name, role_key, permissions)
values
  ('Seller', 3, '{}');
insert into roles
  (name, role_key, permissions)
values
  ('Customer', 4, '{}');

/* Password - test123!@# */
insert into account
  (first_name, last_name, username, role_id)
select 'System', 'Seller', 'system_seller@test.com', id
from roles
where name = 'Seller';
insert into user_credentials
  (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from account
where username = 'system_seller@test.com';

/* Password - test123!@# */
insert into account
  (first_name, last_name, username, role_id)
select 'System', 'Customer', 'system_customer@test.com', id
from roles
where name = 'Customer';
insert into user_credentials
  (user_id, auth_provider, password)
select id, 'internal', '$2a$10$TOLMGK43MjbibS8Jap2RXeHl3.4sJcR3eFbms2dBll2LTMggSK9hG'
from account
where username = 'system_customer@test.com';

insert into auth_clients
  (client_id, client_secret, secret)
values
  ('my_dukaan_web', 'saqw21!@#', 'plmnkoqazxsw');

insert into auth_clients
  (client_id, client_secret, secret)
values
  ('my_dukaan_mobile', 'saqw21#$%', 'plmnkoqazxsw');
