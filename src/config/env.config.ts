export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3000,
  /**
   * The number of items to show per page need + to convert to number
   */
  paginationLimit: +process.env.PAGINATION_LIMIT || 5,
});
