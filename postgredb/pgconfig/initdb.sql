CREATE DATABASE app_db
WITH
   ENCODING = 'UTF8'
;
 
\c app_db
;
 
CREATE SCHEMA usr
;

CREATE SCHEMA app
;
 
CREATE TABLE usr.tbl_user(
   user_id BIGSERIAL PRIMARY KEY,
   email VARCHAR(255) UNIQUE NOT NULL,
   password VARCHAR(255) NOT NULL,
   created_by_user_id BIGSERIAL NOT NULL,
   created_datetime TIMESTAMP DEFAULT NOW(),
   last_logged_in TIMESTAMP,
   deactivated_datetime TIMESTAMP
)
;

CREATE TABLE usr.tbl_permission(
   permission_id BIGSERIAL PRIMARY KEY,
   permission_name VARCHAR(255) NOT NULL,
   deactivated_datetime TIMESTAMP
)
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
   created_by_user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
   created_datetime TIMESTAMP DEFAULT NOW(),
   deactivated_datetime TIMESTAMP,
   last_updated_by_user_id BIGINT REFERENCES usr.tbl_user (user_id),
   last_updated_datetime TIMESTAMP 
)
;
 
CREATE TABLE app.tbl_query_set(
    query_set_id BIGSERIAL PRIMARY KEY,
    query_set_name VARCHAR(255) NOT NULL,
    created_by_user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
    created_datetime TIMESTAMP DEFAULT NOW(),
    deactivated_datetime TIMESTAMP
)
;

CREATE TABLE app.tbl_query(
    query_id BIGSERIAL PRIMARY KEY,
    query_name VARCHAR(255) NOT NULL,
    query_description VARCHAR(4096),
    query_text VARCHAR,
    created_by_user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
    created_datetime TIMESTAMP DEFAULT NOW(),
    deactivated_datetime TIMESTAMP
)
;
 
