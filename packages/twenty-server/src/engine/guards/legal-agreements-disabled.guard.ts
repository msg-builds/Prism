import { type CanActivate, Injectable } from '@nestjs/common';

import { msg } from '@lingui/core/macro';

import { ForbiddenError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';

// Privacy, terms and data-processing agreements are Nebula's; this service must not offer Twenty's
@Injectable()
export class LegalAgreementsDisabledGuard implements CanActivate {
  canActivate(): boolean {
    throw new ForbiddenError(
      'Legal agreements are handled by Nebula, not by this service.',
      {
        userFriendlyMessage: msg`Legal agreements are handled by Nebula.`,
      },
    );
  }
}
