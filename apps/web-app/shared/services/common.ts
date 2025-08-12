import { type } from 'arktype'

export const weightUnitSchema = type('"G" | "KG" | "ML" | "L" | "OZ" | "LB"')
export type WeightUnit = typeof weightUnitSchema.infer

export const userGenderSchema = type('"male" | "female" | "unknown"')
export type UserGender = typeof userGenderSchema.infer
