import portfolioData from './portfolio.json';

export const fetchPortfolioData = async () => {
  // 실제 API 호출을 시뮬레이션하기 위해 setTimeout 사용 --> 나중에 수정!
  await new Promise((resolve) => setTimeout(resolve, 500));
  return portfolioData;
};
