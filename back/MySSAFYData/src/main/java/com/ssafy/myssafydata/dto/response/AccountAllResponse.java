package com.ssafy.myssafydata.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.myssafydata.dto.AccountDTO;
import com.ssafy.myssafydata.dto.header.ResponseHeader;

import java.util.List;

public class AccountAllResponse {
    @JsonProperty("Header")
    private ResponseHeader header;

    @JsonProperty("REC")
    private List<AccountDTO> rec;

    public ResponseHeader getHeader() {
        return header;
    }

    public void setHeader(ResponseHeader header) {
        this.header = header;
    }

    public List<AccountDTO> getRec() {
        return rec;
    }

    public void setRec(List<AccountDTO> rec) {
        this.rec = rec;
    }

    @Override
    public String toString() {
        return "AccountAllResponse{" +
                "header=" + header +
                ", rec=" + rec +
                '}';
    }
}
