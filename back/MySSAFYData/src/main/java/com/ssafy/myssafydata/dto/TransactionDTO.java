package com.ssafy.myssafydata.dto;

import lombok.Data;

@Data
public class TransactionDTO {
    private String transactionUniqueNo;
    private String transactionDate;
    private String transactionTime;
    private String transactionType;
    private String transactionTypeName;
    private String transactionAccountNo;
    private String transactionBalance;
    private String transactionAfterBalance;
    private String transactionSummary;
    private String transactionMemo;

    public String getTransactionMemo() {
        return transactionMemo;
    }

    public void setTransactionMemo(String transactionMemo) {
        this.transactionMemo = transactionMemo;
    }

    public String getTransactionSummary() {
        return transactionSummary;
    }

    public void setTransactionSummary(String transactionSummary) {
        this.transactionSummary = transactionSummary;
    }

    public String getTransactionAfterBalance() {
        return transactionAfterBalance;
    }

    public void setTransactionAfterBalance(String transactionAfterBalance) {
        this.transactionAfterBalance = transactionAfterBalance;
    }

    public String getTransactionBalance() {
        return transactionBalance;
    }

    public void setTransactionBalance(String transactionBalance) {
        this.transactionBalance = transactionBalance;
    }

    public String getTransactionAccountNo() {
        return transactionAccountNo;
    }

    public void setTransactionAccountNo(String transactionAccountNo) {
        this.transactionAccountNo = transactionAccountNo;
    }

    public String getTransactionTypeName() {
        return transactionTypeName;
    }

    public void setTransactionTypeName(String transactionTypeName) {
        this.transactionTypeName = transactionTypeName;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(String transactionTime) {
        this.transactionTime = transactionTime;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getTransactionUniqueNo() {
        return transactionUniqueNo;
    }

    public void setTransactionUniqueNo(String transactionUniqueNo) {
        this.transactionUniqueNo = transactionUniqueNo;
    }
}
