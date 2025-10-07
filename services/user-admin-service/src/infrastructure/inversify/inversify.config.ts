import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories & Services
import { IArtService } from '../../domain/http/IArtService';
import { IUserRepository } from '../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../domain/repositories/user/ISupporterRepository';
import { IArtistRequestRepository } from '../../domain/repositories/user/IArtistRequestRepository';

import { ArtService } from '../http/ArtService';
import { UserRepositoryImpl } from '../repositories/user/UserRepositoryImpl';
import { SupporterRepositoryImpl } from '../repositories/user/SupporterRepositoryIml';
import { ArtistRequestRepositoryImpl } from '../repositories/user/ArtistRequestRepositoryImpl';

// Use cases - Artist Request
import { ICreateArtistRequestUseCase } from '../../application/interface/usecases/user/artist-request/ICreateArtistRequestUseCase';
import { ICheckUserArtistRequestUseCase } from '../../application/interface/usecases/user/artist-request/ICheckUserArtistRequestUseCase';
import { CreateArtistRequestUseCase } from '../../application/usecases/user/artist-request/CreateArtistRequestUseCase';
import { CheckUserArtistRequestUseCase } from '../../application/usecases/user/artist-request/CheckUserArtistRequestUseCase';

// Use cases - Security
import { IChangeEmailUserUseCase } from '../../application/interface/usecases/user/security/IChangeEmailUserUseCase';
import { IChangePasswordUserUseCase } from '../../application/interface/usecases/user/security/IChangePasswordUserUseCase';
import { IVerifyEmailTokenUserUseCase } from '../../application/interface/usecases/user/security/IVerifyEmailTokenUserUseCase';
import { ChangeEmailUserUseCase } from '../../application/usecases/user/security/ChangeEmailUserUseCase';
import { ChangePasswordUserUseCase } from '../../application/usecases/user/security/ChangePasswordUserUseCase';
import { VerifyEmailTokenUserUseCase } from '../../application/usecases/user/security/VerifyEmailTokenUserUseCase';

// Use cases - Auth
import { ILoginUserUseCase } from '../../application/interface/usecases/user/auth/ILoginUserUseCase';
import { IRefreshTokenUseCase } from '../../application/interface/usecases/user/auth/IRefreshTokenUseCase';
import { IRegisterUserUseCase } from '../../application/interface/usecases/user/auth/IRegisterUserUseCase';
import { IGoogleAuthUserUseCase } from '../../application/interface/usecases/user/auth/IGoogleAuthUserUseCase';
import { IResetPasswordUserUseCase } from '../../application/interface/usecases/user/auth/IResetPasswordUserUseCase';
import { IStartRegisterUserUseCase } from '../../application/interface/usecases/user/auth/IStartRegisterUserUseCase';
import { IForgotPasswordUserUseCase } from '../../application/interface/usecases/user/auth/IForgotPasswordUserUseCase';
import { IAddUserToElasticSearchUseCase } from '../../application/interface/usecases/user/search/IAddUserToElasticSearchUseCase';

import { LoginUserUseCase } from '../../application/usecases/user/auth/LoginUserUseCase';
import { RegisterUserUseCase } from '../../application/usecases/user/auth/RegisterUserUseCase';
import { GoogleAuthUserUseCase } from '../../application/usecases/user/auth/GoogleAuthUserUseCase';
import { RefreshTokenUserUseCase } from '../../application/usecases/user/auth/RefreshTokenUserUseCase';
import { ResetPasswordUserUseCase } from '../../application/usecases/user/auth/ResetPasswordUserUseCase';
import { StartRegisterUserUseCase } from '../../application/usecases/user/auth/StartRegisterUserUseCase';
import { ForgotPasswordUserUseCase } from '../../application/usecases/user/auth/ForgotPasswordUserUseCase';
import { AddUserToElasticSearchUseCase } from '../../application/usecases/user/search/AddUserToElasticSearchUseCase';

