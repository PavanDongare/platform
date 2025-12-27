'use client';

// React Hooks for Relationships

import { useState, useEffect, useCallback } from 'react';
import type { Relationship } from '../types';
import {
  getRelationships,
  getRelationship,
  getRelationshipsByObjectType,
  createRelationship as createRelationshipFn,
  updateRelationship as updateRelationshipFn,
  deleteRelationship as deleteRelationshipFn,
} from '../queries/relationships';

export function useRelationships() {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRelationships();
      setRelationships(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { relationships, loading, error, refetch };
}

export function useRelationship(id: string | null) {
  const [relationship, setRelationship] = useState<Relationship | null>(null);
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
      const data = await getRelationship(id);
      setRelationship(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { relationship, setRelationship, loading, error, refetch };
}

export function useRelationshipsByObjectType(objectTypeId: string | null) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
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
      const data = await getRelationshipsByObjectType(objectTypeId);
      setRelationships(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [objectTypeId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { relationships, loading, error, refetch };
}

// Re-export mutations
export const createRelationship = createRelationshipFn;
export const updateRelationship = updateRelationshipFn;
export const deleteRelationship = deleteRelationshipFn;
