import { useState } from 'react';
import QRCode from 'react-qr-code'; // QR 코드 생성 라이브러리
import { processPaymentAPI } from '../../api/member/processPaymentAPI '; // 결제 API 호출

const QRPaymentPage = () => {
  const [qrUrl] = useState(`${import.meta.env.VITE_BASE_URL}api/pay`); // 고정된 URL 설정
  const [status, setStatus] = useState(''); // 상태 메시지 저장
  const [loading, setLoading] = useState(false); // 로딩 상태 저장

  // 결제 요청을 직접 트리거하는 함수
  const handlePayment = async () => {
    setLoading(true);
    try {
      const isSuccess = await processPaymentAPI(); // 결제 요청 호출
      if (isSuccess) {
        setStatus('결제가 성공적으로 처리되었습니다!');
      } else {
        setStatus('결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('결제 요청 실패:', error);
      setStatus('결제 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          QR 결제 페이지
        </h1>

        {/* QR 코드 생성 결과 */}
        {qrUrl && (
          <div className="flex justify-center mb-6">
            <QRCode value={qrUrl} size={200} />
          </div>
        )}

        {/* 결제 요청을 수동으로 트리거할 수 있는 버튼 */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? '결제 처리 중...' : '결제 요청 보내기'}
        </button>

        {/* 결제 처리 상태 메시지 */}
        {status && (
          <p className="text-center mt-4 font-semibold text-lg text-gray-700">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default QRPaymentPage;
