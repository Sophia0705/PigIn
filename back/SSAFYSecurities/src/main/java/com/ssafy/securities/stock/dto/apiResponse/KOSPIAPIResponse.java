package com.ssafy.securities.stock.dto.apiResponse;

import com.ssafy.securities.stock.dto.KospiDetailDTO;
import com.ssafy.securities.stock.dto.KospiHistoryDTO;
import lombok.Data;

import java.util.List;

@Data
public class KOSPIAPIResponse {
    private KospiDetailDTO output1;
    private List<KospiHistoryDTO> output2;
    private String rt_cd;
    private String msg_cd;
    private String msg1;
}
