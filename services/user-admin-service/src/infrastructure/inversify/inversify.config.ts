import 'reflect-metadata';
import { TYPES } from './types';
import { Container } from 'inversify';

// Auth
import { ITokenGenerator } from '../../application/interface/auth/ITokenGenerator';
import { IEmailTokenVerifier } from '../../application/interface/auth/IEmailTokenVerifier';
import { IAccessTokenVerifier } from '../../application/interface/auth/IAccessTokenVerifier';
import { IRefreshTokenVerifier } from '../../application/interface/auth/IRefreshTokenVerifier';
import { IGoogleTokenVerifier } from '../../application/interface/auth/IGoogleTokenVerifier';

import { JwtTokenAdapter } from '../auth/JwtTokenAdapter';
import { FirebaseGoogleTokenVerifier } from '../auth/FirebaseGoogleTokenVerifier';

// Messaging
import { IEventBus } from '../../application/interface/events/IEventBus';
import { IMessagePublisher } from '../../application/interface/messaging/IMessagePublisher';

import { EventBus } from '../../application/events/EventBus';
import { RabbitMQMessagePublisher } from '../messaging/RabbitMQMessagePublisher';
import { EventType } from '../../domain/events/EventType';
import { IEventHandler } from '../../application/interface/events/handlers/IEventHandler';

// Handlers
import { UserCreatedElasticHandler } from '../../application/events/handlers/UserCreatedElasticHandler';
import { UserSupportedRabbitHandler } from '../../application/events/handlers/UserSupportedRabbitHandler';
import { EmailVerificationRabbitHandler } from '../../application/events/handlers/EmailVerificationRabbitHandler';
import { EmailChangeVerificationRabbitHandler } from '../../application/events/handlers/EmailChangeVerificationRabbitHandler';
import { UserUpdatedElasticHandler } from '../../application/events/handlers/UserUpdatedElasticHandler';
import { PasswordResetRabbitHandler } from '../../application/events/handlers/PasswordResetRabbitHandler';

// Repositories & Services
import { IArtService } from '../../application/interface/http/IArtService';
import { IUserRepository } from '../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../domain/repositories/user/ISupporterRepository';
import { IArtistRequestRepository } from '../../domain/repositories/user/IArtistRequestRepository';

import { ArtService } from '../http/ArtService';
import { UserRepositoryImpl } from '../repositories/user/UserRepositoryImpl';
import { SupporterRepositoryImpl } from '../repositories/user/SupporterRepositoryIml';
import { ArtistRequestRepositoryImpl } from '../repositories/user/ArtistRequestRepositoryImpl';

// Use cases - Artist Request
import { CreateArtistRequestUseCase } from '../../application/usecases/user/artist-request/CreateArtistRequestUseCase';
import { CheckUserArtistRequestUseCase } from '../../application/usecases/user/artist-request/CheckUserArtistRequestUseCase';
import { ICreateArtistRequestUseCase } from '../../application/interface/usecases/user/artist-request/ICreateArtistRequestUseCase';
import { ICheckUserArtistRequestUseCase } from '../../application/interface/usecases/user/artist-request/ICheckUserArtistRequestUseCase';

// Use cases - Security
import { ChangeEmailUserUseCase } from '../../application/usecases/user/security/ChangeEmailUserUseCase';
import { ChangePasswordUserUseCase } from '../../application/usecases/user/security/ChangePasswordUserUseCase';
import { VerifyEmailTokenUserUseCase } from '../../application/usecases/user/security/VerifyEmailTokenUserUseCase';
import { IChangeEmailUserUseCase } from '../../application/interface/usecases/user/security/IChangeEmailUserUseCase';
import { IChangePasswordUserUseCase } from '../../application/interface/usecases/user/security/IChangePasswordUserUseCase';
import { IVerifyEmailTokenUserUseCase } from '../../application/interface/usecases/user/security/IVerifyEmailTokenUserUseCase';

