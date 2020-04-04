export interface User {
  id: string
  name: string
  given_name: string
  family_name: string
  nickname: string | null | undefined

  profile: string | null | undefined
  picture: string | null | undefined
  website: string | null | undefined

  email: string | null | undefined
  gender: string | null | undefined
  birthdate: string | null | undefined
  zoneinfo: string | null | undefined
  locale: string | null | undefined
  phone_number: string | null | undefined

  create_at: Date
  update_at: Date
  last_sync_time: Date

  id_token: string | null | undefined
}