// Use cases - User Profile & Interaction
import { ISupportUserUseCase } from '../../application/interface/usecases/user/user-intraction/ISupportUserUseCase';
import { IUnSupportUserUseCase } from '../../application/interface/usecases/user/user-intraction/IUnSupportUserUseCase';
import { IGetUserWithIdUserUseCase } from '../../application/interface/usecases/user/profile/IGetUserWithIdUserUseCase';
import { IGetUsersByIdsUserUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase';
import { IGetUserProfileUseCase } from '../../application/interface/usecases/user/profile/IGetUserProfileUseCase';
import { IGetUserSupportersUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUserSupportersUseCase';
import { IGetUserSupportingUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUserSupportingUseCase';
import { IUpdateProfileUserUseCase } from '../../application/interface/usecases/user/profile/IUpdateProfileUserUseCase';

import { SupportUserUseCase } from '../../application/usecases/user/user-intraction/SupportUserUseCase';
import { UnSupportUserUseCase } from '../../application/usecases/user/user-intraction/UnSupportUserUseCase';
import { GetUserWithIdUserUseCase } from '../../application/usecases/user/profile/GetUserWithIdUserUseCase';
import { GetUsersByIdsUserUseCase } from '../../application/usecases/user/user-intraction/GetUsersByIdsUserUseCase';
import { GetUserProfileUseCase } from '../../application/usecases/user/profile/GetProfileUserUseCase';
import { GetUserSupportersUseCase } from '../../application/usecases/user/user-intraction/GetUserSupportersUseCase';
import { GetUserSupportingUseCase } from '../../application/usecases/user/user-intraction/GetUserSupportingUseCase';
import { UpdateProfileUserUseCase } from '../../application/usecases/user/profile/UpdateProfileUserUseCase';

// Controllers
import { IUserController } from '../../presentation/interfaces/user/IUserController';
import { ISecurityController } from '../../presentation/interfaces/user/ISecurityController';
import { IUserAuthController } from '../../presentation/interfaces/user/IUserAuthController';
import { IArtistRequestController } from '../../presentation/interfaces/user/IArtistRequestController';

import { UserController } from '../../presentation/controllers/user/UserController';
import { SecurityController } from '../../presentation/controllers/user/SecurityController';
import { UserAuthController } from '../../presentation/controllers/user/UserAuthController';
import { ArtistRequestController } from '../../presentation/controllers/user/ArtistRequestController';

const container = new Container();

// Repositories & Services
container.bind<IArtService>(TYPES.IArtService).to(ArtService).inSingletonScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepositoryImpl).inSingletonScope();
container.bind<ISupporterRepository>(TYPES.ISupporterRepository).to(SupporterRepositoryImpl).inSingletonScope();
container.bind<IArtistRequestRepository>(TYPES.IArtistRequestRepository).to(ArtistRequestRepositoryImpl).inSingletonScope();

// Use cases - Artist Request
container.bind<ICreateArtistRequestUseCase>(TYPES.ICreateArtistRequestUseCase).to(CreateArtistRequestUseCase);
container.bind<ICheckUserArtistRequestUseCase>(TYPES.ICheckUserArtistRequestUseCase).to(CheckUserArtistRequestUseCase);

// Use cases - Security
container.bind<IChangePasswordUserUseCase>(TYPES.IChangePasswordUserUseCase).to(ChangePasswordUserUseCase);
container.bind<IChangeEmailUserUseCase>(TYPES.IChangeEmailUserUseCase).to(ChangeEmailUserUseCase);
container.bind<IVerifyEmailTokenUserUseCase>(TYPES.IVerifyEmailTokenUserUseCase).to(VerifyEmailTokenUserUseCase);

// Use cases - Auth
container.bind<IStartRegisterUserUseCase>(TYPES.IStartRegisterUserUseCase).to(StartRegisterUserUseCase);
container.bind<IRegisterUserUseCase>(TYPES.IRegisterUserUseCase).to(RegisterUserUseCase);
container.bind<ILoginUserUseCase>(TYPES.ILoginUserUseCase).to(LoginUserUseCase);
container.bind<IGoogleAuthUserUseCase>(TYPES.IGoogleAuthUserUseCase).to(GoogleAuthUserUseCase);
container.bind<IForgotPasswordUserUseCase>(TYPES.IForgotPasswordUserUseCase).to(ForgotPasswordUserUseCase);
container.bind<IResetPasswordUserUseCase>(TYPES.IResetPasswordUserUseCase).to(ResetPasswordUserUseCase);
container.bind<IRefreshTokenUseCase>(TYPES.IRefreshTokenUseCase).to(RefreshTokenUserUseCase);
container.bind<IAddUserToElasticSearchUseCase>(TYPES.IAddUserToElasticSearchUseCase).to(AddUserToElasticSearchUseCase);

// Use cases - User Profile & Interaction
container.bind<ISupportUserUseCase>(TYPES.ISupportUserUseCase).to(SupportUserUseCase);
container.bind<IUnSupportUserUseCase>(TYPES.IUnSupportUserUseCase).to(UnSupportUserUseCase);
container.bind<IGetUserWithIdUserUseCase>(TYPES.IGetUserWithIdUseCase).to(GetUserWithIdUserUseCase);
container.bind<IGetUsersByIdsUserUseCase>(TYPES.IGetUsersByIdsUseCase).to(GetUsersByIdsUserUseCase);
container.bind<IGetUserProfileUseCase>(TYPES.IGetUserProfileUseCase).to(GetUserProfileUseCase);
container.bind<IGetUserSupportersUseCase>(TYPES.IGetUserSupportersUseCase).to(GetUserSupportersUseCase);
container.bind<IGetUserSupportingUseCase>(TYPES.IGetUserSupportingUseCase).to(GetUserSupportingUseCase);
container.bind<IUpdateProfileUserUseCase>(TYPES.IUpdateProfileUserUseCase).to(UpdateProfileUserUseCase);

// Controllers
container.bind<IUserController>(TYPES.IUserController).to(UserController);
container.bind<ISecurityController>(TYPES.ISecurityController).to(SecurityController);
container.bind<IUserAuthController>(TYPES.IUserAuthController).to(UserAuthController);
container.bind<IArtistRequestController>(TYPES.IArtistRequestController).to(ArtistRequestController);

export { container };