import { UserProfile } from './user-profile';

export interface UserProfileService {
  setProfile(profile: UserProfile)

  getProfile(): UserProfile
}
