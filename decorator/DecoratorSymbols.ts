// Common symbols used by multiple application decorators
export const LoadCallbacks = Symbol('___LoadCallbacks')
export const StopCallbacks = Symbol('___StopCallbacks')
export const ButtonCallbacks = Symbol('___ButtonCallbacks')
export const SelectCallbacks = Symbol('___SelectCallbacks')
export const MessageCallbacks = Symbol('___MessageCallbacks')

// Wildcard used for callbacks that usually require a filter
export const CALLBACK_WILDCARD = '*'