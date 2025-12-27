import Anthropic from '@anthropic-ai/sdk'

export const TOOLS: Anthropic.Tool[] = [
  {
    name: 'update_section',
    description: 'move documents to different sections',
    input_schema: {
      type: 'object' as const,
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
  {
    name: 'delete_documents',
    description: 'delete documents',
    input_schema: {
      type: 'object' as const,
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
]
