import axiosInstance from '../axiosInstance';

// QR 코드를 생성할 때 필요한 API
export const processPaymentAPI = async (): Promise<boolean> => {
  try {
    // 서버에서 결제 URL을 가져오는 API 호출
    const response = await axiosInstance.post('api/pay');
    console.log('QR 결제 API response:', response);

    // status 코드에 따라 성공 여부를 boolean으로 반환
    if (response.status === 200) {
      console.log('QR 결제 성공 response : ', response);
      return true; // 성공
    } else {
      return false; // 실패
    }
  } catch (error) {
    console.error('QR 코드 결제 실패 error : ', error);
    return false; // 실패
  }
};
