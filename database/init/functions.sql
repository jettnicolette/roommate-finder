-- Function to accept a wave (match) and set the acceptance timestamp
CREATE OR REPLACE FUNCTION accept_wave(p_match_id INT)
RETURNS TABLE(match_id INT, status VARCHAR, accepted_at TIMESTAMP) AS $$
BEGIN
    UPDATE match
    SET status = 'accepted',
        accepted_at = CURRENT_TIMESTAMP
    WHERE match.match_id = p_match_id AND match.status = 'pending';
    
    RETURN QUERY
    SELECT m.match_id, m.status, m.accepted_at
    FROM match m
    WHERE m.match_id = p_match_id;
END;
$$ LANGUAGE plpgsql;