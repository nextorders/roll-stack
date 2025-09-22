import type { User } from '@roll-stack/database'

export function hasPermission(user: User, permission: PermissionCode): boolean {
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  if (!user.permissions.length || !user.permissions.includes(permission)) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  return true
}
