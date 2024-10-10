import axiosInstance from '../axiosInstance'; // 이미 설정된 axiosInstance 가져오기

// 가상화폐 찜 목록 조회 API (5개만 가져오는 함수)
export const fetchCryptoFavoriteAPI = async (count: number = 5) => {
  try {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const response = await axiosInstance.get('api/coin/favorite', {
      params: { count }, // count를 파라미터로 추가
    });
    console.log(`URL : ${baseURL}api/coin/fevorite`);
    console.log('가져온 데이터 : ', response);
    return response.data; // 성공 시 데이터 반환
  } catch (error) {
    console.error('가상화폐 찜 목록 불러오기 실패:', error);
    throw error;
  }
};
