'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { DEMO_TENANT_ID, type ObjectType } from '../../lib/types/ontology';

interface Props {
  value: string;  // ID of the referenced object
  targetTypeId: string;
}

export function ForeignKeyDisplay({ value, targetTypeId }: Props) {
  const [displayValue, setDisplayValue] = useState<string>(value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisplayValue = async () => {
      if (!value || !targetTypeId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabase('metaflow');

        // Fetch the referenced object
        const { data: objData, error: objError } = await supabase
          .from('objects')
          .select('*')
          .eq('id', value)
          .eq('tenant_id', DEMO_TENANT_ID)
          .eq('object_type_id', targetTypeId)
          .single();

        if (objError || !objData) {
          setDisplayValue(value);
          setLoading(false);
          return;
        }

        // Fetch the target object type to get titleKey
        const { data: typeData, error: typeError } = await supabase
          .from('object_types')
          .select('*')
          .eq('id', targetTypeId)
          .eq('tenant_id', DEMO_TENANT_ID)
          .single();

        if (typeError || !typeData) {
          setDisplayValue(value);
          setLoading(false);
          return;
        }

        // Get the display value from titleKey
        const titleKey = typeData.config.titleKey;
        const display = objData.data[titleKey] || value;
        setDisplayValue(display);
      } catch (error) {
        console.error('Error fetching FK display value:', error);
        setDisplayValue(value);
      } finally {
        setLoading(false);
      }
    };

    fetchDisplayValue();
  }, [value, targetTypeId]);

  if (loading) {
    return <span className="text-xs text-muted-foreground">Loading...</span>;
  }

  return (
    <Link
      href={`/metaflow/workspace/${targetTypeId}/${value}`}
      className="text-blue-600 hover:underline"
    >
      {displayValue}
    </Link>
  );
}
