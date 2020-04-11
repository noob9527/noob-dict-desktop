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

  create_at: string
  update_at: string
  last_sync_time: string

  id_token: string | null | undefined
}