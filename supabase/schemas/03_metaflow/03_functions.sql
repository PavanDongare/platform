-- Metaflow Functions
-- Core PL/pgSQL functions for the ontology platform

-- ============================================================================
-- Generate Semantic ID (e.g., "customer-01", "order-42")
-- ============================================================================
CREATE OR REPLACE FUNCTION metaflow.generate_semantic_id(
  p_tenant_id UUID,
  p_object_type_id UUID,
  p_display_name TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_semantic_id TEXT;
  v_next_number INTEGER;
  v_max_attempts INTEGER := 10;
  v_attempt INTEGER := 0;
BEGIN
  -- Generate prefix from display name (lowercase, kebab-case)
  v_prefix := lower(regexp_replace(
    regexp_replace(
      regexp_replace(p_display_name, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  ));
  v_prefix := trim(both '-' from v_prefix);

  -- Fallback if empty
  IF v_prefix = '' THEN
    v_prefix := 'object';
  END IF;

  -- Retry loop to handle race conditions
  LOOP
    v_attempt := v_attempt + 1;

    IF v_attempt > v_max_attempts THEN
      RAISE EXCEPTION 'Failed to generate semantic_id after % attempts', v_max_attempts;
    END IF;

    -- Find maximum existing number for this prefix
    SELECT COALESCE(MAX(
      CASE
        WHEN semantic_id ~ ('^' || v_prefix || '-[0-9]+$')
        THEN substring(semantic_id from '[0-9]+$')::INTEGER
        ELSE 0
      END
    ), 0) INTO v_next_number
    FROM metaflow.objects
    WHERE tenant_id = p_tenant_id
      AND object_type_id = p_object_type_id
      AND semantic_id LIKE v_prefix || '-%';

    v_next_number := v_next_number + 1;

    -- Format as prefix-01, prefix-02, etc.
    v_semantic_id := v_prefix || '-' || lpad(v_next_number::text, 2, '0');

    -- Check if this ID already exists
    PERFORM 1 FROM metaflow.objects
    WHERE tenant_id = p_tenant_id
      AND semantic_id = v_semantic_id;

    IF NOT FOUND THEN
      RETURN v_semantic_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION metaflow.generate_semantic_id IS 'Generates semantic IDs like customer-01 by finding max existing number and incrementing';

-- ============================================================================
-- Validate Action Parameters
-- ============================================================================
CREATE OR REPLACE FUNCTION metaflow.validate_action_parameters(
  p_action_type_id UUID,
  p_tenant_id UUID,
  p_parameters JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_config JSONB;
  v_param_defs JSONB;
  v_param_def JSONB;
  v_param_name TEXT;
  v_param_value JSONB;
  v_required BOOLEAN;
  v_param_type TEXT;
  v_errors JSONB := '[]'::JSONB;
BEGIN
  -- Get action config
  SELECT config INTO v_config
  FROM metaflow.action_types
  WHERE id = p_action_type_id AND tenant_id = p_tenant_id;

  IF v_config IS NULL THEN
    RETURN jsonb_build_object(
      'valid', false,
      'errors', jsonb_build_array('Action type not found')
    );
  END IF;

  v_param_defs := v_config->'parameters';

  -- Validate each parameter
  FOR v_param_def IN SELECT * FROM jsonb_array_elements(v_param_defs)
  LOOP
    v_param_name := v_param_def->>'name';
    v_required := COALESCE((v_param_def->>'required')::BOOLEAN, false);
    v_param_type := v_param_def->>'type';
    v_param_value := p_parameters->v_param_name;

    -- Check required parameters
    IF v_required AND v_param_value IS NULL THEN
      v_errors := v_errors || jsonb_build_object(
        'parameter', v_param_name,
        'error', 'Required parameter missing'
      );
      CONTINUE;
    END IF;

    -- Type validation for object-reference
    IF v_param_type = 'object-reference' AND v_param_value IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM metaflow.objects
        WHERE id = (v_param_value->>0)::UUID
          AND tenant_id = p_tenant_id
      ) THEN
        v_errors := v_errors || jsonb_build_object(
          'parameter', v_param_name,
          'error', 'Referenced object not found'
        );
      END IF;
    END IF;
  END LOOP;

  IF jsonb_array_length(v_errors) = 0 THEN
    RETURN jsonb_build_object('valid', true);
  ELSE
    RETURN jsonb_build_object('valid', false, 'errors', v_errors);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION metaflow.validate_action_parameters IS 'Validates action parameters against action type config';

-- ============================================================================
-- List Actions (for workspace dropdown)
-- ============================================================================
CREATE OR REPLACE FUNCTION metaflow.list_actions(p_tenant_id UUID)
RETURNS TABLE(
  id UUID,
  display_name TEXT,
  execution_type TEXT,
  parameters JSONB,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.display_name,
    a.config->>'executionType' AS execution_type,
    a.config->'parameters' AS parameters,
    COALESCE(a.config->>'description', '') AS description
  FROM metaflow.action_types a
  WHERE a.tenant_id = p_tenant_id
  ORDER BY a.display_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Execute Action (simplified)
-- ============================================================================
CREATE OR REPLACE FUNCTION metaflow.execute_action(
  p_action_type_id UUID,
  p_tenant_id UUID,
  p_parameters JSONB,
  p_current_user UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_config JSONB;
  v_validation JSONB;
  v_rules JSONB;
  v_rule JSONB;
  v_result JSONB := '{}'::JSONB;
BEGIN
  -- Validate parameters
  v_validation := metaflow.validate_action_parameters(p_action_type_id, p_tenant_id, p_parameters);
  IF NOT (v_validation->>'valid')::BOOLEAN THEN
    RETURN jsonb_build_object('success', false, 'errors', v_validation->'errors');
  END IF;

  -- Get action config
  SELECT config INTO v_config
  FROM metaflow.action_types
  WHERE id = p_action_type_id AND tenant_id = p_tenant_id;

  v_rules := v_config->'rules';

  -- Execute each rule (simplified - expand as needed)
  FOR v_rule IN SELECT * FROM jsonb_array_elements(v_rules)
  LOOP
    CASE v_rule->>'type'
      WHEN 'modify_object' THEN
        -- Update object data
        UPDATE metaflow.objects
        SET data = data || (v_rule->'modifications')
        WHERE id = (p_parameters->>(v_rule->>'objectParameter'))::UUID
          AND tenant_id = p_tenant_id;
        v_result := v_result || jsonb_build_object('modified', true);

      WHEN 'create_object' THEN
        -- Create new object
        INSERT INTO metaflow.objects (tenant_id, object_type_id, data)
        VALUES (
          p_tenant_id,
          (v_rule->>'objectTypeId')::UUID,
          COALESCE(v_rule->'initialData', '{}'::JSONB)
        );
        v_result := v_result || jsonb_build_object('created', true);

      WHEN 'delete_object' THEN
        -- Delete object
        DELETE FROM metaflow.objects
        WHERE id = (p_parameters->>(v_rule->>'objectParameter'))::UUID
          AND tenant_id = p_tenant_id;
        v_result := v_result || jsonb_build_object('deleted', true);

      ELSE
        -- Unknown rule type, skip
        NULL;
    END CASE;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'result', v_result);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION metaflow.execute_action IS 'Executes a declarative action with parameter validation';

-- ============================================================================
-- Get Property Type (helper)
-- ============================================================================
CREATE OR REPLACE FUNCTION metaflow.get_property_type(
  p_object_type_id UUID,
  p_property_key TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_property_def JSONB;
  v_type TEXT;
BEGIN
  SELECT config->'properties'->p_property_key INTO v_property_def
  FROM metaflow.object_types
  WHERE id = p_object_type_id;

  IF v_property_def IS NULL THEN
    RETURN 'string';
  END IF;

  v_type := v_property_def->>'type';
  RETURN COALESCE(v_type, 'string');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- List Tenant Views
-- ============================================================================
CREATE OR REPLACE FUNCTION metaflow.list_tenant_views(p_tenant_id UUID)
RETURNS TABLE(
  view_name TEXT,
  object_type_id UUID,
  object_type_name TEXT,
  schema_hash TEXT,
  generation_status TEXT,
  generated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    vm.view_name,
    vm.object_type_id,
    ot.display_name AS object_type_name,
    vm.schema_hash,
    vm.generation_status,
    vm.generated_at
  FROM metaflow.view_metadata vm
  JOIN metaflow.object_types ot ON vm.object_type_id = ot.id
  WHERE vm.tenant_id = p_tenant_id
  ORDER BY ot.display_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
