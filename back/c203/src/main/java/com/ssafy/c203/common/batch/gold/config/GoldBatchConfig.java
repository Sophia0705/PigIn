package com.ssafy.c203.common.batch.gold.config;

import com.ssafy.c203.domain.gold.dto.request.GoldTradeDto;
import com.ssafy.c203.domain.gold.entity.GoldWaitingQueue;
import com.ssafy.c203.domain.gold.repository.GoldWaitingQueueRepository;
import com.ssafy.c203.domain.gold.service.GoldService;
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
public class GoldBatchConfig {

    private final GoldService goldService;
    private final GoldWaitingQueueRepository goldWaitingQueueRepository;
    private final JobRepository jobRepository;
    private final PlatformTransactionManager platformTransactionManager;

    @Bean
    public Job processGoldWaitingQueueJob() {
        return new JobBuilder("processGoldWaitingQueueJob", jobRepository)
                .start(processPendingGoldTradeStep())
                .build();
    }

    @Bean
    public Step processPendingGoldTradeStep() {
        return new StepBuilder("processPendingGoldTradeStep", jobRepository)
                .<GoldWaitingQueue, GoldWaitingQueue>chunk(1000, platformTransactionManager)
                .reader(waitingGoldQueueReader())
                .processor(waitingGoldQueueProcessor())
                .writer(waitingGoldQueueWriter())
                .faultTolerant()
                .retryLimit(3) // 최대 3번 재시도
                .retry(Exception.class) // 모든 예외에 대해 재시도
                .build();
    }

    @Bean
    public RepositoryItemReader<GoldWaitingQueue> waitingGoldQueueReader() {
        return new RepositoryItemReaderBuilder<GoldWaitingQueue>()
                .name("waitingGoldQueueReader")
                .pageSize(50)
                .methodName("findAll")
                .repository(goldWaitingQueueRepository)
                .sorts(Map.of("id", Sort.Direction.ASC))
                .build();
    }

    @Bean
    public ItemProcessor<GoldWaitingQueue, GoldWaitingQueue> waitingGoldQueueProcessor() {
        return waitingQueue -> {
            try {
                GoldTradeDto goldTradeDto = new GoldTradeDto();
                goldTradeDto.setTradePrice(waitingQueue.getTradePrice());
                goldTradeDto.setMethod(waitingQueue.getMethod().name());

                log.info("금 거래 요청 : memberId: {}, method: {}, tradePrice: {}", waitingQueue.getMember().getId(), waitingQueue.getMethod(), waitingQueue.getTradePrice());
                goldService.goldTradeRequest(goldTradeDto, waitingQueue.getMember().getId());

                return waitingQueue; // 성공한 주문 반환
            } catch (Exception e) {
                log.error("Error processing gold waiting queue (ID: {}): ", waitingQueue.getId(), e);
                throw e; // 예외를 던져 재시도 가능하도록 처리
            }
        };
    }

    @Bean
    public ItemWriter<GoldWaitingQueue> waitingGoldQueueWriter() {
        return new RepositoryItemWriterBuilder<GoldWaitingQueue>()
                .repository(goldWaitingQueueRepository)
                .methodName("delete")
                .build();
    }
}