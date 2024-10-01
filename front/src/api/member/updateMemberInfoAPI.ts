import axiosInstance from '../axiosInstance';
import axios, { AxiosResponse } from 'axios'; // AxiosError 타입을 가져오기

// 회원 정보 수정 요청 데이터 타입 정의
interface UpdateMemberInfoRequest {
  savingRate: number;
  phoneNumber: string;
  oldPassword: string;
  newPassword?: string; // 비밀번호 변경 시 새로운 비밀번호 포함
  isChange: boolean; // 비밀번호 변경 여부
}

// 회원 정보 수정 API 함수
export const updateMemberInfoAPI = async (
  data: UpdateMemberInfoRequest
): Promise<boolean> => {
  try {
    console.log('제출 데이터: ', data);

    // PUT 요청으로 사용자 정보 수정 (AxiosResponse로 응답 받기)
    const response = await axiosInstance.put<AxiosResponse>(
      'api/member/update-member', // 회원 정보 수정 API 엔드포인트
      data
    );

    // 응답이 성공적일 경우
    if (response.status === 200) {
      console.log('회원 정보 수정 완료!');
      return true; // 수정 성공 시 true 반환
    }
    return false; // 성공하지 못한 경우 false 반환
  } catch (error: unknown) {
    // 상태 코드에 따른 오류 처리
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        alert('해당 회원을 찾지 못했습니다.');
      } else {
        console.error('회원 정보 수정 실패:', error.response?.data);
        alert('회원 정보 수정에 실패하였습니다.');
      }
    } else {
      console.error('알 수 없는 오류', error);
    }
    return false;
  }
};
