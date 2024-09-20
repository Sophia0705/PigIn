const StockData = [
  {
    hts_kor_isnm: '삼성전자asdasdasdasd', // 주식 이름
    stck_shrn_iscd: '005930.KSasdasdasdasd', // 주식 코드
    stck_prpr: 67500, // 현재가
    marketCap: '402조', // 시가총액
    acml_vol: '15000000', // 누적 거래량
    prdy_ctrt: '+0.45%', // 전일 대비 등락률
    stck_oprc: 67000, // 시가
    stck_prdy_clpr: 67500, // 전일 종가
    stck_hgpr: 67800, // 고가
    stck_lwpr: 66500, // 저가
    weeklyPrices: [67200, 67400, 67550, 67000, 66800, 67500, 67500], // 주간 가격
    monthlyPrices: [
      66000, 66200, 66500, 66400, 66800, 67000, 67200, 67000, 67500, 67400,
      67300, 67600, 67800, 68000, 67500, 67400, 67100, 67200, 67000, 66900,
      67100, 67200, 67500, 67700, 67600, 67800, 67900, 68000, 67800, 67500,
    ], // 월간 가격
    stck_mxpr: 86000, // 최고가
    stck_llam: 46400, // 최저가
    askp: 67500, // 매도호가
    bidp: 67400, // 매수호가
    prdy_vrss: '-1300', // 전일 대비 가격 차이
    prdy_vol: '30651376', // 전일 거래량
    stck_prdy_oprc: 67000, // 전일 시가
    stck_prdy_hgpr: 67300, // 전일 고가
    stck_prdy_lwpr: 66000, // 전일 저가
    vol_tnrt: '0.60', // 거래량 회전율
    stck_fcam: '100', // 주식 액면가
    lstn_stcn: '5969782550', // 상장 주식 수
    per: '30.46', // 주가수익비율(PER)
    eps: '2131.00', // 주당순이익(EPS)
    pbr: '1.25', // 주가순자산비율(PBR)
    cpfn: '7780', // 현금 흐름
    stck_hgpr_oprc: 65100, // 고가 기준 시가
    stck_hgpr_clpr: 67500, // 고가 기준 종가
    itewhol_loan_rmnd_ratem: '0.15', // 대출 잔액 비율
  },
  {
    hts_kor_isnm: 'SK하이닉스',
    stck_shrn_iscd: '000660.KS',
    stck_prpr: 125000,
    marketCap: '92조',
    acml_vol: '780000',
    prdy_ctrt: '+1.20%',
    stck_oprc: 123500,
    stck_prdy_clpr: 125000,
    stck_hgpr: 126000,
    stck_lwpr: 121500,
    weeklyPrices: [122000, 124000, 123000, 123500, 125000, 125500, 125000],
    monthlyPrices: [
      120000, 121500, 122000, 123000, 124500, 123500, 124000, 125000, 126000,
      127500, 128000, 126500, 125000, 124500, 123000, 122000, 121000, 122500,
      123000, 123500, 124000, 125000, 126000, 127000, 126500, 125500, 125000,
      124500, 124000, 123500,
    ],
    stck_mxpr: 135000,
    stck_llam: 92000,
    askp: 125000,
    bidp: 124500,
    prdy_vrss: '+1500',
    prdy_vol: '760000',
    stck_prdy_oprc: 123500,
    stck_prdy_hgpr: 126000,
    stck_prdy_lwpr: 121500,
    vol_tnrt: '0.45',
    stck_fcam: '5000',
    lstn_stcn: '700000000',
    per: '18.23',
    eps: '6850.00',
    pbr: '1.35',
    cpfn: '12550',
    stck_hgpr_oprc: 126000,
    stck_hgpr_clpr: 125000,
    itewhol_loan_rmnd_ratem: '0.22',
  },
  {
    hts_kor_isnm: '현대차',
    stck_shrn_iscd: '005380.KS',
    stck_prpr: 210000,
    marketCap: '47조',
    acml_vol: '520000',
    prdy_ctrt: '+0.95%',
    stck_oprc: 208000,
    stck_prdy_clpr: 210000,
    stck_hgpr: 213000,
    stck_lwpr: 205000,
    weeklyPrices: [206500, 208000, 207000, 205500, 210000, 211000, 210000],
    monthlyPrices: [
      200000, 201500, 202000, 202500, 204000, 205000, 206500, 207000, 208500,
      209000, 210000, 211500, 213000, 212000, 211000, 210000, 209500, 208000,
      207000, 206500, 205000, 204500, 205500, 207000, 208500, 209000, 210500,
      211000, 210000, 208000,
    ],
    stck_mxpr: 240000,
    stck_llam: 180000,
    askp: 210000,
    bidp: 209500,
    prdy_vrss: '+2000',
    prdy_vol: '470000',
    stck_prdy_oprc: 208000,
    stck_prdy_hgpr: 213000,
    stck_prdy_lwpr: 205000,
    vol_tnrt: '0.40',
    stck_fcam: '5000',
    lstn_stcn: '220000000',
    per: '12.35',
    eps: '16990.00',
    pbr: '1.10',
    cpfn: '17800',
    stck_hgpr_oprc: 213000,
    stck_hgpr_clpr: 210000,
    itewhol_loan_rmnd_ratem: '0.18',
  },
  {
    hts_kor_isnm: 'LG전자',
    stck_shrn_iscd: '066570.KS',
    stck_prpr: 150000,
    marketCap: '24조',
    acml_vol: '400000',
    prdy_ctrt: '-0.67%',
    stck_oprc: 151000,
    stck_prdy_clpr: 150000,
    stck_hgpr: 152000,
    stck_lwpr: 148500,
    weeklyPrices: [149500, 151000, 150500, 149000, 150000, 151000, 150000],
    monthlyPrices: [
      148000, 149500, 150000, 149500, 151000, 152500, 150500, 150000, 148500,
      149000, 150000, 151000, 150000, 149000, 148000, 150000, 151500, 152000,
      151500, 150500, 151000, 150000, 149500, 148500, 149000, 150000, 151500,
      150000, 148000, 149500,
    ],
    stck_mxpr: 180000,
    stck_llam: 115000,
    askp: 150000,
    bidp: 149900,
    prdy_vrss: '-1000',
    prdy_vol: '320000',
    stck_prdy_oprc: 151000,
    stck_prdy_hgpr: 152000,
    stck_prdy_lwpr: 149000,
    vol_tnrt: '0.35',
    stck_fcam: '5000',
    lstn_stcn: '300000000',
    per: '9.87',
    eps: '15191.00',
    pbr: '1.03',
    cpfn: '15870',
    stck_hgpr_oprc: 152000,
    stck_hgpr_clpr: 150000,
    itewhol_loan_rmnd_ratem: '0.20',
  },
  {
    hts_kor_isnm: '네이버',
    stck_shrn_iscd: '035420.KS',
    stck_prpr: 310000,
    marketCap: '51조',
    acml_vol: '1200000',
    prdy_ctrt: '+0.80%',
    stck_oprc: 308000,
    stck_prdy_clpr: 310000,
    stck_hgpr: 312000,
    stck_lwpr: 304000,
    weeklyPrices: [305000, 307500, 308000, 308500, 310000, 311000, 310000],
    monthlyPrices: [
      300000, 301500, 303000, 305000, 306500, 307000, 308000, 309000, 310000,
      311500, 313000, 312000, 311000, 310500, 309000, 308000, 307500, 307000,
      306000, 308000, 309500, 310000, 312000, 313000, 311500, 310000, 308500,
      309000, 308000, 307000,
    ],
    stck_mxpr: 380000,
    stck_llam: 220000,
    askp: 310000,
    bidp: 309500,
    prdy_vrss: '+2500',
    prdy_vol: '1150000',
    stck_prdy_oprc: 308000,
    stck_prdy_hgpr: 312000,
    stck_prdy_lwpr: 304000,
    vol_tnrt: '0.55',
    stck_fcam: '100',
    lstn_stcn: '300000000',
    per: '45.12',
    eps: '6865.00',
    pbr: '3.25',
    cpfn: '8500',
    stck_hgpr_oprc: 312000,
    stck_hgpr_clpr: 310000,
    itewhol_loan_rmnd_ratem: '0.18',
  },
];

export default StockData;
