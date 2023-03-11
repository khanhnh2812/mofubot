import { IAppSetup } from '@/interface/utils/app-setup.interface';
import { Service } from 'typedi';

@Service()
export class TestRoutes implements IAppSetup {
  public setup(app) {
    app.post('/test', (req, res) => {
      res.send(req.body);
    });
  }
}