CREATE TABLE usr.tbl_user_permission(
   user_permission_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
   permission_id BIGSERIAL REFERENCES usr.tbl_permission (permission_id),
   granted_by_user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_user_environment(
   user_environment_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
   environment_id BIGSERIAL REFERENCES app.tbl_environment (environment_id),
   granted_by_user_id BIGSERIAL NOT NULL REFERENCES usr.tbl_user (user_id),
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_user_query_set(
   user_query_set_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
   query_set_id BIGSERIAL REFERENCES app.tbl_query_set (query_set_id),
   granted_by_user_id BIGSERIAL NOT NULL REFERENCES usr.tbl_user (user_id),
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_user_query(
   user_query_id BIGSERIAL PRIMARY KEY,
   user_id BIGSERIAL REFERENCES usr.tbl_user (user_id),
   query_id BIGSERIAL REFERENCES app.tbl_query (query_id),
   granted_by_user_id BIGSERIAL NOT NULL REFERENCES usr.tbl_user (user_id),
   granted_datetime TIMESTAMP DEFAULT NOW()
)
;
 
CREATE TABLE usr.tbl_permission_group(
   permission_group_id BIGSERIAL PRIMARY KEY,
   permission_group_name VARCHAR(255) NOT NULL
)
;
 
CREATE TABLE usr.tbl_permission_group_permission(
   permission_group_permission_id BIGSERIAL PRIMARY KEY,
   permission_group_id BIGSERIAL REFERENCES usr.tbl_permission_group (permission_group_id),
   permission_id BIGSERIAL REFERENCES usr.tbl_permission (permission_id)
)
;

CREATE TABLE app.tbl_query_parameter(
    query_parameter_id BIGSERIAL PRIMARY KEY,
    query_id BIGSERIAL REFERENCES app.tbl_query (query_id),
    parameter_index INTEGER,
    parameter_name VARCHAR(255)
)
;

CREATE INDEX idx_user_permission_user ON usr.tbl_user_permission (user_id)
;

CREATE INDEX idx_user_query_set_user ON usr.tbl_user_query_set (user_id)
;

CREATE INDEX idx_user_query_user ON usr.tbl_user_query (user_id)
;

CREATE INDEX idx_query_param_query ON app.tbl_query_parameter (query_id)
;

CREATE OR REPLACE FUNCTION app.sp_user_settings(usr_id BIGINT)
RETURNS TABLE (setting JSON) AS
$$
BEGIN
DROP TABLE IF EXISTS tbl_user_setting_json;
CREATE TEMPORARY TABLE tbl_user_setting_json(
    setting JSON
);
INSERT INTO tbl_user_setting_json (setting)
SELECT row_to_json(a) FROM (
                            SELECT 
                                'permission'::VARCHAR AS set_type
                                ,up.permission_id  
                                ,p.permission_name
                            FROM usr.tbl_permission p
                            INNER JOIN usr.tbl_user_permission up              ON p.permission_id = up.permission_id
                            WHERE 
                                p.deactivated_datetime IS NULL
                                AND up.user_id = usr_id
    
) a;
INSERT INTO tbl_user_setting_json (setting)
SELECT row_to_json(a) FROM (
                            SELECT 
                                'environment'::VARCHAR AS set_type
                                ,ue.environment_id  
                                ,e.pg_database AS database_name
                            FROM app.tbl_environment e
                            INNER JOIN usr.tbl_user_environment ue              ON e.environment_id = ue.environment_id
                            WHERE 
                                e.deactivated_datetime IS NULL
                                AND ue.user_id = usr_id
) a;
INSERT INTO tbl_user_setting_json (setting)
SELECT row_to_json(a) FROM (
                            SELECT 
                                'query_set'::VARCHAR AS set_type
                                ,uqs.query_set_id  
                                ,qs.query_set_name 
                            FROM app.tbl_query_set qs
                            INNER JOIN usr.tbl_user_query_set uqs                ON qs.query_set_id = uqs.query_set_id
                            WHERE 
                                qs.deactivated_datetime IS NULL
                                AND uqs.user_id = usr_id
) a;
INSERT INTO tbl_user_setting_json (setting)
SELECT row_to_json(a) FROM (
                            SELECT 
                                'query'::VARCHAR AS set_type
                                ,uq.query_id 
                                ,q.query_name
                            FROM app.tbl_query q
                            INNER JOIN usr.tbl_user_query uq                ON q.query_id = uq.query_id
                            WHERE 
                                q.deactivated_datetime IS NULL
                                AND uq.user_id = usr_id
) a;
RETURN QUERY SELECT usj.setting FROM tbl_user_setting_json usj;
END;
$$ LANGUAGE plpgsql
;

CREATE OR REPLACE FUNCTION app.tf_environment_deactivate(env_to_deactivate_id BIGINT, requesting_user_id BIGINT)
RETURNS BIGINT AS
$$
DECLARE
    changed_id BIGINT = 0;
BEGIN
    IF EXISTS (
                SELECT FROM usr.tbl_user_environment ue
                WHERE 
                    ue.user_id = requesting_user_id
                    AND ue.environment_id = env_to_deactivate_id
    )
    THEN
        UPDATE app.tbl_environment e 
        SET
            deactivated_datetime = NOW()
            ,last_updated_by_user_id = requesting_user_id
        WHERE 
            e.environment_id = env_to_deactivate_id
        ;
        DELETE FROM usr.tbl_user_environment ue
        WHERE 
            ue.environment_id = env_to_deactivate_id
        ;
        changed_id := env_to_deactivate_id;
    ELSE
        RAISE EXCEPTION 'User not permitted';
    END IF;
    RETURN changed_id;
END;
$$ LANGUAGE plpgsql
;

CREATE OR REPLACE FUNCTION usr.tf_user_environment_assign(req_user_id BIGINT, for_user_id BIGINT, envs_param VARCHAR)
RETURNS BIGINT AS
$$
DECLARE 
    envs BIGINT[] := envs_param::BIGINT[];
    changed_user_id BIGINT;
BEGIN
    IF (EXISTS (
                SELECT FROM usr.tbl_user_environment ue
                WHERE 
                    ue.user_id = req_user_id
                    AND ue.environment_id = ANY(envs)
        )
        AND NOT 
        EXISTS (
                SELECT FROM usr.tbl_user_environment ue
                WHERE 
                    ue.user_id = for_user_id
                    AND ue.environment_id = ANY(envs)
        )
        AND NOT
        EXISTS (
                SELECT FROM app.tbl_environment e
                WHERE 
                    e.environment_id  = ANY(envs)
                    AND e.deactivated_datetime IS NOT NULL
        )
    )
    THEN 
        INSERT INTO usr.tbl_user_environment (user_id, environment_id, granted_by_user_id)
        SELECT 
            for_user_id
            ,e.env
            ,req_user_id
        FROM (
            WITH 
                ROWS AS (
                            SELECT UNNEST(envs) AS env
                )
            SELECT
                env
            FROM ROWS
        )e;
        changed_user_id := for_user_id;
    ELSE 
        changed_user_id := 0;
        RAISE EXCEPTION 'Invalid insert attempt or user not permitted';
    END IF;
    RETURN changed_user_id;
END;
$$ LANGUAGE plpgsql
;

CREATE OR REPLACE FUNCTION app.fn_tr_env_update ()
RETURNS trigger AS
$$
BEGIN
    IF EXISTS (
                SELECT 
                FROM usr.tbl_user_environment ue
                WHERE 
                    ue.user_id = NEW.last_updated_by_user_id
                    AND ue.environment_id = NEW.environment_id
        )
    THEN 
        NEW.last_updated_datetime = NOW();
        RETURN NEW;
    ELSEIF NEW.deactivated_datetime IS NOT NULL
    THEN
        NEW.last_updated_datetime = NOW();
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'User not authorised';
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql
;

CREATE TRIGGER tr_env_update
BEFORE UPDATE ON app.tbl_environment
FOR EACH ROW EXECUTE PROCEDURE app.fn_tr_env_update()
;

CREATE OR REPLACE FUNCTION app.fn_tr_env_create ()
RETURNS trigger AS
$$
BEGIN
    INSERT INTO usr.tbl_user_environment (user_id, environment_id, granted_by_user_id)
    VALUES
        (NEW.created_by_user_id, NEW.environment_id, NEW.created_by_user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
;

CREATE TRIGGER tr_env_create
AFTER INSERT ON app.tbl_environment
FOR EACH ROW EXECUTE PROCEDURE app.fn_tr_env_create()
;

CREATE OR REPLACE FUNCTION app.fn_tr_q_update ()
RETURNS trigger AS
$$
BEGIN
    IF EXISTS (
                SELECT 
                FROM usr.tbl_user_query uq
                WHERE 
                    uq.user_id = NEW.last_updated_by_user_id
                    AND uq.query_id = NEW.query_id
        )
    THEN 
        NEW.last_updated_datetime = NOW();
        RETURN NEW;
    ELSEIF NEW.deactivated_datetime IS NOT NULL
    THEN
        NEW.last_updated_datetime = NOW();
        RETURN NEW;
    ELSE
        RAISE EXCEPTION 'User not authorised';
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql
;

CREATE TRIGGER tr_q_update
BEFORE UPDATE ON app.tbl_query 
FOR EACH ROW EXECUTE PROCEDURE app.fn_tr_q_update()
;

CREATE OR REPLACE FUNCTION app.fn_tr_q_create ()
RETURNS trigger AS
$$
BEGIN
    INSERT INTO usr.tbl_user_query (user_id, query_id , granted_by_user_id)
    VALUES
        (NEW.created_by_user_id, NEW.query_id, NEW.created_by_user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
;

CREATE TRIGGER tr_q_create
AFTER INSERT ON app.tbl_query
FOR EACH ROW EXECUTE PROCEDURE app.fn_tr_q_create()
;

INSERT INTO app.tbl_config(config_id, config_json)
VALUES (1,'
          {
    "user": {
        "permissions": {
            "userCreate": "1",
            "userDelete": "2",
            "userModifyDetail": "3",
            "userViewDetail": "4",
            "userModifyPermission": "5",
            "userModifyEnv": "6",
            "userModifyQuery": "7",
            "userModifyQuerySet": "8",
            "envCreate": "9",
            "envDelete": "10",
            "envModify": "11",
            "envView": "12",
            "qPublic": "13",
            "qCreate": "14",
            "qDelete": "15",
            "qModify": "16",
            "qView": "17"
        }
    },
    "error": {
        "messages": {
            "userNotFound": "User not found",
            "userCreateFail": "Creating user failed",
            "userNoPermission": "Operation not permitted",
            "userIncompleteLoginData": "Mandatory user data missing!",
            "userInvalidCredentials": "Invalid credentials",
            "userAuthFail": "User authorization failed",
            "userPermissionDenied": "Permission denied",
            "envOperationFail": "Can not perform environment operation",
            "qNotFound": "Query not found",
            "qOperationFail": "Can not perform query operation"
        }
    }
}
  ')
;

INSERT INTO usr.tbl_permission (permission_id, permission_name)
VALUES
    (1, 'Create User')
    ,(2, 'Delete User')
    ,(3, 'Modify User Details')
    ,(4, 'View User Details')
    ,(5, 'Modify User Permissions')
    ,(6, 'Modify User Environments')
    ,(7, 'Modify User Queries')
    ,(8, 'Modify User Query Sets')
    ,(9, 'Create Environment')
    ,(10, 'Delete Environment')
    ,(11, 'Modify Environment')
    ,(12, 'View Environment')
    ,(13, 'Access Public Queries')
    ,(14, 'Create Query')
    ,(15, 'Delete Query')
    ,(16, 'Modify Query')
    ,(17, 'View Query')
;