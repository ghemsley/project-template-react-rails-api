import { createIdSelector } from 'redux-views'

export const selectId = createIdSelector(id => id)
export const selectCurrentUserId = state => state.authentication.currentUser.id
