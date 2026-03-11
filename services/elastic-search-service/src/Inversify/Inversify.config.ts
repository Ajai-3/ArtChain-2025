import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IArtElasticRepository } from '../interface/IArtElasticRepository';
import { IUserElasticRepository } from '../interface/IUserElasticRepository';

import { ArtElasticRepository } from '../repositories/artElastic.repository';
import { UserElasticRepository } from '../repositories/userElastic.repository';

// Services
import { IArtElasticService } from '../interface/IArtElasticService';

import { ArtElasticService } from '../services/artElastic.service';

// Controllers
import { IArtElasticController } from '../interface/IArtElasticController';
import { IUserElasticController } from '../interface/IUserElasticController';
import { IElasticSearchController } from '../interface/IElasticSearchController';

import { ArtElasticController } from '../controller/artElastic.controller';
import { UserElasticController } from '../controller/userElastic.controller';
import { ElasticSearchController } from '../controller/elasticSearch.controller';
import { IUserElasticService } from '../interface/IUserElasticService';
import { UserElasticService } from '../services/userElastic.service';

const container = new Container();

// Repository
container
  .bind<IArtElasticRepository>(TYPES.IArtElasticRepository)
  .to(ArtElasticRepository)
  .inSingletonScope();
container
  .bind<IUserElasticRepository>(TYPES.IUserElasticRepository)
  .to(UserElasticRepository)
  .inSingletonScope();

// Service
container
  .bind<IArtElasticService>(TYPES.IArtElasticService)
  .to(ArtElasticService);
container
  .bind<IUserElasticService>(TYPES.IUserElasticService)
  .to(UserElasticService);

// Controllers
container
  .bind<IArtElasticController>(TYPES.IArtElasticController)
  .to(ArtElasticController);
container
  .bind<IUserElasticController>(TYPES.IUserElasticController)
  .to(UserElasticController);
container
  .bind<IElasticSearchController>(TYPES.IElasticSearchController)
  .to(ElasticSearchController);

export { container };