// Use cases - Auth
import { ILoginUserUseCase } from '../../application/interface/usecases/user/auth/ILoginUserUseCase';
import { ILogoutUserUseCase } from '../../application/interface/usecases/user/auth/ILogoutUserUseCase';
import { IRefreshTokenUseCase } from '../../application/interface/usecases/user/auth/IRefreshTokenUseCase';
import { IRegisterUserUseCase } from '../../application/interface/usecases/user/auth/IRegisterUserUseCase';
import { IGoogleAuthUserUseCase } from '../../application/interface/usecases/user/auth/IGoogleAuthUserUseCase';
import { IResetPasswordUserUseCase } from '../../application/interface/usecases/user/auth/IResetPasswordUserUseCase';
import { IStartRegisterUserUseCase } from '../../application/interface/usecases/user/auth/IStartRegisterUserUseCase';
import { IForgotPasswordUserUseCase } from '../../application/interface/usecases/user/auth/IForgotPasswordUserUseCase';
import { IInitializeAuthUseCase } from '../../application/interface/usecases/user/auth/InitializeAuthUseCase';

import { LogoutUserUseCase } from '../../application/usecases/user/auth/LogoutUserUseCase';
import { LoginUserUseCase } from '../../application/usecases/user/auth/LoginUserUseCase';
import { RegisterUserUseCase } from '../../application/usecases/user/auth/RegisterUserUseCase';
import { GoogleAuthUserUseCase } from '../../application/usecases/user/auth/GoogleAuthUserUseCase';
import { RefreshTokenUserUseCase } from '../../application/usecases/user/auth/RefreshTokenUserUseCase';
import { ResetPasswordUserUseCase } from '../../application/usecases/user/auth/ResetPasswordUserUseCase';
import { StartRegisterUserUseCase } from '../../application/usecases/user/auth/StartRegisterUserUseCase';
import { ForgotPasswordUserUseCase } from '../../application/usecases/user/auth/ForgotPasswordUserUseCase';
import { InitializeAuthUseCase } from '../../application/usecases/user/auth/InitializeAuthUseCase';

