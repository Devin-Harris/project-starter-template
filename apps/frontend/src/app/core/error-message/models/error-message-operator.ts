import { Observable, OperatorFunction, filter } from 'rxjs';
import { errorMessageToken } from './error-message-actions';

/**
 * This is an operator to denote if an action is to be opened with the error message dialog.
 * For this it will need an error object, and it will need to have the special errorMessageToken key set to
 * some truthy value. The createErrorMessageAction and createErrorMessageActionEvent should do this for you automatically.
 */
export function ofTypeErrorMessage(): OperatorFunction<any, any> {
  return (source: Observable<any>): Observable<any> =>
    source.pipe(filter((action) => action[errorMessageToken] && action.error));
}
