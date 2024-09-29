import axiosInstance from '../axiosInstance';

// 로그인 요청에 필요한 데이터 타입 정의
interface SignOutRequest {
  username: string; // 이메일(username)로 전달
}

// 회원 탈퇴 API 함수
export const SignOutAPI = async (data: SignOutRequest): Promise<void> => {
  try {
    // 회원 탈퇴 요청 (DELETE 방식)
    const response = await axiosInstance.delete<void>('member/withdrawal', {
      data,
    });

    // 성공적인 응답 처리
    if (response.status === 200) {
      console.log('회원 탈퇴 성공:', response);
      alert('회원 탈퇴가 완료되었습니다.');

      window.location.href = '/'; // 회원 탈퇴 후 메인 페이지로 리디렉션
    } else {
      console.log('오류 코드:', response.status);
      alert('회원 탈퇴 실패했습니다!');
    }
  } catch (error) {
    // 오류 처리
    console.error('회원 탈퇴 실패:', error);
    alert('회원 탈퇴 실패했습니다.');
  }
};
