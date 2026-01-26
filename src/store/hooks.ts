// ============================================================================
// TYPED REDUX HOOKS - TYPE-SAFE ACCESS TO REDUX STORE
// ============================================================================
//
// WHY THIS FILE EXISTS:
// React-Redux provides useDispatch and useSelector hooks, but they don't know
// about your specific Redux store types. These custom hooks add TypeScript
// type information so you get autocomplete and type checking when using Redux.
//
// BENEFITS OF TYPED HOOKS:
// 1. Autocomplete: Your editor suggests available state properties
// 2. Type Safety: Prevents accessing non-existent state or dispatching wrong actions
// 3. Refactoring: If you rename state, TypeScript catches all usages
// 4. Documentation: Types serve as inline documentation
//
// HOW TO USE THESE HOOKS:
// Import these instead of the default React-Redux hooks:
// - Replace: import { useDispatch } from 'react-redux'
// - With: import { useAppDispatch } from './store/hooks'
// - Replace: import { useSelector } from 'react-redux'
// - With: import { useAppSelector } from './store/hooks'
// ============================================================================

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ============================================================================
// useAppDispatch - TYPED VERSION OF useDispatch
// ============================================================================
// Use this hook to dispatch actions with full TypeScript support
//
// WHAT IT DOES:
// Returns a dispatch function that knows about all available actions
//
// EXAMPLE USAGE:
// const dispatch = useAppDispatch();
// dispatch(setUser(userData));      // TypeScript validates this action exists
// dispatch(addVote(voteData));      // TypeScript checks the data shape
// dispatch(updateRoomStatus(true)); // TypeScript ensures boolean is expected
//
// HOW DISPATCHING WORKS:
// 1. You call dispatch(action)
// 2. Redux sends the action to the appropriate reducer
// 3. The reducer updates the state based on the action
// 4. All components using that state automatically re-render
// ============================================================================
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ============================================================================
// useAppSelector - TYPED VERSION OF useSelector
// ============================================================================
// Use this hook to read data from the Redux store with full TypeScript support
//
// WHAT IT DOES:
// Extracts specific data from the Redux state tree and subscribes to updates
//
// EXAMPLE USAGE:
// const user = useAppSelector((state) => state.auth.user);
// const votes = useAppSelector((state) => state.votes.votesByRecommendation);
// const participants = useAppSelector((state) => state.rooms.participants);
//
// HOW IT CAUSES RE-RENDERS:
// 1. The hook subscribes to the Redux store
// 2. When the selected state changes, the hook detects it
// 3. React automatically re-renders your component with the new data
// 4. If the selected state doesn't change, no re-render occurs (efficient!)
//
// IMPORTANT NOTES:
// - Only the component using this hook re-renders, not the whole app
// - Multiple components can select the same state independently
// - The selector function should be pure (no side effects)
// ============================================================================
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
