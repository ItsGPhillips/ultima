
CREATE OR REPLACE FUNCTION "get_post_votes" (PARAM_POST_ID TEXT) RETURNS INTEGER AS $$
DECLARE
	upvotes INTEGER;
	downvotes INTEGER;
BEGIN
	CREATE TEMP TABLE "tmp_vote"
	ON COMMIT DROP AS
   	SELECT *
	FROM public."post_votes"
	WHERE
		public."post_votes"."post_id" = param_post_id;

	SELECT COUNT(is_upvote) INTO "upvotes" FROM "tmp_vote" WHERE "tmp_vote"."is_upvote" = TRUE;
	SELECT COUNT(is_upvote) INTO "downvotes" FROM "tmp_vote" WHERE "tmp_vote"."is_upvote" = FALSE;

	DROP TEMP TABLE "tmp_vote"; 

	RETURN (upvotes - downvotes);
END
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

