import { ErrorMessageEffects } from '@frontend/core/error-message/state';
import { LayoutEffects } from '@frontend/core/layout/state/effects';

export const CoreEffects = [...LayoutEffects, ...ErrorMessageEffects];
