import type { OpenRouterTool } from '@/lib/openrouter'

export const TOOLS: OpenRouterTool[] = [
  {
    type: 'function',
    function: {
      name: 'update_section',
      description: 'move documents to different sections',
      parameters: {
        type: 'object',
        properties: {
          doc_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of document UUIDs to move',
          },
          new_section_name: {
            type: 'string',
            description: 'Name of the section to move documents to',
          },
        },
        required: ['doc_ids', 'new_section_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_documents',
      description: 'delete documents',
      parameters: {
        type: 'object',
        properties: {
          doc_ids: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of document UUIDs to delete',
          },
        },
        required: ['doc_ids'],
      },
    },
  },
]