// Use cases - User Profile & Interaction
import { IGetUserProfileUseCase } from '../../application/interface/usecases/user/profile/IGetUserProfileUseCase';
import { ISupportUserUseCase } from '../../application/interface/usecases/user/user-intraction/ISupportUserUseCase';
import { IUpdateProfileUserUseCase } from '../../application/interface/usecases/user/profile/IUpdateProfileUserUseCase';
import { IUnSupportUserUseCase } from '../../application/interface/usecases/user/user-intraction/IUnSupportUserUseCase';
import { IGetUserWithIdUserUseCase } from '../../application/interface/usecases/user/profile/IGetUserWithIdUserUseCase';
import { IGetUsersByIdsUserUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase';
import { IGetUserSupportersUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUserSupportersUseCase';
import { IGetUserSupportingUseCase } from '../../application/interface/usecases/user/user-intraction/IGetUserSupportingUseCase';

import { GetUserProfileUseCase } from '../../application/usecases/user/profile/GetProfileUserUseCase';
import { SupportUserUseCase } from '../../application/usecases/user/user-intraction/SupportUserUseCase';
import { UnSupportUserUseCase } from '../../application/usecases/user/user-intraction/UnSupportUserUseCase';
import { GetUserWithIdUserUseCase } from '../../application/usecases/user/profile/GetUserWithIdUserUseCase';
import { UpdateProfileUserUseCase } from '../../application/usecases/user/profile/UpdateProfileUserUseCase';
import { GetUsersByIdsUserUseCase } from '../../application/usecases/user/user-intraction/GetUsersByIdsUserUseCase';
import { GetUserSupportersUseCase } from '../../application/usecases/user/user-intraction/GetUserSupportersUseCase';
import { GetUserSupportingUseCase } from '../../application/usecases/user/user-intraction/GetUserSupportingUseCase';

// Admin Use Cases
import { ILoginAdminUseCase } from '../../application/interface/usecases/admin/auth/ILoginAdminUseCase';
import { IGetAllUsersUseCase } from '../../application/interface/usecases/admin/user-management/IGetAllUsersUseCase';
import { IBanOrUnbanUserUseCase } from '../../application/interface/usecases/admin/user-management/IBanOrUnbanUserUseCase';
import { IRejectArtistRequestUseCase } from '../../application/interface/usecases/admin/user-management/IRejectArtistRequestUseCase';
import { IGetAllArtistRequestsUseCase } from '../../application/interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase';
import { IApproveArtistRequestUseCase } from '../../application/interface/usecases/admin/user-management/IApproveArtistRequestUseCase';

import { LoginAdminUseCase } from '../../application/usecases/admin/auth/LoginAdminUseCase';
import { GetAllUsersUseCase } from '../../application/usecases/admin/user-management/GetAllUsersUseCase';
import { BanOrUnbanUserUseCase } from '../../application/usecases/admin/user-management/BanOrUnbanUserUseCase';
import { GetAllArtistRequestsUseCase } from '../../application/usecases/admin/user-management/GetAllArtistRequests';
import { RejectArtistRequestUseCase } from '../../application/usecases/admin/user-management/RejectArtistRequestUseCase';
import { ApproveArtistRequestUseCase } from './../../application/usecases/admin/user-management/ApproveArtistRequestUseCase';

// Controllers
import { IUserController } from '../../presentation/interfaces/user/IUserController';
import { ISecurityController } from '../../presentation/interfaces/user/ISecurityController';
import { IUserAuthController } from '../../presentation/interfaces/user/IUserAuthController';
import { IArtistRequestController } from '../../presentation/interfaces/user/IArtistRequestController';

import { UserController } from '../../presentation/controllers/user/UserController';
import { SecurityController } from '../../presentation/controllers/user/SecurityController';
import { UserAuthController } from '../../presentation/controllers/user/UserAuthController';
import { ArtistRequestController } from '../../presentation/controllers/user/ArtistRequestController';

// Admin controller
import { IAdminAuthController } from '../../presentation/interfaces/admin/IAdminAuthController';
import { IUserManageMentController } from '../../presentation/interfaces/admin/IUserManagementController';

import { AdminAuthController } from '../../presentation/controllers/admin/AdminAuthController';
import { UserManageMentController } from './../../presentation/controllers/admin/UserManagementController';

// Logger
import { AppLogger } from '../../infrastructure/logger/AppLogger';
import { ILogger } from '../../application/interface/ILogger';

// Report
import { IReportRepository } from '../../domain/repositories/user/IReportRepository';
import { ReportRepository } from '../repositories/user/ReportRepository';
import { ICreateReportUseCase } from '../../application/interface/usecases/user/report/ICreateReportUseCase';
import { CreateReportUseCase } from '../../application/usecases/user/report/CreateReportUseCase';
import { IReportController } from '../../presentation/interfaces/user/IReportController';
import { ReportController } from '../../presentation/controllers/user/ReportController';
import { IGetAllReportsUseCase } from '../../application/interface/usecases/admin/report/IGetAllReportsUseCase';
import { GetAllReportsUseCase } from '../../application/usecases/admin/report/GetAllReportsUseCase';
import { IGetGroupedReportsUseCase } from '../../application/interface/usecases/admin/report/IGetGroupedReportsUseCase';
import { GetGroupedReportsUseCase } from '../../application/usecases/admin/report/GetGroupedReportsUseCase';
import { IUpdateReportStatusBulkUseCase } from '../../application/interface/usecases/admin/report/IUpdateReportStatusBulkUseCase';
import { UpdateReportStatusBulkUseCase } from '../../application/usecases/admin/report/UpdateReportStatusBulkUseCase';
import { IAdminReportController } from '../../presentation/interfaces/admin/IAdminReportController';
import { AdminReportController } from '../../presentation/controllers/admin/AdminReportController';

// Dashboard
import { IWalletService } from '../../application/interface/http/IWalletService';
import { WalletService } from '../http/WalletService';
import { IGetPlatformRevenueStatsUseCase } from '../../application/interface/usecases/admin/IGetPlatformRevenueStatsUseCase';
import { GetPlatformRevenueStatsUseCase } from '../../application/usecases/admin/dashboard/GetPlatformRevenueStatsUseCase';
import { IGetDashboardStatsUseCase } from '../../application/interface/usecases/admin/IGetDashboardStatsUseCase';
import { GetDashboardStatsUseCase } from '../../application/usecases/admin/dashboard/GetDashboardStatsUseCase';
import { IAdminDashboardController } from '../../presentation/interfaces/admin/IAdminDashboardController';
import { AdminDashboardController } from '../../presentation/controllers/admin/AdminDashboardController';
import { IElasticSearchService } from '../../application/interface/http/IElasticSearchService';
import { ElasticSearchService } from '../http/ElasticSearchService';



const container = new Container();

// Auth
container.bind<IAccessTokenVerifier>(TYPES.IAccessTokenVerifier)
.to(JwtTokenAdapter);
container.bind<IRefreshTokenVerifier>(TYPES.IRefreshTokenVerifier)
.to(JwtTokenAdapter);
container.bind<IEmailTokenVerifier>(TYPES.IEmailTokenVerifier)
.to(JwtTokenAdapter);
container.bind<ITokenGenerator>(TYPES.ITokenGenerator)
.to(JwtTokenAdapter);
container.bind<IGoogleTokenVerifier>(TYPES.IGoogleTokenVerifier)
.to(FirebaseGoogleTokenVerifier);

// Repositories & Services
container
.bind<IArtService>(TYPES.IArtService)
  .to(ArtService)
  .inSingletonScope();
container
  .bind<IUserRepository>(TYPES.IUserRepository)
  .to(UserRepositoryImpl)
  .inSingletonScope();
container
  .bind<IElasticSearchService>(TYPES.IElasticSearchService)
  .to(ElasticSearchService)
  .inSingletonScope();

container
  .bind<ISupporterRepository>(TYPES.ISupporterRepository)
  .to(SupporterRepositoryImpl)
  .inSingletonScope();
container
  .bind<IArtistRequestRepository>(TYPES.IArtistRequestRepository)
  .to(ArtistRequestRepositoryImpl)
  .inSingletonScope();

// Use cases - Artist Request
container
  .bind<ICreateArtistRequestUseCase>(TYPES.ICreateArtistRequestUseCase)
  .to(CreateArtistRequestUseCase);
container
  .bind<ICheckUserArtistRequestUseCase>(TYPES.ICheckUserArtistRequestUseCase)
  .to(CheckUserArtistRequestUseCase);

// Use cases - Security
container
  .bind<IChangePasswordUserUseCase>(TYPES.IChangePasswordUserUseCase)
  .to(ChangePasswordUserUseCase);
container
  .bind<IChangeEmailUserUseCase>(TYPES.IChangeEmailUserUseCase)
  .to(ChangeEmailUserUseCase);
container
  .bind<IVerifyEmailTokenUserUseCase>(TYPES.IVerifyEmailTokenUserUseCase)
  .to(VerifyEmailTokenUserUseCase);

// Use cases - Auth
container
  .bind<ILogoutUserUseCase>(TYPES.ILogoutUserUseCase)
  .to(LogoutUserUseCase);
container
  .bind<IStartRegisterUserUseCase>(TYPES.IStartRegisterUserUseCase)
  .to(StartRegisterUserUseCase);
container
  .bind<IRegisterUserUseCase>(TYPES.IRegisterUserUseCase)
  .to(RegisterUserUseCase);
container.bind<ILoginUserUseCase>(TYPES.ILoginUserUseCase).to(LoginUserUseCase);
container
  .bind<IGoogleAuthUserUseCase>(TYPES.IGoogleAuthUserUseCase)
  .to(GoogleAuthUserUseCase);
container
  .bind<IForgotPasswordUserUseCase>(TYPES.IForgotPasswordUserUseCase)
  .to(ForgotPasswordUserUseCase);
container
  .bind<IResetPasswordUserUseCase>(TYPES.IResetPasswordUserUseCase)
  .to(ResetPasswordUserUseCase);
container
  .bind<IRefreshTokenUseCase>(TYPES.IRefreshTokenUseCase)
  .to(RefreshTokenUserUseCase);
container
  .bind<IInitializeAuthUseCase>(TYPES.IInitializeAuthUseCase)
  .to(InitializeAuthUseCase);

// Use cases - User Profile & Interaction
container
  .bind<ISupportUserUseCase>(TYPES.ISupportUserUseCase)
  .to(SupportUserUseCase);
container
  .bind<IUnSupportUserUseCase>(TYPES.IUnSupportUserUseCase)
  .to(UnSupportUserUseCase);
container
  .bind<IGetUserWithIdUserUseCase>(TYPES.IGetUserWithIdUseCase)
  .to(GetUserWithIdUserUseCase);
container
  .bind<IGetUsersByIdsUserUseCase>(TYPES.IGetUsersByIdsUseCase)
  .to(GetUsersByIdsUserUseCase);
container
  .bind<IGetUserProfileUseCase>(TYPES.IGetUserProfileUseCase)
  .to(GetUserProfileUseCase);
container
  .bind<IGetUserSupportersUseCase>(TYPES.IGetUserSupportersUseCase)
  .to(GetUserSupportersUseCase);
container
  .bind<IGetUserSupportingUseCase>(TYPES.IGetUserSupportingUseCase)
  .to(GetUserSupportingUseCase);
container
  .bind<IUpdateProfileUserUseCase>(TYPES.IUpdateProfileUserUseCase)
  .to(UpdateProfileUserUseCase);

// Admin Use cases
// Admin Auth
container
  .bind<ILoginAdminUseCase>(TYPES.ILoginAdminUseCase)
  .to(LoginAdminUseCase);

// User Management Use Cases
container
  .bind<IGetAllUsersUseCase>(TYPES.IGetAllUsersUseCase)
  .to(GetAllUsersUseCase);
container
  .bind<IBanOrUnbanUserUseCase>(TYPES.IBanOrUnbanUserUseCase)
  .to(BanOrUnbanUserUseCase);
container
  .bind<IRejectArtistRequestUseCase>(TYPES.IRejectArtistRequestUseCase)
  .to(RejectArtistRequestUseCase);
container
  .bind<IApproveArtistRequestUseCase>(TYPES.IApproveArtistRequestUseCase)
  .to(ApproveArtistRequestUseCase);
container
  .bind<IGetAllArtistRequestsUseCase>(TYPES.IGetAllArtistRequestsUseCase)
  .to(GetAllArtistRequestsUseCase);

  // Dashboard
  container.bind<IWalletService>(TYPES.IWalletService).to(WalletService).inSingletonScope();
  container.bind<IGetPlatformRevenueStatsUseCase>(TYPES.IGetPlatformRevenueStatsUseCase).to(GetPlatformRevenueStatsUseCase);
  container.bind<IGetDashboardStatsUseCase>(TYPES.IGetDashboardStatsUseCase).to(GetDashboardStatsUseCase);
  container.bind<IAdminDashboardController>(TYPES.IAdminDashboardController).to(AdminDashboardController);


// Logger
container.bind<ILogger>(TYPES.ILogger).to(AppLogger);

// Messaging
container.bind<IEventBus>(TYPES.IEventBus).to(EventBus).inSingletonScope();
container.bind<IMessagePublisher>(TYPES.IMessagePublisher).to(RabbitMQMessagePublisher).inSingletonScope();

// Controllers
container.bind<IUserController>(TYPES.IUserController).to(UserController);
container
  .bind<ISecurityController>(TYPES.ISecurityController)
  .to(SecurityController);
container
  .bind<IUserAuthController>(TYPES.IUserAuthController)
  .to(UserAuthController);
container
  .bind<IArtistRequestController>(TYPES.IArtistRequestController)
  .to(ArtistRequestController);

// Admin Controller
container
  .bind<IAdminAuthController>(TYPES.IAdminAuthController)
  .to(AdminAuthController);
container
  .bind<IUserManageMentController>(TYPES.IUserManageMentController)
  .to(UserManageMentController);

// Report
container.bind<IReportRepository>(TYPES.IReportRepository).to(ReportRepository).inSingletonScope();
container.bind<ICreateReportUseCase>(TYPES.ICreateReportUseCase).to(CreateReportUseCase);
container.bind<IGetAllReportsUseCase>(TYPES.IGetAllReportsUseCase).to(GetAllReportsUseCase);
container.bind<IGetGroupedReportsUseCase>(TYPES.IGetGroupedReportsUseCase).to(GetGroupedReportsUseCase);
container.bind<IUpdateReportStatusBulkUseCase>(TYPES.IUpdateReportStatusBulkUseCase).to(UpdateReportStatusBulkUseCase);
container.bind<IReportController>(TYPES.IReportController).to(ReportController);
container.bind<IAdminReportController>(TYPES.IAdminReportController).to(AdminReportController);


// Register Events
try {
  const eventBus = container.get<IEventBus>(TYPES.IEventBus);

  // User Created
  container.bind<UserCreatedElasticHandler>(UserCreatedElasticHandler).toSelf();
  const userCreatedElasticHandler = container.get<IEventHandler<any>>(UserCreatedElasticHandler);
  eventBus.register(EventType.USER_CREATED, userCreatedElasticHandler);

  // User Supported
  container.bind<UserSupportedRabbitHandler>(UserSupportedRabbitHandler).toSelf();
  const userSupportedRabbitHandler = container.get<IEventHandler<any>>(UserSupportedRabbitHandler);
  eventBus.register(EventType.USER_SUPPORTED, userSupportedRabbitHandler);

  // Email Verification
  container.bind<EmailVerificationRabbitHandler>(EmailVerificationRabbitHandler).toSelf();
  const emailVerificationRabbitHandler = container.get<IEventHandler<any>>(EmailVerificationRabbitHandler);
  eventBus.register(EventType.EMAIL_VERIFICATION, emailVerificationRabbitHandler);

  // Email Change
  container.bind<EmailChangeVerificationRabbitHandler>(EmailChangeVerificationRabbitHandler).toSelf();
  const emailChangeVerificationRabbitHandler = container.get<IEventHandler<any>>(EmailChangeVerificationRabbitHandler);
  eventBus.register(EventType.EMAIL_CHANGE_VERIFICATION, emailChangeVerificationRabbitHandler);

  // User Updated
  container.bind<UserUpdatedElasticHandler>(UserUpdatedElasticHandler).toSelf();
  const userUpdatedElasticHandler = container.get<IEventHandler<any>>(UserUpdatedElasticHandler);
  eventBus.register(EventType.USER_UPDATED, userUpdatedElasticHandler);

   // Password Reset
  container.bind<PasswordResetRabbitHandler>(PasswordResetRabbitHandler).toSelf();
   const passwordResetRabbitHandler = container.get<IEventHandler<any>>(PasswordResetRabbitHandler);
   eventBus.register(EventType.PASSWORD_RESET_REQUESTED, passwordResetRabbitHandler);

   console.log('Events registered successfully via IoC container');
} catch (error) {
  console.error('Error registering events in IoC container:', error);
}

export { container };
