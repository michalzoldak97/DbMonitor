CREATE DATABASE app_db
WITH
   ENCODING = 'UTF8'
;
 
\c app_db
;
 
CREATE SCHEMA usr
;
 
CREATE TABLE usr.tbl_user(
   user_id BIGSERIAL PRIMARY KEY,
   email VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   created_by_user_id BIGSERIAL NOT NULL,
   created_datetime TIMESTAMP DEFAULT NOW(),
   deactivated_datetime TIMESTAMP
)
;
 
CREATE TABLE usr.tbl_user_permission(
   user_permission_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL,
   permission_id BIGSERIAL,
   granted_by_user_id BIGSERIAL NOT NULL,
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_user_environment(
   user_environment_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL,
   environment_id BIGSERIAL,
   granted_by_user_id BIGSERIAL  NOT NULL,
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_user_query_set(
   user_query_set_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL,
   query_set_id BIGSERIAL,
   granted_by_user_id BIGSERIAL  NOT NULL,
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_user_query(
   user_query_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL,
   query_id BIGSERIAL,
   granted_by_user_id BIGSERIAL  NOT NULL,
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_permission(
   permission_id BIGSERIAL PRIMARY KEY,
   permission_name VARCHAR(255) NOT NULL,
   deactivated_datetime TIMESTAMP
)
;
 
CREATE TABLE usr.tbl_permission_group(
   permission_group_id BIGSERIAL PRIMARY KEY,
   permission_group_name VARCHAR(255) NOT NULL
)
;
 
CREATE TABLE usr.tbl_permission_group_permission(
   permission_group_permission_id BIGSERIAL PRIMARY KEY,
   permission_group_id BIGSERIAL,
   permission_id BIGSERIAL
)
;
 
CREATE SCHEMA app
;
 
CREATE TABLE app.tbl_environment(
   environment_id BIGSERIAL PRIMARY KEY,
   environment_ssh_host VARCHAR(255) NOT NULL,
   environment_ssh_username VARCHAR(255) NOT NULL,
   environment_ssh_priv_key VARCHAR(255) NOT NULL,
   environment_ssh_passphrase VARCHAR(255) NOT NULL,
   pg_host VARCHAR(255) NOT NULL,
   pg_database VARCHAR(255) NOT NULL,
   pg_username VARCHAR(255) NOT NULL,
   pg_password VARCHAR(255) NOT NULL,
   created_by_user_id BIGSERIAL NOT NULL,
   created_datetime TIMESTAMP DEFAULT NOW(),
   deactivated_datetime TIMESTAMP
)
;
 
CREATE TABLE app.tbl_query_set(
    query_set_id BIGSERIAL PRIMARY KEY,
    query_set_name VARCHAR(255) NOT NULL,
    created_by_user_id BIGSERIAL NOT NULL,
    created_datetime TIMESTAMP DEFAULT NOW(),
    deactivated_datetime TIMESTAMP
)
;

CREATE TABLE app.tbl_query(
    query_id BIGSERIAL PRIMARY KEY,
    query_name VARCHAR(255) NOT NULL,
    query_description VARCHAR(4096),
    query_text VARCHAR,
    created_by_user_id BIGSERIAL NOT NULL,
    created_datetime TIMESTAMP DEFAULT NOW(),
    deactivated_datetime TIMESTAMP
)
;

CREATE TABLE app.tbl_query_parameter(
    qery_parameter_id BIGSERIAL PRIMARY KEY,
    query_id BIGSERIAL,
    parameter_index INTEGER,
    parameter_name VARCHAR(255)
)
;