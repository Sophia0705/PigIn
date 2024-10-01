import { AxiosResponse } from 'axios';
import axiosInstance from '../axiosInstance';

// 회원 탈퇴 API 함수
export const signOutAPI = async (): Promise<boolean> => {
  try {
    // 회원 탈퇴 요청 (DELETE 방식)
    const response: AxiosResponse =
      await axiosInstance.delete('member/withdrawal');

    // 성공적인 응답 처리
    if (response.status === 200) {
      console.log('회원 탈퇴 성공:', response);
      alert('회원 탈퇴가 완료되었습니다.');

      window.location.href = '/'; // 회원 탈퇴 후 메인 페이지로 리디렉션
      return true; // 성공적으로 회원 탈퇴가 완료되었으므로 true 반환
    } else {
      console.log('오류 코드:', response.status);
      alert('회원 탈퇴 실패했습니다!');
      return false; // 응답 상태 코드가 200이 아닌 경우 false 반환
    }
  } catch (error) {
    // 오류 처리
    console.error('회원 탈퇴 실패:', error);
    alert('회원 탈퇴 실패했습니다.');
    return false; // 예외가 발생한 경우 false 반환
  }
};
