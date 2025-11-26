export const TYPES = {
  // Repositories
  IUserRepository: Symbol.for('IUserRepository'),
  IReportRepository: Symbol.for('IReportRepository'),
  ISupporterRepository: Symbol.for('ISupporterRepository'),
  IUserSearchRepository: Symbol.for('IUserSearchRepository'),
  IArtistRequestRepository: Symbol.for('IArtistRequestRepository'),
  
  // Services
  IArtService: Symbol.for('IArtService'),
  IUserService: Symbol.for('IUserService'),
  
  // Use cases - Artist Request
  ICreateArtistRequestUseCase: Symbol.for('ICreateArtistRequestUseCase'),
  ICheckUserArtistRequestUseCase: Symbol.for('ICheckUserArtistRequestUseCase'),
  
  // Use cases - Security
  IChangeEmailUserUseCase: Symbol.for('IChangeEmailUserUseCase'),
  IChangePasswordUserUseCase: Symbol.for('IChangePasswordUserUseCase'),
  IVerifyEmailTokenUserUseCase: Symbol.for('IVerifyEmailTokenUserUseCase'),

  // Use cases - Auth
  ILoginUserUseCase: Symbol.for('ILoginUserUseCase'),
  IRefreshTokenUseCase: Symbol.for('IRefreshTokenUseCase'),
  IRegisterUserUseCase: Symbol.for('IRegisterUserUseCase'),
  IGoogleAuthUserUseCase: Symbol.for('IGoogleAuthUserUseCase'),
  IResetPasswordUserUseCase: Symbol.for('IResetPasswordUserUseCase'),
  IStartRegisterUserUseCase: Symbol.for('IStartRegisterUserUseCase'),
  IForgotPasswordUserUseCase: Symbol.for('IForgotPasswordUserUseCase'),
  IAddUserToElasticSearchUseCase: Symbol.for('IAddUserToElasticSearchUseCase'),

  // Use cases - User Profile & Interaction
  ISupportUserUseCase: Symbol.for('ISupportUserUseCase'),
  IUnSupportUserUseCase: Symbol.for('IUnSupportUserUseCase'),
  IGetUserWithIdUseCase: Symbol.for('IGetUserWithIdUseCase'),
  IGetUsersByIdsUseCase: Symbol.for('IGetUsersByIdsUseCase'),
  IGetUserProfileUseCase: Symbol.for('IGetUserProfileUseCase'),
  IGetUserSupportersUseCase: Symbol.for('IGetUserSupportersUseCase'),
  IGetUserSupportingUseCase: Symbol.for('IGetUserSupportingUseCase'),
  IUpdateProfileUserUseCase: Symbol.for('IUpdateProfileUserUseCase'),

  // Use cases - Report
  ICreateReportUseCase: Symbol.for('ICreateReportUseCase'),
  
  // Admin Use cases
  ILoginAdminUseCase: Symbol.for('ILoginAdminUseCase'),
  IGetAllUsersUseCase: Symbol.for('IGetAllUsersUseCase'),
  IBanOrUnbanUserUseCase: Symbol.for('IBanOrUnbanUserUseCase'),
  IRejectArtistRequestUseCase: Symbol.for('IRejectArtistRequestUseCase'),
  IGetAllArtistRequestsUseCase: Symbol.for('IGetAllArtistRequestsUseCase'),
  IApproveArtistRequestUseCase: Symbol.for('IApproveArtistRequestUseCase'),

  // Controllers
  IUserController: Symbol.for('IUserController'),
  IReportController: Symbol.for('IReportController'),
  ISecurityController: Symbol.for('ISecurityController'),
  IUserAuthController: Symbol.for('IUserAuthController'),
  IArtistRequestController: Symbol.for('IArtistRequestController'),

  // Admin Controllers
  IAdminAuthController: Symbol.for('IAdminAuthController'),
  IUserManageMentController: Symbol.for('IUserManageMentController'),
};
