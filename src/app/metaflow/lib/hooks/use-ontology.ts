'use client';

// React Hooks for Ontology

import { useState, useEffect, useCallback } from 'react';
import type { ObjectType, ObjectInstance } from '../types';
import {
  getObjectTypes,
  getObjectType,
  createObjectType as createObjectTypeFn,
  updateObjectType as updateObjectTypeFn,
  deleteObjectType as deleteObjectTypeFn,
} from '../queries/object-types';
import {
  getObjects,
  getObject,
  createObject as createObjectFn,
  updateObject as updateObjectFn,
  deleteObject as deleteObjectFn,
} from '../queries/objects';

// ==========================================
// Object Types Hooks
// ==========================================

export function useObjectTypes() {
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getObjectTypes();
      setObjectTypes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { objectTypes, loading, error, refetch };
}

export function useObjectType(id: string | null) {
  const [objectType, setObjectType] = useState<ObjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getObjectType(id);
      setObjectType(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { objectType, setObjectType, loading, error, refetch };
}

// ==========================================
// Objects Hooks
// ==========================================

export function useObjects(objectTypeId: string | null, limit?: number) {
  const [objects, setObjects] = useState<ObjectInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!objectTypeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getObjects(objectTypeId, limit);
      setObjects(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [objectTypeId, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { objects, loading, error, refetch };
}

export function useObject(id: string | null) {
  const [object, setObject] = useState<ObjectInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getObject(id);
      setObject(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { object, setObject, loading, error, refetch };
}

// ==========================================
// Mutation Exports (re-export for convenience)
// ==========================================

export const createObjectType = createObjectTypeFn;
export const updateObjectType = updateObjectTypeFn;
export const deleteObjectType = deleteObjectTypeFn;
export const createObject = createObjectFn;
export const updateObject = updateObjectFn;
export const deleteObject = deleteObjectFn;
