'use client';

// React Hooks for Actions

import { useState, useEffect, useCallback } from 'react';
import type { ActionType, ActionListItem } from '../types';
import {
  getActionTypes,
  getActionType,
  createActionType as createActionTypeFn,
  updateActionType as updateActionTypeFn,
  deleteActionType as deleteActionTypeFn,
  listActions,
  executeAction as executeActionFn,
} from '../queries/actions';

export function useActionTypes() {
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActionTypes();
      setActionTypes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { actionTypes, loading, error, refetch };
}

export function useActionType(id: string | null) {
  const [actionType, setActionType] = useState<ActionType | null>(null);
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
      const data = await getActionType(id);
      setActionType(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { actionType, setActionType, loading, error, refetch };
}

export function useActionList() {
  const [actions, setActions] = useState<ActionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listActions();
      setActions(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { actions, loading, error, refetch };
}

// Re-export mutations
export const createActionType = createActionTypeFn;
export const updateActionType = updateActionTypeFn;
export const deleteActionType = deleteActionTypeFn;
export const executeAction = executeActionFn;
