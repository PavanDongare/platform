// Actions Queries

import { getSupabase } from '@/lib/supabase';
import type { ActionType, ActionTypeConfig, ActionListItem } from '../types';
import { DEMO_TENANT_ID } from '../types';

// Row mapper
function mapActionType(row: Record<string, unknown>): ActionType {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    displayName: row.display_name as string,
    config: row.config as ActionTypeConfig,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// List all action types
export async function getActionTypes(): Promise<ActionType[]> {
  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('action_types')
    .select('*')
    .eq('tenant_id', DEMO_TENANT_ID)
    .order('display_name', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapActionType);
}

// Get single action type
export async function getActionType(id: string): Promise<ActionType | null> {
  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('action_types')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', DEMO_TENANT_ID)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapActionType(data);
}

// Create action type
export async function createActionType(input: {
  displayName: string;
  config: ActionTypeConfig;
}): Promise<ActionType> {
  if (!input.displayName?.trim()) {
    throw new Error('Display name is required');
  }

  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('action_types')
    .insert({
      tenant_id: DEMO_TENANT_ID,
      display_name: input.displayName,
      config: input.config,
    })
    .select()
    .single();

  if (error) throw error;
  return mapActionType(data);
}

// Update action type
export async function updateActionType(
  id: string,
  updates: { displayName?: string; config?: ActionTypeConfig }
): Promise<ActionType> {
  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.displayName) updateData.display_name = updates.displayName;
  if (updates.config) updateData.config = updates.config;

  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('action_types')
    .update(updateData)
    .eq('id', id)
    .eq('tenant_id', DEMO_TENANT_ID)
    .select()
    .single();

  if (error) throw error;
  return mapActionType(data);
}

// Delete action type
export async function deleteActionType(id: string): Promise<void> {
  const supabase = getSupabase('metaflow');
  const { error } = await supabase
    .from('action_types')
    .delete()
    .eq('id', id)
    .eq('tenant_id', DEMO_TENANT_ID);

  if (error) throw error;
}

// List actions via RPC (for UI)
export async function listActions(): Promise<ActionListItem[]> {
  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase.rpc('list_actions', {
    p_tenant_id: DEMO_TENANT_ID,
  });

  if (error) throw error;

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    displayName: row.display_name as string,
    executionType: row.execution_type as 'declarative' | 'function-backed',
    parameters: row.parameters as ActionTypeConfig['parameters'],
    description: row.description as string | undefined,
  }));
}

// Execute action
export async function executeAction(
  actionTypeId: string,
  parameters: Record<string, unknown>,
  currentUser?: string
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase.rpc('execute_action', {
    p_action_type_id: actionTypeId,
    p_tenant_id: DEMO_TENANT_ID,
    p_parameters: parameters,
    p_current_user: currentUser,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const result = data as { success: boolean; result?: unknown; errors?: unknown[] };
  if (!result.success && result.errors) {
    return { success: false, error: JSON.stringify(result.errors) };
  }

  return { success: true, result: result.result };
}
