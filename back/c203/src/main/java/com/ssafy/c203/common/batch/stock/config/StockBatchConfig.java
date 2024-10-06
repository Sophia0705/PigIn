package com.ssafy.c203.common.batch.stock.config;

import com.ssafy.c203.common.entity.TradeMethod;
import com.ssafy.c203.domain.stock.entity.StockWaitingQueue;
import com.ssafy.c203.domain.stock.repository.StockWaitingQueueRepository;
import com.ssafy.c203.domain.stock.service.StockService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.batch.item.data.builder.RepositoryItemReaderBuilder;
import org.springframework.batch.item.data.builder.RepositoryItemWriterBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.data.domain.Sort;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class StockBatchConfig {

    private final StockService stockService;
    private final StockWaitingQueueRepository stockWaitingQueueRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;

    @Bean
    public Job processStockWaitingQueueJob() {
        return new JobBuilder("processStockWaitingQueueJob", jobRepository)
                .start(processPendingStockTradeJob())
                .build();
    }

    @Bean
    public Step processPendingStockTradeJob() {
        return new StepBuilder("processPendingStockTradeJob", jobRepository)
                .<StockWaitingQueue, StockWaitingQueue>chunk(1000, platformTransactionManager)
                .reader(waitingStockQueueReader())
                .processor(waitingStockQueueProcessor())
                .writer(waitingStockQueueWriter())
                .faultTolerant()
                .retryLimit(3) // 최대 3번 재시도
                .retry(Exception.class) // 모든 예외에 대해 재시도
                .build();
    }

    @Bean
    public RepositoryItemReader<StockWaitingQueue> waitingStockQueueReader() {
        return new RepositoryItemReaderBuilder<StockWaitingQueue>()
                .name("waitingStockQueueReader")
                .pageSize(50)
                .methodName("findAll")
                .repository(stockWaitingQueueRepository)
                .sorts(Map.of("id", Sort.Direction.ASC))
                .build();
    }

    @Bean
    public ItemProcessor<StockWaitingQueue, StockWaitingQueue> waitingStockQueueProcessor() {
        return waitingQueue -> {
            try {
                boolean tradeSuccess;
                if (waitingQueue.getMethod() == TradeMethod.BUY) {
                    log.info("구매 요청 : memberId: {} ,    StockId{} ,  tradePrice: {}", waitingQueue.getMember().getId(), waitingQueue.getStockItem().getId(), waitingQueue.getTradePrice());
                    // 구매 처리
                    tradeSuccess = stockService.buyStock(
                            waitingQueue.getMember().getId(),
                            waitingQueue.getStockItem().getId(),
                            waitingQueue.getTradePrice(), true
                    );
                } else if (waitingQueue.getMethod() == TradeMethod.SELL) {
                    // 판매 처리
                    tradeSuccess = stockService.sellStock(
                            waitingQueue.getMember().getId(),
                            waitingQueue.getStockItem().getId(),
                            waitingQueue.getTradeAmount(), true
                    );
                } else {
                    throw new IllegalStateException("지원하지 않는 거래 방법: " + waitingQueue.getMethod());
                }

                if (tradeSuccess) {
                    return waitingQueue; // 성공한 주문 반환
                } else {
                    log.error("주식 거래 실패: {}", waitingQueue.getId());
                    return null; // 실패한 경우 null 반환
                }
            } catch (Exception e) {
                log.error("Error processing stock waiting queue (ID: {}): ", waitingQueue.getId(), e);
                throw e; // 예외를 던져 재시도 가능하도록 처리
            }
        };
    }


    @Bean
    public ItemWriter<StockWaitingQueue> waitingStockQueueWriter() {
        return new RepositoryItemWriterBuilder<StockWaitingQueue>()
                .repository(stockWaitingQueueRepository)
                .methodName("delete")
                .build();
    }
}