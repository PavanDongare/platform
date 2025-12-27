// Objects Queries

import { getSupabase } from '@/lib/supabase';
import type { ObjectInstance, ObjectTypeConfig } from '../types';
import { DEMO_TENANT_ID } from '../types';
import { getObjectType } from './object-types';

// Row mapper
function mapObject(row: Record<string, unknown>): ObjectInstance {
  return {
    id: row.id as string,
    tenantId: row.tenant_id as string,
    objectTypeId: row.object_type_id as string,
    semanticId: row.semantic_id as string,
    data: row.data as Record<string, unknown>,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

// List objects for a type
export async function getObjects(
  objectTypeId: string,
  limit?: number
): Promise<ObjectInstance[]> {
  const supabase = getSupabase('metaflow');
  let query = supabase
    .from('objects')
    .select('*')
    .eq('tenant_id', DEMO_TENANT_ID)
    .eq('object_type_id', objectTypeId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapObject);
}

// Get single object
export async function getObject(id: string): Promise<ObjectInstance | null> {
  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('objects')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', DEMO_TENANT_ID)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapObject(data);
}

// Simple validation
function validateObjectData(
  data: Record<string, unknown>,
  config: ObjectTypeConfig
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [key, prop] of Object.entries(config.properties)) {
    const value = data[key];

    if (prop.required && (value === undefined || value === null || value === '')) {
      errors[key] = `${prop.displayName} is required`;
    }
  }

  return errors;
}

// Create object
export async function createObject(
  objectTypeId: string,
  objectData: Record<string, unknown>
): Promise<ObjectInstance> {
  const supabase = getSupabase('metaflow');

  // Get object type for validation
  const objectType = await getObjectType(objectTypeId);
  if (!objectType) {
    throw new Error('Object type not found');
  }

  // Validate the data
  const errors = validateObjectData(objectData, objectType.config);
  if (Object.keys(errors).length > 0) {
    throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
  }

  // Generate semantic ID using database function
  const { data: semanticIdData, error: semanticIdError } = await supabase.rpc(
    'generate_semantic_id',
    {
      p_tenant_id: DEMO_TENANT_ID,
      p_object_type_id: objectTypeId,
      p_display_name: objectType.displayName,
    }
  );

  if (semanticIdError) throw semanticIdError;
  const semanticId = semanticIdData as string;

  // Insert object
  const { data, error } = await supabase
    .from('objects')
    .insert({
      tenant_id: DEMO_TENANT_ID,
      object_type_id: objectTypeId,
      semantic_id: semanticId,
      data: objectData,
    })
    .select()
    .single();

  if (error) throw error;
  return mapObject(data);
}

// Update object
export async function updateObject(
  id: string,
  objectData: Record<string, unknown>
): Promise<ObjectInstance> {
  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('objects')
    .update({
      data: objectData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', DEMO_TENANT_ID)
    .select()
    .single();

  if (error) throw error;
  return mapObject(data);
}

// Delete object
export async function deleteObject(id: string): Promise<void> {
  const supabase = getSupabase('metaflow');
  const { error } = await supabase
    .from('objects')
    .delete()
    .eq('id', id)
    .eq('tenant_id', DEMO_TENANT_ID);

  if (error) throw error;
}

// Get objects by IDs
export async function getObjectsByIds(ids: string[]): Promise<ObjectInstance[]> {
  if (ids.length === 0) return [];

  const supabase = getSupabase('metaflow');
  const { data, error } = await supabase
    .from('objects')
    .select('*')
    .eq('tenant_id', DEMO_TENANT_ID)
    .in('id', ids);

  if (error) throw error;
  return (data || []).map(mapObject);
}
