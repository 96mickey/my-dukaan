DROP SCHEMA IF EXISTS main
CASCADE;
CREATE SCHEMA main;
GRANT ALL ON SCHEMA main TO public;

DROP SCHEMA IF EXISTS logs
CASCADE;
CREATE SCHEMA logs;
GRANT ALL ON SCHEMA logs TO public;

CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";

CREATE TABLE main.roles
(
	id uuid DEFAULT uuid_generate_v1() NOT NULL ,
	name varchar(100) NOT NULL ,
	created_on timestamptz(35) DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	modified_on timestamptz(35) DEFAULT CURRENT_TIMESTAMP NOT NULL ,
	deleted boolean DEFAULT false NOT NULL ,
	deleted_on timestamptz   ,
	deleted_by uuid   ,
	permissions text
	[]   ,
	role_key             integer  NOT NULL ,
	CONSTRAINT pk_roles_id PRIMARY KEY
	( id )
 );

	CREATE INDEX idx_roles_key ON main.roles ( role_key );


	CREATE TABLE main.account
	(
		id uuid DEFAULT uuid_generate_v1() NOT NULL ,
		first_name varchar(50)   ,
		middle_name varchar(50)   ,
		last_name varchar(50)   ,
		username varchar(150) NOT NULL ,
		email varchar(150)   ,
		phone varchar(15)   ,
		role_id uuid NOT NULL ,
		status integer DEFAULT 1 NOT NULL ,
		image char(200)   ,
		address jsonb   ,
		created_on timestamptz(35) DEFAULT CURRENT_TIMESTAMP NOT NULL ,
		modified_on timestamptz(35) DEFAULT CURRENT_TIMESTAMP NOT NULL ,
		created_by uuid   ,
		modified_by uuid   ,
		last_login timestamptz(35)   ,
		deleted boolean DEFAULT false NOT NULL ,
		deleted_on timestamptz   ,
		deleted_by uuid   ,
		CONSTRAINT pk_user_id PRIMARY KEY ( id ),
		CONSTRAINT idx_username UNIQUE ( username )
	);

	CREATE INDEX idx_user_created_by ON main.account ( created_by );

	CREATE INDEX idx_user_modified_by ON main.account ( modified_by );

	ALTER TABLE main.account ADD CONSTRAINT fk_users_role FOREIGN KEY ( role_id ) REFERENCES main.roles( id );

	ALTER TABLE main.account ADD CONSTRAINT fk_users_created_by FOREIGN KEY ( created_by ) REFERENCES main.account( id );

	ALTER TABLE main.account ADD CONSTRAINT fk_users_modified_by FOREIGN KEY ( modified_by ) REFERENCES main.account( id );



	CREATE TABLE main.user_credentials
	(
		id uuid DEFAULT uuid_generate_v1() NOT NULL ,
		user_id uuid NOT NULL ,
		auth_provider varchar(50) NOT NULL ,
		auth_id varchar(100)   ,
		auth_token varchar(100)   ,
		"password" varchar(60)   ,
		created_on timestamptz(35) DEFAULT CURRENT_TIMESTAMP NOT NULL ,
		modified_on timestamptz(35) DEFAULT CURRENT_TIMESTAMP NOT NULL ,
		deleted boolean DEFAULT false NOT NULL ,
		deleted_on timestamptz   ,
		deleted_by uuid   ,
		CONSTRAINT pk_user_credentials_id PRIMARY KEY ( id ),
		CONSTRAINT idx_user_credentials_user_id UNIQUE ( user_id )
	);

	CREATE INDEX idx_user_credentials ON main.user_credentials ( auth_provider );

	ALTER TABLE main.user_credentials ADD CONSTRAINT fk_user_credentials_users FOREIGN KEY ( user_id ) REFERENCES main.account( id );


	CREATE TABLE logs.audit_logs
	(
		operation_name varchar(10) NOT NULL ,
		operation_time timestamptz(35) DEFAULT now() NOT NULL ,
		"table_name" varchar(60) NOT NULL ,
		log_type varchar(100) DEFAULT 'APPLICATION_LOGS'
		::character varying  ,
	entity_id            varchar   ,
	user_id              varchar   ,
	"before"             jsonb   ,
	"after"              jsonb   ,
	id                   uuid DEFAULT uuid_generate_v1
		() NOT NULL ,
	CONSTRAINT pk_audit_logs_id PRIMARY KEY
		( id )
 );


		CREATE TABLE main.auth_clients
		(
			id uuid DEFAULT uuid_generate_v1() NOT NULL ,
			client_id varchar(50) NOT NULL ,
			client_secret varchar(50) NOT NULL ,
			redirect_url varchar(200)   ,
			access_token_expiration integer DEFAULT 900 NOT NULL ,
			refresh_token_expiration integer DEFAULT 86400 NOT NULL ,
			auth_code_expiration integer DEFAULT 180 NOT NULL ,
			secret varchar(50) NOT NULL ,
			created_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
			modified_on timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL ,
			deleted boolean DEFAULT false NOT NULL ,
			deleted_on timestamptz   ,
			deleted_by uuid   ,
			CONSTRAINT pk_auth_clients_id PRIMARY KEY ( id )
		);

		CREATE TABLE main.store
		(
			id uuid DEFAULT uuid_generate_v1() NOT NULL ,
			seller_id uuid NOT NULL ,
			name varchar(100) NOT NULL ,
			description varchar(500)   ,
			link char(200)   ,
			created_by uuid NOT NULL ,
			modified_by uuid   ,
			created_on timestamptz DEFAULT CURRENT_TIMESTAMP  ,
			modified_on timestamptz DEFAULT CURRENT_TIMESTAMP  ,
			deleted boolean DEFAULT false  ,
			deleted_on timestamptz   ,
			deleted_by uuid   ,
			CONSTRAINT pk_store_id PRIMARY KEY ( id )
		);

		ALTER TABLE main.store ADD CONSTRAINT fk_store_account FOREIGN KEY ( created_by ) REFERENCES main.account( id );

		ALTER TABLE main.store ADD CONSTRAINT fk_store_account_deleted_by FOREIGN KEY ( deleted_by ) REFERENCES main.account( id );

		ALTER TABLE main.store ADD CONSTRAINT fk_store_account_modified_by FOREIGN KEY ( modified_by ) REFERENCES main.account( id );

		ALTER TABLE main.store ADD CONSTRAINT fk_store_account_seller_id FOREIGN KEY ( seller_id ) REFERENCES main.account( id );


		CREATE TABLE main.category
		(
			id uuid DEFAULT uuid_generate_v1() NOT NULL ,
			name varchar(100) NOT NULL ,
			created_by uuid NOT NULL ,
			modified_by uuid   ,
			created_on timestamptz DEFAULT current_timestamp  ,
			modified_on timestamptz DEFAULT current_timestamp  ,
			deleted boolean DEFAULT false  ,
			deleted_on timestamptz   ,
			deleted_by uuid   ,
			CONSTRAINT pk_category_id PRIMARY KEY ( id )
		);

		ALTER TABLE main.category ADD CONSTRAINT fk_category_account_created_by FOREIGN KEY ( created_by ) REFERENCES main.account( id );

		ALTER TABLE main.category ADD CONSTRAINT fk_category_modified_by FOREIGN KEY ( modified_by ) REFERENCES main.account( id );

		ALTER TABLE main.category ADD CONSTRAINT fk_category_account_deleted_by FOREIGN KEY ( deleted_by ) REFERENCES main.account( id );


		CREATE TABLE main.products
		(
			id uuid DEFAULT uuid_generate_v1() NOT NULL ,
			store_id uuid NOT NULL ,
			name varchar(100) NOT NULL ,
			description varchar(200)   ,
			category_id uuid NOT NULL ,
			mrp decimal NOT NULL ,
			sale_price decimal NOT NULL ,
			created_by uuid NOT NULL ,
			modified_by uuid   ,
			created_on timestamptz DEFAULT current_timestamp  ,
			modified_on timestamptz DEFAULT current_timestamp  ,
			deleted boolean DEFAULT false  ,
			deleted_on timestamptz   ,
			deleted_by uuid   ,
			CONSTRAINT pk_products_id PRIMARY KEY ( id )
		);

		ALTER TABLE main.products ADD CONSTRAINT fk_products_account_created_by FOREIGN KEY ( created_by ) REFERENCES main.account( id );

		ALTER TABLE main.products ADD CONSTRAINT fk_products_account_modified_by FOREIGN KEY ( modified_by ) REFERENCES main.account( id );

		ALTER TABLE main.products ADD CONSTRAINT fk_products_account_deleted_by FOREIGN KEY ( deleted_by ) REFERENCES main.account( id );

		ALTER TABLE main.products ADD CONSTRAINT fk_products_store FOREIGN KEY ( store_id ) REFERENCES main.store( id );

		ALTER TABLE main.products ADD CONSTRAINT fk_products_category FOREIGN KEY ( category_id ) REFERENCES main.category( id );

