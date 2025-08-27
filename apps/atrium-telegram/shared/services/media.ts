import { type } from 'arktype'

const MAX_FILE_SIZE = 20000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

const FileSchema = type('File')
  .narrow((file) => file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type))
  .describe('error.file-size-or-type')

export const uploadMediaSchema = type({
  file: FileSchema,
})
export type UploadMedia = typeof uploadMediaSchema.infer
