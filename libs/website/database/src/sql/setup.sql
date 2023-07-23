CREATE SCHEMA IF NOT EXISTS "realtime" AUTHORIZATION "postgres";

----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION "realtime".build_notification_payload(
	p_op TEXT,
	p_new_data JSON,
	p_old_data JSON,
	p_schema NAME,
	p_table NAME)
   RETURNS TEXT
AS $BODY$
BEGIN
RETURN (
	json_build_object(
		'schema', p_schema::TEXT,
		'table', p_table::TEXT,
		'timestamp', NOW(),
		'op', p_OP, 
		'new', p_new_data,
		'old', p_old_data
	)::TEXT
);
END
$BODY$ LANGUAGE plpgsql SECURITY DEFINER;

----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION "realtime".build_trigger_string (
   p_action TEXT,
   p_trigger_prefix TEXT,
   p_schema NAME,
   p_table NAME
) RETURNS TEXT AS $$
DECLARE
	v_trigger_name TEXT;
BEGIN
	SELECT CONCAT_WS('__', TRIM(p_trigger_prefix), TRIM(p_action), 'trigger') INTO v_trigger_name;
	RETURN (
		'CREATE OR REPLACE TRIGGER ' || v_trigger_name ||
		' AFTER ' || p_action || ' ON ' || quote_ident(p_schema) || '.' || quote_ident(p_table) ||
		' FOR EACH ROW EXECUTE FUNCTION "realtime".' || p_trigger_prefix || '_function();'
	);
END
$$ LANGUAGE plpgsql SECURITY DEFINER;

----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION "realtime"."create_notification_channel" (
	p_schema NAME, p_table NAME
) RETURNS VOID AS $outer$
DECLARE
	v_trigger_prefix TEXT;
BEGIN
	-- Format the trigger name
	SELECT CONCAT_WS('__', TRIM(p_schema), TRIM(p_table), 'notification') INTO v_trigger_prefix;
	
	-- create the trigger
	EXECUTE 'CREATE OR REPLACE FUNCTION "realtime".' ||
		v_trigger_prefix || '_function' ||
		E'() RETURNS TRIGGER AS $inner$
			DECLARE
				v_new_row_json JSON;
				v_old_row_json JSON;
				v_payload TEXT;
			BEGIN 
				SELECT row_to_json(NEW.*) INTO v_new_row_json;
				SELECT row_to_json(OLD.*) INTO v_old_row_json;
				
				SELECT "realtime".build_notification_payload(' 
            || CONCAT_WS(',', 
                  'TG_OP',
                  'v_new_row_json',
                  'v_old_row_json',
                  quote_literal(p_schema),
                  quote_literal(p_table)
               )
				|| ') INTO v_payload;
				PERFORM pg_notify('|| quote_literal('pg_rt_server_notify') ||', v_payload);
				RETURN NULL;
			END 
		$inner$ LANGUAGE plpgsql SECURITY DEFINER;';
		
	EXECUTE "realtime".build_trigger_string('INSERT', v_trigger_prefix, p_schema, p_table);
	EXECUTE "realtime".build_trigger_string('UPDATE', v_trigger_prefix, p_schema, p_table);
	EXECUTE "realtime".build_trigger_string('DELETE', v_trigger_prefix, p_schema, p_table);
		
END;
$outer$ LANGUAGE plpgsql SECURITY DEFINER;

----------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "realtime"."data" (
	id SERIAL PRIMARY KEY,
	name TEXT
);

SELECT "realtime".create_notification_channel(
	'realtime',
	'data'
);