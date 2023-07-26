CREATE OR REPLACE FUNCTION post_votes_trigger () RETURNS TRIGGER AS $$
DECLARE
	v_votes INTEGER;
BEGIN
	-- get the current votes
	IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN 
		SELECT votes INTO v_votes FROM public.post WHERE id = NEW.post_id;
	ELSIF TG_OP = 'DELETE' THEN
		SELECT votes INTO v_votes FROM public.post WHERE id = OLD.post_id;
	ELSE
		v_votes = 0;
	END IF;
	
	-- handle insert
	IF TG_OP = 'INSERT' THEN
		UPDATE post SET votes = (
			CASE
				WHEN NEW.is_upvote THEN v_votes + 1
				ELSE v_votes - 1
			END
		)
		WHERE id = NEW.post_id;
	END IF;
	
	-- handle update
	IF TG_OP = 'UPDATE' THEN
		UPDATE post SET votes = (
			CASE
				WHEN NEW.is_upvote AND OLD.is_upvote THEN v_votes
				WHEN NEW.is_upvote AND NOT OLD.is_upvote THEN v_votes + 2
				WHEN NOT NEW.is_upvote AND OLD.is_upvote THEN v_votes - 2
				WHEN NOT NEW.is_upvote AND NOT OLD.is_upvote THEN v_votes
			END
		)
		WHERE id = NEW.post_id;
	END IF;
	
	-- handle delete
	
	IF TG_OP = 'DELETE' THEN
		UPDATE post SET votes = (
			CASE
				WHEN OLD.is_upvote THEN v_votes - 1
				ELSE v_votes + 1
			END
		)
		WHERE id = OLD.post_id;
	END IF;
	
	RETURN COALESCE(NEW, OLD);
END
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER insert_post_votes
AFTER INSERT ON post_votes
FOR EACH ROW EXECUTE FUNCTION post_votes_trigger();

CREATE OR REPLACE TRIGGER update_post_votes
AFTER UPDATE ON post_votes
FOR EACH ROW EXECUTE FUNCTION post_votes_trigger();

CREATE OR REPLACE TRIGGER delete_post_votes
AFTER DELETE ON post_votes
FOR EACH ROW EXECUTE FUNCTION post_votes_trigger();