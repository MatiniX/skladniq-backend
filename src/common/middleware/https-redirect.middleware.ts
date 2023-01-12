import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (!req.secure) {
      const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
      // NEUVERITEĽNÉ! Tento jeden trik opraví chybu s CORS a redirectom. Prehliadače ho nenávidia!
      // TODO - Seriozné mal by byť status 308 (permanent redirect) ale takto sa nekontroluje CORS
      res.redirect(HttpStatus.OK, httpsUrl);
    } else {
      next();
    }
  }
}
