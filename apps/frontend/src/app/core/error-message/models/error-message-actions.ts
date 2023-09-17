import { HttpException } from '@nestjs/common';
import { createAction } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

/**
 * Special token used to denote if an action should be opened with the error message dialog
 */
export const errorMessageToken = 'IS_ERROR_ACTION';

/**
 * Helper types
 */
export type ErrorActionPayload<T extends HttpException> = {
  error: T;
  messageOverride?: string;
  showAsErrorDialog?: boolean;
};
export type ErrorAction<T extends string, E extends HttpException> = {
  type: T;
  payload: ErrorActionPayload<E>;
};
export type ErrorActionPayloadWithToken<E extends HttpException> =
  ErrorActionPayload<E> & {
    [errorMessageToken]: true;
  };
export type ErrorActionPayloadFunctor<E extends HttpException> = (
  payload: ErrorActionPayload<E>
) => ErrorActionPayloadWithToken<E>;
export type ErrorActionPayloadTypedAction<E extends HttpException> =
  ErrorActionPayloadFunctor<E> & TypedAction<any>;
export type ErrorActionEvent<T extends string, E extends HttpException> = {
  [K in T]: ErrorActionPayloadFunctor<E>;
};

/**
 * Error Payload Helpers
 */
function createErrorActionPayloadFunctor<E extends HttpException>(
  showAsErrorDialog: boolean = true
): ErrorActionPayloadFunctor<E> {
  return (payload: ErrorActionPayload<E>) => ({
    error: {
      ...payload.error,
      message: payload.messageOverride ?? payload.error.message,
    } as E,
    showAsErrorDialog:
      payload.showAsErrorDialog !== undefined
        ? payload.showAsErrorDialog
        : showAsErrorDialog,
    [errorMessageToken]: true,
  });
}

export function createErrorActionPayload<E extends HttpException>(
  showAsErrorDialog: boolean = true
): ErrorActionPayloadTypedAction<E> {
  return createErrorActionPayloadFunctor(
    showAsErrorDialog
  ) as ErrorActionPayloadTypedAction<E>;
}

/**
 * Used to create error actions outside of action groups.
 * @param actionType The string representing the type of the action
 * @param exceptionType The type of exception type to super impose into the error object. The error message effects needs this set to open the dialog with the correct message
 * @param showAsErrorDialog Boolean representing whether error action should open the error message dialog. Defaults to true.
 * @returns Action object with both its type set and a payload with an error object and the error message token
 */
export function createErrorMessageAction<
  T extends string,
  E extends HttpException
>(actionType: T, showAsErrorDialog: boolean = true) {
  return createAction(
    actionType,
    createErrorActionPayloadFunctor<E>(showAsErrorDialog)
  );
}

/**
 * Used to create error actions inside of action groups.
 * @param actionType The string representing the type of the action
 * @param exception The exception to super impose into the error object. The error message effects needs this set to open the dialog with the correct message
 * @param showAsErrorDialog Boolean representing whether error action should open the error message dialog. Defaults to true.
 * @returns ErrorActionEvent object that denotes the type of the action through the objects only key, and the payload/props of the action through the payload function
 */
export function createErrorMessageActionEvent<
  T extends string,
  E extends HttpException
>(actionType: T, showAsErrorDialog: boolean = true): ErrorActionEvent<T, E> {
  return {
    [actionType]: createErrorActionPayloadFunctor<E>(showAsErrorDialog),
  } as ErrorActionEvent<T, E>;
}
