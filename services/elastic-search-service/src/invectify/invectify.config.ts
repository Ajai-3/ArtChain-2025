import { Container } from "inversify";
import { TYPES } from "./types";

// Repositories
import { IArtElasticRepository } from "../interface/IArtElasticRepository";
import { IUserElasticRepository } from "../interface/IUserElasticRepository";

import { ArtElasticRepository } from "../repositories/ArtElastic.repository";
import { UserElasticRepository } from "../repositories/UserElastic.repository";

// Services
import { IArtElasticService } from "../interface/IArtElasticService";

import { ArtElasticService } from "../services/ArtElastic.service";

// Controllers
import { IArtElasticController } from "../interface/IArtElasticController";
import { IUserElasticController } from "../interface/IUserElasticController";
import { IElasticSearchController } from "../interface/IElasticSearchController";

import { ArtElasticController } from "../controller/ArtElastic.controller";
import { UserElasticController } from "./../controller/UserElastic.controller";
import { ElasticSearchController } from "../controller/ElasticSearch.controller";
import { IUserElasticService } from "../interface/IUserElasticService";
import { UserElasticService } from "../services/UserElastic.service";

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
